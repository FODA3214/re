import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <button onClick={handleGoHome} className="home-button">
          Return to Home Page
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
