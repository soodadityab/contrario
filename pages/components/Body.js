// Body.js
import React, { useState } from "react";

const Body = () => {
  const [step, setStep] = useState(1);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeTextEntered, setResumeTextEntered] = useState(false);
  const [jobDescriptionUploaded, setJobDescriptionUploaded] = useState(false);
  const [jobDescriptionTextEntered, setJobDescriptionTextEntered] =
    useState(false);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleResumeFileUpload = (event) => {
    if (event.target.files.length > 0) {
      setResumeUploaded(true);
    }
  };

  const handleJobDescriptionFileUpload = (event) => {
    if (event.target.files.length > 0) {
      setJobDescriptionUploaded(true);
    }
  };

  const handleResumeTextChange = (event) => {
    setResumeTextEntered(event.target.value.trim() !== "");
  };

  const handleJobDescriptionTextChange = (event) => {
    setJobDescriptionTextEntered(event.target.value.trim() !== "");
  };

  return (
    <div
      style={{
        width: "80%",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Labels */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        <div style={labelStyle}>Step 1: Upload Your Resume</div>
        <div style={labelStyle}>Step 2: Upload Job Description</div>
        <div style={labelStyle}>Step 3: Start Screening!</div>
      </div>

      {/* Cards */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
        }}
      >
        <UploadResumeCard
          faded={step > 1} // Fade when moving to the next step
          editable={step === 1} // Editable only when step is 1
          onFileUpload={handleResumeFileUpload}
          onTextChange={handleResumeTextChange}
          showNextButton={resumeUploaded || resumeTextEntered}
          onNext={handleNext}
        />
        <UploadJobDescriptionCard
          faded={step !== 2} // Visible only when step is 2
          editable={step === 2} // Editable only when step is 2
          onFileUpload={handleJobDescriptionFileUpload}
          onTextChange={handleJobDescriptionTextChange}
          showNextButton={jobDescriptionUploaded || jobDescriptionTextEntered}
          onNext={handleNext}
          onBack={handleBack}
        />
        <StartScreeningCard
          faded={step !== 3}
          editable={step === 3}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

// Label Styling
const labelStyle = {
  textAlign: "center",
  color: "white",
  width: "30%",
  padding: "10px",
  fontSize: "18px",
};

// Card Components
const UploadResumeCard = ({
  faded,
  editable,
  onFileUpload,
  onTextChange,
  showNextButton,
  onNext,
}) => (
  <div style={{ ...cardContainerStyle(faded) }}>
    <label>Upload Your Resume (PDF or JPEG):</label>
    <input
      type="file"
      accept=".pdf, .jpeg, .jpg"
      onChange={onFileUpload}
      style={{ margin: "10px 0", width: "100%" }}
      disabled={!editable} // Disable when not editable
    />
    <p style={{ margin: "10px 0", color: "#aaa" }}>Or paste your resume:</p>
    <textarea
      placeholder="Paste resume text here..."
      onChange={onTextChange}
      style={textareaStyle}
      disabled={!editable} // Disable when not editable
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
      }}
    >
      {showNextButton && editable && (
        <button onClick={onNext} style={nextButtonStyle}>
          Next
        </button>
      )}
    </div>
  </div>
);

const UploadJobDescriptionCard = ({
  faded,
  editable,
  onFileUpload,
  onTextChange,
  showNextButton,
  onNext,
  onBack,
}) => (
  <div style={{ ...cardContainerStyle(faded) }}>
    <label>Upload Your Job Description (PDF or JPEG):</label>
    <input
      type="file"
      accept=".pdf, .jpeg, .jpg"
      onChange={onFileUpload}
      style={{ margin: "10px 0", width: "100%" }}
      disabled={!editable} // Disable when not editable
    />
    <p style={{ margin: "10px 0", color: "#aaa" }}>
      Or paste your job description:
    </p>
    <textarea
      placeholder="Paste job description here..."
      onChange={onTextChange}
      style={textareaStyle}
      disabled={!editable} // Disable when not editable
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
      }}
    >
      {editable && (
        <button onClick={onBack} style={backButtonStyle}>
          Back
        </button>
      )}
      {showNextButton && editable && (
        <button onClick={onNext} style={nextButtonStyle}>
          Next
        </button>
      )}
    </div>
  </div>
);

const StartScreeningCard = ({ faded, editable, onBack }) => (
  <div style={{ ...cardContainerStyle(faded) }}>
    <p>
      Start screening now! Your talent assessment will include technical and
      behavioral evaluations.
    </p>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
      }}
    >
      {editable && (
        <button onClick={onBack} style={backButtonStyle}>
          Back
        </button>
      )}
      {editable && <button style={nextButtonStyle}>I'm Ready!</button>}
    </div>
  </div>
);

// Common Styles for the Cards
const cardContainerStyle = (faded) => ({
  width: "30%",
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "15px",
  color: "white",
  opacity: faded ? 0.5 : 1, // Fade based on the faded prop
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  transition: "opacity 0.5s ease",
});

// Style for textareas
const textareaStyle = {
  width: "100%",
  height: "100px",
  padding: "10px",
  resize: "none",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "16px",
  overflowY: "auto",
};

// Style for the Next button
const nextButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

// Style for the Back button
const backButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#888",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

export default Body;
