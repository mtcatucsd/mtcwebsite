import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import mtcLogo from './images/mtc-logo.png';
import { GrainyGradientBackground } from './components/GrainyGradientBackground';

const NavBar = () => {
  return (
    <header className="site-nav">
      <nav className="main-nav">
        <a href="#top" className="nav-brand">
          <img src={mtcLogo} alt="MTC" className="nav-logo" />
        </a>
        <div className="nav-links">
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#events" className="nav-link">Events</a>
          <a href="#join" className="nav-link">Join</a>
          <a href="https://www.instagram.com/mtcatucsd/" target="_blank" rel="noopener noreferrer" className="nav-link">Instagram</a>
        </div>
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="app" id="top">
        <div className="site-background" aria-hidden="true">
          <GrainyGradientBackground className="site-background-canvas" />
        </div>
        <NavBar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Muslim Tech Collaborative at UCSD</p>
            <div className="social-links">
              <a href="https://www.instagram.com/mtcatucsd/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://discord.gg/CJYPHGb8nS" target="_blank" rel="noopener noreferrer">Discord</a>
              <a href="https://www.linkedin.com/company/mtcucsd/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;