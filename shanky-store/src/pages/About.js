import React from "react";

const About = () => (
  <div style={{ maxWidth: 600, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: 32 }}>
    <h2 style={{ textAlign: "center", color: "#1976d2", marginBottom: 24 }}>About Us</h2>
    <p style={{ fontSize: 18, textAlign: "center", marginBottom: 24 }}>
      Welcome to Shanky Store!<br />
      This project is developed and maintained by <strong>Shashank Kumar</strong>.<br />
      Connect with me on LinkedIn:<br />
      <a href="https://www.linkedin.com/in/shashank-kumar-89b0ba249/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", fontWeight: 600 }}>
        linkedin.com/in/shashank-kumar-89b0ba249/
      </a>
    </p>
  </div>
);

export default About; 