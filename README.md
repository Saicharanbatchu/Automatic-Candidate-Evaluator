## Project Description

ACE App is a comprehensive application designed to assist with resume analysis and classification. It features a React-based frontend, a Flask backend for resume processing and classification, and a Node.js server for additional functionalities, potentially including database interactions.

## Features

- *Single Resume Classification*: Upload a single resume to classify it into predefined categories and extract key information such as contact details, education, and skills.
- *Multiple Resume Ranking (Planned/Partial)*: Functionality to handle multiple resumes, likely for ranking or batch processing.
- *Resume Data Extraction*: Extracts contact information (email, phone), education, and skills from uploaded resumes.
- *Machine Learning Powered Classification*: Utilizes a pre-trained scikit-learn model (resume_classifier_model.pkl) and TF-IDF vectorizer (tfidf_vectorizer.pkl) for resume classification.

## Technologies Used

*Frontend (React)*:
- React
- Vite
- npm

*Backend (Flask)*:
- Python
- Flask
- Flask-CORS
- PyMuPDF (for PDF processing)
- pandas
- numpy
- scikit-learn (version 1.4.2)

*Server (Node.js)*:
- Node.js
- Express (likely, based on routes and middleware folders)
- MongoDB (indicated by "Connected to MongoDB" in logs)

## Setup Instructions

To set up and run the ACE App locally, follow these steps:

### 1. Clone the Repository

bash
git clone <your-repository-link-here>
cd ACE_App


### 2. Backend Setup

Navigate to the backend directory and install the required Python dependencies. It's recommended to use a virtual environment.

bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # On Windows
# source .venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt


### 3. Frontend Setup

Navigate to the frontend/my-app directory and install the Node.js dependencies.

bash
cd ../frontend/my-app
npm install


### 4. Node.js Server Setup

Navigate to the server directory and install the Node.js dependencies.

bash
cd ../../server
npm install


### 5. Environment Variables

Ensure you have .env files in the backend and server directories with necessary configurations (e.g., database connection strings, API keys if any).

### 6. Running the Application

Open three separate terminal windows and run the following commands in their respective directories:

*Terminal 1: Run Flask Backend*

bash
cd ACE_App\backend
.venv\Scripts\activate  # On Windows
# source .venv/bin/activate  # On macOS/Linux
python app.py


*Terminal 2: Run React Frontend*

bash
cd ACE_App\frontend\my-app
npm run dev


*Terminal 3: Run Node.js Server*

bash
cd ACE_App\server
node server.js


Once all three servers are running, you can access the application in your web browser at http://localhost:5173/.

## Usage

- *Classify Single Resume*: On the main page, use the designated section to upload a single resume file (e.g., PDF). The application will process it and display the classification, contact information, education, and skills.
- *Multiple Resume Ranking*: (If implemented) Follow the instructions on the UI for uploading and ranking multiple resumes.

## Troubleshooting

- If you encounter InconsistentVersionWarning for scikit-learn, ensure scikit-learn==1.4.2 is specified in requirements.txt and reinstall dependencies.
- If the "Classify single resume" functionality results in a blank screen or errors, check the browser's developer console for TypeError messages and ensure the backend response structure matches the frontend's expectations.
- Ensure all three servers (Flask, React, Node.js) are running concurrently.
