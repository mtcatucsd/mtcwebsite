// Home.jsx
import React, { useEffect, useRef } from 'react';
import './Home.css';
import mtcLogo from './images/mtc-logo.png';
import image1 from './images/image3.JPG';
import image2 from './images/image1.jpeg';
import image3 from './images/image2.JPG';
import eventFaisal from './images/event-faisal-mushtaq.png';
import eventPanel from './images/event-speaker-panel.png';
import eventPanelRecap from './images/event-speaker-panel-recap.png';

const PAST_EVENTS = [
  {
    title: 'Exploring Entrepreneurship with Faisal Mushtaq',
    date: 'Thursday, May 7 · Dolores Huerta Room',
    image: eventFaisal
  },
  {
    title: 'Speaker Panel',
    date: 'Thursday, April 23 · Price Center ERC Room',
    image: eventPanel
  },
  {
    title: 'Speaker Panel Recap',
    date: 'April 23, 2026',
    image: eventPanelRecap
  }
];

// Projects data remains the same
const PROJECTS = [
  {
    title: 'Workshop Series',
    description: 'Comprehensive workshop materials and hands-on projects covering machine learning, web development, and software engineering fundamentals. Access our extensive collection of resources including code samples, tutorials, and interactive learning materials.',
    image: image1,
    tech: ['Python', 'TensorFlow', 'React', 'Node.js'],
    link: 'https://drive.google.com/drive/u/1/folders/1CNWkzl_znJvKjW31b6ubw_RxEbAvh7rF'
  },
  {
    title: 'Islamic GenAI Guild',
    description: 'Pioneering project evaluating AI models on Islamic knowledge, creating comprehensive datasets for Fiqh and Aqeedah, and developing standardized grading systems. Features automated testing frameworks and detailed performance analytics.',
    image: image2,
    tech: ['Python', 'LangChain', 'Evaluation Framework', 'Dataset Creation'],
    link: 'https://mcc-genai-guild.vercel.app/'
  },
  {
    title: 'MTC Website',
    description: 'Modern, responsive website featuring a dynamic hero section and community engagement tools. Built with custom dark theme, Space Grotesk typography, and smooth animations. Includes Discord integration and mobile-first design.',
    image: image3,
    tech: ['React', 'Space Grotesk', 'CSS Grid', 'Discord Integration'],
    link: 'https://github.com/zainkhatri/mtc-website'
  }
];

// Reveals children with a fade/rise when they enter the viewport
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const handleClick = () => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div className="project-card" onClick={handleClick} style={{ cursor: project.link ? 'pointer' : 'default' }}>
      <div className="project-image">
        <img src={project.image} alt={project.title} />
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-tech">
          {project.tech.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
        {project.link && <span className="project-link">View project →</span>}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => (
  <div className="event-card">
    <div className="event-image">
      <img src={event.image} alt={event.title} />
    </div>
  </div>
);

const Hero = () => (
  <div className="hero">
    <div className="hero-aurora" aria-hidden="true">
      <span className="aurora-blob aurora-blob-1" />
      <span className="aurora-blob aurora-blob-2" />
      <span className="aurora-blob aurora-blob-3" />
    </div>
    <div className="hero-content">
      <div className="logo-container">
        <img src={mtcLogo} alt="MTC Logo" className="logo" />
      </div>
      <span className="hero-eyebrow">UC San Diego</span>
      <h1>muslim tech collaborative</h1>
      <p>@mtcatucsd</p>
      <div className="hero-actions">
        <a href="#projects" className="hero-secondary-link">Explore our projects</a>
      </div>
    </div>
  </div>
);

const JoinSection = () => {
  const handleJoinClick = () => {
    window.open('https://discord.gg/CJYPHGb8nS', '_blank', 'noopener noreferrer');
  };

  return (
    <section className="join-section" id="join">
      <div className="container">
        <Reveal>
          <div className="join-card">
            <h2>Join MTC</h2>
            <p>Get involved with projects, workshops, internship opportunities, and more!</p>
            <button className="join-button" onClick={handleJoinClick}>
              Join Our Discord
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

function Home() {
  return (
    <div className="home">
      <Hero />
      <section className="projects-section" id="projects">
        <div className="container">
          <Reveal>
            <h2>Our Projects</h2>
          </Reveal>
          <div className="projects-grid">
            {PROJECTS.map((project, index) => (
              <Reveal key={index} delay={index * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="events-section" id="events">
        <div className="container">
          <Reveal>
            <h2>Past Events</h2>
          </Reveal>
          <div className="events-grid">
            {PAST_EVENTS.map((event, index) => (
              <Reveal key={index} delay={index * 80}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <JoinSection />
    </div>
  );
}

export default Home;