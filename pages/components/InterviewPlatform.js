// components/InterviewPlatform.js

import React, { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { Mic, MicOff, User } from "lucide-react";
import { Box, IconButton, Avatar, Typography, Button } from "@mui/material";

const InterviewPlatform = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [countdown, setCountdown] = useState(null); // Countdown starts as null

  // Main timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Start the countdown when timeLeft reaches 11 minutes
  useEffect(() => {
    if (timeLeft <= 11 * 60 && countdown === null) {
      setCountdown(60); // Start countdown at 60 seconds
    }
  }, [timeLeft, countdown]);

  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
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
  }, [countdown]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle transition to technical round
  const handleProceed = () => {
    alert("Proceeding to Technical Round");
    // Optionally, clear the screen or navigate to another page
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

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      bgcolor="#000"
      color="#fff"
    >
      {/* Timer */}
      <Typography
        variant="h4"
        component="div"
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

      {/* ReactMediaRecorder Component */}
      <ReactMediaRecorder
        audio
        onStop={(blobUrl, blob) => {
          console.log("Recording stopped. Blob URL:", blobUrl);
          setIsRecording(false);
          uploadAndTranscribeAudio(blob);
        }}
        render={({ status, startRecording, stopRecording }) => (
          <>
            {/* Microphone Control */}
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
                position: "absolute",
                bottom: 16,
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

            {/* Optional: Display recording status */}
            <Typography
              variant="body1"
              sx={{ position: "absolute", bottom: 80, color: "#bbb" }}
            >
              {status}
            </Typography>
          </>
        )}
      />

      {/* Proceed Button with Countdown Timer */}
      {countdown !== null && (
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
            variant="body1" // Changed from 'caption' to 'body1' for larger text
            color="red"
            sx={{ fontSize: "1.2rem", fontWeight: "bold" }} // Increased font size
          >
            Auto-proceeding in {countdown} seconds
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default InterviewPlatform;
