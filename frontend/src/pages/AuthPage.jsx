import React from "react";
import { SignInButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import "../styles/auth.css";

const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="overlay"></div>

      {/* TOP LEFT LOGO */}
      <div className="top-left-logo">
        <img src="/logo.png" alt="IntMeet" id="logoIMG" />
        
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1 className="hero-title">IntelliMeet!</h1>
          <p className="hero-subtitle">
            Connect, collaborate, and manage your meetings seamlessly!
          </p>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          className="auth-right"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="auth-card">
            <motion.div
              className="features-list"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {[
                ["💬", "Real-time messaging"],
                ["🎥", "Video calls & meetings"],
                ["🔒", "Secure & private"],
                ["📝", "Real-Time Digital Whiteboard"],
                ["🔊", "Voice-to-Text Transcription"],
              ].map(([icon, text]) => (
                <div className="feature-item" key={text}>
                  <span className="feature-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button"
              >
                Get Started with IntelliMeet →
              </motion.button>
            </SignInButton>
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="auth-footer">
        <p>© 2025 IntelliMeet. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
