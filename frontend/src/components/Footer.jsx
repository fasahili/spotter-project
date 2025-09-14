import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} TripTrack. All rights reserved.</p>
      <div className="footer-links">
        <a href="#!" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
        <span>|</span>
        <a href="#!" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>
        <span>|</span>
        <a href="#!" target="_blank" rel="noopener noreferrer">
          Contact
        </a>
      </div>
    </footer>
  );
}
