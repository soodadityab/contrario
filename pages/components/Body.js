// Body.js
import React, { useState } from "react";
import { useRouter } from "next/router";

const Body = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleResumeFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "resume");

      await fetch("/api/uploadResume", {
        method: "POST",
        body: formData,
      });
    }
  };

  const handleJobDescriptionFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "jobDescription");

      await fetch("/api/uploadResume", {
        method: "POST",
        body: formData,
      });
    }
  };

  const handleResumeTextChange = (event) => setResumeText(event.target.value);
  const handleJobDescriptionTextChange = (event) =>
    setJobDescriptionText(event.target.value);

  const handleSubmit = async () => {
    await fetch("/api/uploadResume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescriptionText }),
    });

    // Navigate to InterviewPlatform after the fetch completes
    router.push("/InterviewPlatform");
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
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "10px",
        }}
      >
        <div style={labelStyle}>Step 1: Upload Your Resume</div>
        <div style={labelStyle}>Step 2: Upload Job Description</div>
        <div style={labelStyle}>Step 3: Start Screening!</div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
        }}
      >
        <UploadResumeCard
          faded={step > 1}
          editable={step === 1}
          onFileUpload={handleResumeFileUpload}
          onTextChange={handleResumeTextChange}
          showNextButton={!!resumeText}
          onNext={handleNext}
        />
        <UploadJobDescriptionCard
          faded={step !== 2}
          editable={step === 2}
          onFileUpload={handleJobDescriptionFileUpload}
          onTextChange={handleJobDescriptionTextChange}
          showNextButton={!!jobDescriptionText}
          onNext={handleNext}
          onBack={handleBack}
        />
        <StartScreeningCard
          faded={step !== 3}
          editable={step === 3}
          onBack={handleBack}
          onSubmit={handleSubmit}
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
      disabled={!editable}
    />
    <p style={{ margin: "10px 0", color: "#aaa" }}>Or paste your resume:</p>
    <textarea
      placeholder="Paste resume text here..."
      onChange={onTextChange}
      style={textareaStyle}
      disabled={!editable}
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
    <label>Upload Your Job Desc. (PDF or JPEG):</label>
    <input
      type="file"
      accept=".pdf, .jpeg, .jpg"
      onChange={onFileUpload}
      style={{ margin: "10px 0", width: "100%" }}
      disabled={!editable}
    />
    <p style={{ margin: "10px 0", color: "#aaa" }}>
      Or paste your job description:
    </p>
    <textarea
      placeholder="Paste job description here..."
      onChange={onTextChange}
      style={textareaStyle}
      disabled={!editable}
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

const StartScreeningCard = ({ faded, editable, onBack, onSubmit }) => (
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
      {editable && (
        <button onClick={onSubmit} style={nextButtonStyle}>
          I'm Ready!
        </button>
      )}
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
  opacity: faded ? 0.5 : 1,
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
