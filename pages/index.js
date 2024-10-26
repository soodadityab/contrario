// pages/index.js

import React from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";

// Dynamically import the InterviewPlatform component with SSR disabled
const InterviewPlatform = dynamic(
  () => import("./components/InterviewPlatform"),
  { ssr: false }
);

const HomePage = () => {
  return (
    <Box>
      <InterviewPlatform />
    </Box>
  );
};

export default HomePage;
