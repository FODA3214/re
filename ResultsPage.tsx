import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResultsPage.css';

interface Student {
  id: number;
  name: string;
  phone: string;
  password: string;
  score: number;
  percentage: number;
  grade: string;
  notes: string;
  certificate?: boolean;
  absent?: boolean;
  pdfUrl?: string;
}

interface ExamData {
  title: string;
  total_marks: number;
  pass_percentage: number;
  model_answer_url: string;
  notes: string[];
}

const ResultsPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load student data
    fetch('/student_data.json')
      .then(response => response.json())
      .then(data => {
        setExamData(data.exam);
        const foundStudent = data.students.find((s: Student) => s.id === parseInt(studentId || '0'));
        
        if (foundStudent) {
          setStudent(foundStudent);
          
          // Play celebration sound and animation for high grades
          if (foundStudent.grade.includes('A')) {
            const audio = new Audio('/celebration.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            setShowConfetti(true);
            
            // Trigger confetti animation
            const duration = 3 * 1000;
            const end = Date.now() + duration;
            
            const frame = () => {
              // Create confetti effect
              const confettiElements = document.querySelectorAll('.confetti');
              confettiElements.forEach(el => {
                el.classList.add('animate');
              });
              
              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            };
            
            frame();
          }
        } else {
          setError('Student data not found');
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading student data:', err);
        setError('Error loading student data');
        setLoading(false);
      });
  }, [studentId]);

  const handleLogout = () => {
    navigate('/');
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A+')) return '#1e7e34';
    if (grade.includes('A')) return '#28a745';
    if (grade.includes('B')) return '#17a2b8';
    if (grade.includes('C')) return '#ffc107';
    if (grade.includes('D')) return '#fd7e14';
    return '#dc3545'; // F grade
  };

  const getGradeEmoji = (grade: string) => {
    if (grade.includes('A+')) return '🏆';
    if (grade.includes('A')) return '🌟';
    if (grade.includes('B')) return '👍';
    if (grade.includes('C')) return '😊';
    if (grade.includes('D')) return '🤔';
    return '😢'; // F grade
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading results... 📊</p>
      </div>
    );
  }

  if (error || !student || !examData) {
    return (
      <div className="error-container">
        <h2>Error ❌</h2>
        <p>{error || 'Student data not found'}</p>
        <button onClick={handleLogout} className="back-button">Return to Login</button>
      </div>
    );
  }

  return (
    <div className="results-container">
      {showConfetti && (
        <>
          <div className="confetti left"></div>
          <div className="confetti right"></div>
        </>
      )}
      <div className="results-card">
        <div className="results-header">
          <div className="logo-container">
            <img src="/images/adel_logo_small.jpg" alt="The Eagle Series" className="eagle-logo" />
          </div>
          <h1>✨ The Eagle Series - Exam Results ✨</h1>
          <div className="student-info">
            <h2>{student.name}</h2>
          </div>
        </div>
        
        <div className="results-content">
          <div className="score-display">
            <div 
              className="score-circle" 
              style={{ 
                background: `conic-gradient(${getGradeColor(student.grade)} ${student.percentage}%, #f0f0f0 0)` 
              }}
            >
              <div className="score-inner">
                <span className="score-value">{student.score}</span>
                <span className="score-total">/ {examData.total_marks}</span>
              </div>
            </div>
            
            <div className="score-details">
              <div className="percentage">{student.percentage}%</div>
              <div 
                className="grade" 
                style={{ backgroundColor: getGradeColor(student.grade) }}
              >
                {getGradeEmoji(student.grade)} {student.grade}
              </div>
            </div>
          </div>
          
          {student.notes && (
            <div className="student-notes">
              <p>{student.notes}</p>
            </div>
          )}
          
          {student.certificate && (
            <div className="certificate-section">
              <h3>🎉 Congratulations! 🎉</h3>
              <p>You can download your certificate of excellence</p>
              <button className="certificate-button">🏆 Download Certificate</button>
            </div>
          )}
          
          <div className="downloads-section">
            <h3>📝 Answer Sheets</h3>
            <div className="download-buttons">
              {!student.absent && student.pdfUrl && (
                <a 
                  href={student.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="download-button student-answer"
                >
                  📄 Download My Answer Sheet
                </a>
              )}
              <a 
                href={examData.model_answer_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="download-button model-answer"
              >
                📋 Download Model Answer
              </a>
            </div>
          </div>
          
          <div className="general-notes">
            <h3>📎 Important Notes:</h3>
            <ul>
              {examData.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="results-footer">
          <button onClick={handleLogout} className="logout-button">Logout</button>
          <div className="credits">
            <p>Teacher: Mr. Adel Louis 👨‍🏫</p>
            <p>Developed by: Fadi Ishak 💻</p>
            <img src="/images/fadi_logo_small.jpg" alt="Fadi Ishak" className="developer-logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
