import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

interface Student {
  id: number;
  name: string;
  phone: string;
  password: string;
}

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load student data
    fetch('/student_data.json')
      .then(response => response.json())
      .then(data => {
        setStudents(data.students);
      })
      .catch(err => {
        console.error('Error loading student data:', err);
        setError('Error loading student data. Please try again later.');
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const student = students.find(
        s => s.name.toLowerCase() === name.toLowerCase() && s.password === password
      );

      if (student) {
        // Show success animation
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
          loginForm.classList.add('success');
        }

        // Redirect to results page after animation
        setTimeout(() => {
          navigate(`/results/${student.id}`);
        }, 1000);
      } else {
        setError('Invalid name or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src="/images/adel_logo_small.jpg" alt="The Eagle Series" className="eagle-logo" />
          </div>
          <h1 className="animate-text">✨ The Eagle Series ✨</h1>
          <h2 className="animate-text">Final Exam Results</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group animate-text">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group animate-text">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button animate-text"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              '📊 View Results'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="animate-text">👨‍🏫 Teacher: Mr. Adel Louis</p>
          <p className="animate-text">💻 Developed by: Fadi Ishak</p>
          <img src="/images/fadi_logo_small.jpg" alt="Fadi Ishak" className="developer-logo" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
