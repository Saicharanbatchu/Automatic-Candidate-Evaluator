from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
import pickle
import fitz  # PyMuPDF
import pandas as pd
import numpy as np
import uuid
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Set and ensure upload folder exists
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load model and vectorizer
with open('resume_classifier_model.pkl', 'rb') as model_file:
    rf_classifier = pickle.load(model_file)

with open('tfidf_vectorizer.pkl', 'rb') as vectorizer_file:
    tfidf_vectorizer = pickle.load(vectorizer_file)

# Helper Functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['pdf', 'txt']

def extract_text_from_pdf(path):
    try:
        doc = fitz.open(path)
        return ''.join([page.get_text() for page in doc]).strip()
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ''

def read_text_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        print(f"Text file reading error: {e}")
        return ''

def clean_text(text):
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.lower().strip()

def extract_contact_info(text):
    contact = {}
    email = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    phone = re.search(r'\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b', text)
    contact['email'] = email.group(0) if email else 'Not found'
    contact['phone'] = phone.group(0) if phone else 'Not found'
    return contact

def extract_education(text):
    pattern = r"Bsc|B\. Pharmacy|Msc|M\. Pharmacy|Ph\.D|Bachelor|Master|B\.Tech|M\.Tech"
    matches = re.findall(pattern, text, re.IGNORECASE)
    matches = [m.strip() for m in matches]
    return matches if matches else "Not found"

def load_skill_keywords():
    try:
        df = pd.read_csv('skill.csv')
        return list(df['Skills'].dropna().str.lower())
    except Exception as e:
        print(f"Skill CSV loading error: {e}")
        return []

def extract_skills(text, keywords):
    return [k for k in keywords if k in text] or ["Not found"]

def parse_resume(text):
    cleaned = clean_text(text)
    contact = extract_contact_info(text)
    education = extract_education(text)
    skills = extract_skills(cleaned, load_skill_keywords())
    vector = tfidf_vectorizer.transform([cleaned])
    label = rf_classifier.predict(vector)
    return {
        "classification": label[0],
        "contact_info": contact,
        "education": education,
        "skills": skills
    }

def rank_resumes_by_job_role(job_role, file_paths):
    job_role_cleaned = clean_text(job_role)
    resume_texts = []
    valid_paths = []

    for path in file_paths:
        text = ''
        if path.endswith('.pdf'):
            text = extract_text_from_pdf(path)
        elif path.endswith('.txt'):
            text = read_text_file(path)
        if text:
            resume_texts.append(clean_text(text))
            valid_paths.append(path)

    documents = [job_role_cleaned] + resume_texts
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(documents)
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    ranked = sorted(zip(valid_paths, similarity), key=lambda x: x[1], reverse=True)
    return [{"file": os.path.basename(p), "score": round(s, 4)} for p, s in ranked]

def rank_multiple_resumes(file_paths):
    resume_texts = []
    valid_paths = []

    for path in file_paths:
        text = ''
        if path.endswith('.pdf'):
            text = extract_text_from_pdf(path)
        elif path.endswith('.txt'):
            text = read_text_file(path)
        if text:
            resume_texts.append(clean_text(text))
            valid_paths.append(path)

    if not resume_texts:
        return []

    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(resume_texts)
    similarity_matrix = cosine_similarity(tfidf_matrix)
    
    ranked = []
    for i, path in enumerate(valid_paths):
        score = round(np.mean(similarity_matrix[i]), 4)
        ranked.append({"file": os.path.basename(path), "score": score})

    ranked.sort(key=lambda x: x['score'], reverse=True)
    return ranked

# API Endpoints
@app.route('/predict', methods=['POST'])
def predict():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400

    files = request.files.getlist('files[]')
    if not files:
        return jsonify({'error': 'No files selected'}), 400

    results = []
    for file in files:
        if file and allowed_file(file.filename):
            # Generate a unique filename to prevent overwriting
            unique_filename = str(uuid.uuid4()) + '_' + file.filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(filepath)
            text = extract_text_from_pdf(filepath) if file.filename.endswith('.pdf') else read_text_file(filepath)

            if text:
                parsed = parse_resume(text)
                results.append({"filename": unique_filename, "data": parsed})
            else:
                results.append({"filename": unique_filename, "error": "No text extracted or unsupported file type."})
        else:
                # If the file is not allowed, unique_filename would not have been assigned.
                # Use the original filename for the error message.
                results.append({"filename": file.filename, "error": "Invalid file type. Use PDF or TXT only."})

    return jsonify(results)

@app.route('/rank', methods=['POST'])
def rank():
    data = request.json
    job_role = data.get('job_role')
    resume_files = data.get('resumes')

    if not job_role or not resume_files:
        return jsonify({"error": "Missing job_role or resumes"}), 400

    file_paths = [os.path.join(app.config['UPLOAD_FOLDER'], f) for f in resume_files]

    # Check if files actually exist
    missing_files = [f for f in file_paths if not os.path.exists(f)]
    if missing_files:
        return jsonify({"error": f"Some resumes not found: {missing_files}"}), 400

    ranked_by_job_role = rank_resumes_by_job_role(job_role, file_paths)
    ranked_by_similarity = rank_multiple_resumes(file_paths)

    return jsonify({
        "ranked_by_job_role": ranked_by_job_role,
        "ranked_by_similarity": ranked_by_similarity
    })

if __name__ == '__main__':
    app.run(debug=True)
