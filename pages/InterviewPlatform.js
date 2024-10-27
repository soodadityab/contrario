// pages/InterviewPlatform.js
import React, { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { Mic, MicOff, User } from "lucide-react";
import { Box, IconButton, Avatar, Typography, Button } from "@mui/material";
import Editor from "@monaco-editor/react";
import ScorecardPage from "./components/Scorecard"; // Import ScorecardPage

const InterviewPlatform = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [countdown, setCountdown] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [code, setCode] = useState(
    "// Create a function `find_duplicates(lst)` that finds and returns all duplicate values from a list.\n\nfunction find_duplicates(lst) {\n  // Your code here\n}"
  );
  const [hasProceeded, setHasProceeded] = useState(false);

  const technicalQuestion =
    "Create a function `find_duplicates(lst)` that finds and returns all duplicate values from a list.";

  // Main timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setShowScorecard(true); // Show Scorecard when timer runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Start countdown when timeLeft reaches 11 minutes
  useEffect(() => {
    if (timeLeft <= 19.9 * 60 && countdown === null) {
      setCountdown(60); // Start countdown at 60 seconds
    }
  }, [timeLeft, countdown]);

  // Countdown effect with hasProceeded check
  useEffect(() => {
    if (countdown !== null && countdown > 0 && !hasProceeded) {
      const countdownTimer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownTimer);
            handleProceed();
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [countdown, hasProceeded]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Handle transition to technical round
  const handleProceed = () => {
    alert("Proceeding to Technical Round");
    setShowEditor(true);
    setHasProceeded(true);
    setCountdown(null);
  };

  // Handle upload and transcription
  const uploadAndTranscribeAudio = async (audioBlob) => {
    console.log("Uploading audio blob for transcription:", audioBlob);

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const response = await fetch("/api/uploadAudio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Transcription successful:", data.transcription);
      } else {
        console.error("Transcription failed:", data.message);
      }
    } catch (error) {
      console.error("Error during audio upload and transcription:", error);
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const submitCode = () => {
    console.log("User's code:", code);
    setShowScorecard(true); // Set showScorecard to true upon submitting code
  };

  // Show ScorecardPage when time runs out or on code submission
  if (showScorecard) {
    return <ScorecardPage />;
  }

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100vw"
      bgcolor="#000"
      color="#fff"
    >
      {/* Timer */}
      <Typography
        variant="h4"
        position="absolute"
        top={16}
        left={16}
        color="#fff"
      >
        {formatTime(timeLeft)}
      </Typography>

      {/* Profile Picture */}
      <Box position="absolute" top={16} right={16}>
        <Avatar sx={{ bgcolor: "#333", width: 48, height: 48 }}>
          <User style={{ color: "#bbb" }} />
        </Avatar>
      </Box>

      {/* Conditional Rendering for Code Editor */}
      {showEditor && (
        <Box
          sx={{
            flexGrow: 1,
            marginTop: "80px",
            marginBottom: "80px",
            marginLeft: "16px",
            marginRight: "16px",
          }}
        >
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
          />
        </Box>
      )}

      {/* Proceed Button with Countdown Timer */}
      {countdown !== null && !hasProceeded && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleProceed}
            sx={{
              backgroundColor: "#00ff00",
              color: "#000",
              "&:hover": { backgroundColor: "#00cc00" },
              mb: 1,
            }}
          >
            Proceed to Technical Round
          </Button>
          <Typography
            variant="body1"
            color="red"
            sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
          >
            Auto-proceeding in {countdown} seconds
          </Typography>
        </Box>
      )}

      {/* Microphone Control at the Bottom */}
      <Box
        position="fixed"
        bottom={16}
        left="50%"
        sx={{ transform: "translateX(-50%)" }}
      >
        <ReactMediaRecorder
          audio
          onStop={(blobUrl, blob) => {
            setIsRecording(false);
            uploadAndTranscribeAudio(blob);
          }}
          render={({ status, startRecording, stopRecording }) => (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              {/* Recording Status */}
              <Typography variant="body1" sx={{ color: "#bbb", mb: 1 }}>
                {status}
              </Typography>
              <IconButton
                onClick={() => {
                  if (!isRecording) {
                    startRecording();
                    setIsRecording(true);
                  } else {
                    stopRecording();
                  }
                }}
                sx={{
                  backgroundColor: isRecording ? "#00ff00" : "#ff0000",
                  "&:hover": {
                    backgroundColor: isRecording ? "#00cc00" : "#cc0000",
                  },
                  transition: "background-color 0.2s ease",
                }}
              >
                {isRecording ? (
                  <Mic style={{ color: "#000", width: 24, height: 24 }} />
                ) : (
                  <MicOff style={{ color: "#000", width: 24, height: 24 }} />
                )}
              </IconButton>
            </Box>
          )}
        />
      </Box>

      {/* Submit Code Button */}
      {showEditor && (
        <Button
          variant="contained"
          onClick={submitCode}
          sx={{
            position: "absolute",
            bottom: 80,
            right: 16,
            backgroundColor: "#00ff00",
            color: "#000",
            "&:hover": { backgroundColor: "#00cc00" },
          }}
        >
          Submit Code
        </Button>
      )}
    </Box>
  );
};

export default InterviewPlatform;
