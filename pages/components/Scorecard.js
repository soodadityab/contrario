import React from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { CheckCircle, Cancel, Download, ArrowRight } from "@mui/icons-material";
import Image from "next/image";

// Dynamic score color function
const getScoreColor = (score, maxScore) => {
  const ratio = score / maxScore;
  if (ratio <= 0.2) return "darkred";
  if (ratio <= 0.7) return "#b58900";
  return "darkgreen";
};

// Function to calculate the average score
const calculateOverallScore = (scores) => {
  const scoreValues = Object.values(scores);
  const total = scoreValues.reduce((acc, score) => acc + score, 0);
  const average = total / scoreValues.length;
  return parseFloat(average.toFixed(1));
};

// Color logic based on score value
const getProgressColor = (value) => (value >= 3 ? "success" : "error");

// Component to display individual score items horizontally
const HorizontalScoreItem = ({ label, value }) => (
  <Box display="flex" alignItems="center" gap={1} mb={2}>
    <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 120 }}>
      {label}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={(value / 5) * 100}
      sx={{
        width: "100%",
        bgcolor: getScoreColor(value, 5),
      }}
      color={getProgressColor(value)}
    />
    <Typography variant="body1">{value}/5</Typography>
  </Box>
);

const ScorecardPage = ({ feedback = {} }) => {
  // Fallback for scores to avoid undefined errors
  const scores = feedback.scores || {};

  // Check if feedback.scores exists to calculate the overall score
  const overallScore = feedback.scores ? calculateOverallScore(scores) : null;
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        color: "white",
        backgroundColor: "black",
        padding: 2,
        overflow: "auto",
        position: "relative",
      }}
    >
      {/* Header */}
      <Typography
        variant="h1"
        sx={{
          fontSize: "32px",
          fontFamily: "Roboto, sans-serif",
          textAlign: "left",
          marginBottom: 2,
        }}
      >
        Talent Assessment Scorecard
      </Typography>

      {/* Logo on the top right */}
      <Box sx={{ position: "absolute", top: "20px", right: "20px" }}>
        <Image
          src="/contrarionobg.png"
          alt="Contrario Logo"
          width={200}
          height={80}
        />
      </Box>

      {/* Display error message if scores are missing */}
      {!feedback.scores ? (
        <Typography color="error" variant="h6">
          Scores data not available.
        </Typography>
      ) : (
        <Box display="flex" justifyContent="center">
          <Card
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              padding: 4,
              width: isSmallScreen ? "100%" : "80%",
            }}
          >
            {/* Left Section: Candidate Information */}
            <Box flex={1} padding={2}>
              <Typography variant="h5" color="success.main" gutterBottom>
                {feedback.position} at {feedback.company}
              </Typography>
              <Typography variant="body1">
                <strong>Candidate:</strong> {feedback.name}
              </Typography>
              <Typography variant="body1">
                <strong>Interview ID:</strong> {feedback.interviewId}
              </Typography>
              <Typography variant="body1">
                <strong>Job Description:</strong> {feedback.jobDescription}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center" flexDirection="column">
                <Typography variant="body1" fontWeight="bold">
                  Overall Score
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={(overallScore / 5) * 100}
                  color={getProgressColor(overallScore)}
                  size={60}
                  thickness={5}
                  sx={{ marginY: 1 }}
                />
                <Typography variant="body1" fontWeight="bold">
                  {overallScore}/5
                </Typography>
              </Box>
            </Box>

            {/* Middle Section: Evaluations */}
            <Box flex={1} padding={2}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                Technical Evaluation
              </Typography>
              {["accuracy", "problemSolving", "communication"].map(
                (scoreKey) => (
                  <HorizontalScoreItem
                    key={scoreKey}
                    label={
                      scoreKey === "problemSolving"
                        ? "Clean Code"
                        : scoreKey.charAt(0).toUpperCase() + scoreKey.slice(1)
                    }
                    value={scores[scoreKey]}
                  />
                )
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="textPrimary" gutterBottom>
                Behavioral Evaluation
              </Typography>
              {["confidence", "eloquence", "wording"].map((scoreKey) => (
                <HorizontalScoreItem
                  key={scoreKey}
                  label={scoreKey.charAt(0).toUpperCase() + scoreKey.slice(1)}
                  value={scores[scoreKey]}
                />
              ))}
            </Box>

            {/* Right Section: Summary */}
            <Box flex={1} padding={2}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                Summary
              </Typography>
              <Box display="flex" gap={2}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="success.main"
                    fontWeight="bold"
                  >
                    Strengths
                  </Typography>
                  <List dense>
                    {feedback.strengths.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="error.main"
                    fontWeight="bold"
                  >
                    Weaknesses
                  </Typography>
                  <List dense>
                    {feedback.weaknesses.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Cancel color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" gap={3} alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1" fontWeight="bold">
                    Transcript
                  </Typography>
                  <Download />
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body1" fontWeight="bold">
                    Technical Questions
                  </Typography>
                  <List dense>
                    {feedback.technical_qs.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ArrowRight fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default ScorecardPage;
