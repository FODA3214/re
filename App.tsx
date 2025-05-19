import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ResultsPage from './components/ResultsPage';
import NotFoundPage from './components/NotFoundPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app" dir="rtl">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/results/:studentId" element={<ResultsPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
