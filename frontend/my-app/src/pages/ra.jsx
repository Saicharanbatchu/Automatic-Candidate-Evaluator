import React, { useState } from 'react';
import axios from 'axios';
import './ra.css';

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [resumeList, setResumeList] = useState([]);
  const [result, setResult] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMultipleFileChange = (e) => {
    setResumeList(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('files[]', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Prediction response:', response.data);
      if (response.data && response.data.length > 0) {
        setResult(response.data[0]);
      } else {
        console.warn('Prediction response is empty or malformed:', response.data);
        alert('Classification failed: No data received.');
      }
    } catch (error) {
      console.error('Error during file upload or prediction:', error.response ? error.response.data : error.message);
      alert('Upload failed. Check console for details.');
    }
  };

  const handleRanking = async () => {
    if (!jobRole || resumeList.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      resumeList.forEach(resume => {
        formData.append('files[]', resume);
      });

      const predictResponse = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const fileNames = predictResponse.data.map(result => result.filename);

        try {
          const response = await axios.post('http://127.0.0.1:5000/rank', {
            job_role: jobRole,
            resumes: fileNames
          });
          setRanking(response.data);
        } catch (error) {
          console.error(error.response ? error.response.data : error.message);
          alert('Ranking failed.');
        } finally {
          setLoading(false);
        }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      alert('Upload failed.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Resume Analyzer</h1>

      <section className="card">
        <h2>Classify Single Resume</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Analyze</button>

        {result && (
          <div className="result">
            <p><strong>Classification:</strong> {result.data.classification}</p>
            <p><strong>Email:</strong> {result.data.contact_info.email}</p>
            <p><strong>Phone:</strong> {result.data.contact_info.phone}</p>
            <p><strong>Education:</strong> {Array.isArray(result.data.education) ? result.data.education.join(', ') : result.data.education}</p>
            <p><strong>Skills:</strong> {Array.isArray(result.data.skills) ? result.data.skills.join(', ') : result.data.skills}</p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Rank Resumes</h2>
        <textarea
          placeholder="Enter job description..."
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        ></textarea>
        <input type="file" multiple onChange={handleMultipleFileChange} />
        <button onClick={handleRanking} disabled={loading}>
          {loading ? 'Ranking...' : 'Rank Resumes'}
        </button>

        {ranking && (
          <div className="ranking-section">
            <div className="ranked-list">
              <h3>Ranked by Job Description</h3>
              {ranking.ranked_by_job_role.map((r, i) => (
                <p key={i}>{r.file} — <span>{r.score}</span></p>
              ))}
            </div>

            <div className="ranked-list">
              <h3>Ranked by Resume Similarity</h3>
              {ranking.ranked_by_similarity.map((r, i) => (
                <p key={i}>{r.file} — <span>{r.score}</span></p>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
