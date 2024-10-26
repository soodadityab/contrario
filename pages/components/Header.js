// Header.js
import React, { useState } from "react";
import Image from "next/image";
import Body from "./Body";
import Scorecard from "./Scorecard";

const Header = () => {
  const [showScorecard, setShowScorecard] = useState(false);

  const handleClick = () => {
    setShowScorecard(true);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: "20px",
      }}
    >
      {/* Render ScorecardPage if showScorecard is true */}
      {showScorecard ? (
        <ScorecardPage />
      ) : (
        <>
          {/* Logo */}
          <div style={{ width: "400px" }}>
            <Image
              src="/contrario.png"
              alt="Contrario Logo"
              width={400}
              height={200}
              style={{
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Description Textbox */}
          <div
            style={{
              marginTop: "10px",
              padding: "15px 20px",
              textAlign: "center",
              width: "70%",
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              color: "#f0f0f0",
            }}
          >
            <p
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "18px",
                lineHeight: "1.6",
              }}
            >
              Welcome to <strong>Contrario AI</strong>'s first-ever{" "}
              <strong>talent screening software</strong>. This program will
              guide users through a series of steps including{" "}
              <strong>resume upload</strong> and{" "}
              <strong>job description</strong> input to tailor the experience.
              Following that, users will undergo{" "}
              <strong>talent screening assessments</strong>, including
              behavioral and technical evaluations, with an{" "}
              <strong>evaluative scorecard</strong> provided at the end.
            </p>
          </div>

          {/* Body Component for Steps */}
          <Body />

          {/* Button to Render Scorecard */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleClick}
              style={{
                color: "white",
                backgroundColor: "transparent",
                border: "none",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Go to New Page
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
