// pages/api/uploadResume.js

import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: true, // Enable body parsing for JSON text
  },
};

// Directory for uploads
const uploadDir = path.join(process.cwd(), "/uploadResume");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  // Create the upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const { resumeText, jobDescriptionText } = req.body;

  if (!resumeText && !jobDescriptionText) {
    return res.status(400).json({ message: "No text provided" });
  }

  try {
    // Write resume text to a file
    if (resumeText) {
      const resumeFilePath = path.join(uploadDir, `resume_${Date.now()}.txt`);
      fs.writeFileSync(resumeFilePath, resumeText, "utf8");
    }

    // Write job description text to a file
    if (jobDescriptionText) {
      const jobDescFilePath = path.join(
        uploadDir,
        `jobDescription_${Date.now()}.txt`
      );
      fs.writeFileSync(jobDescFilePath, jobDescriptionText, "utf8");
    }

    res.status(200).json({ message: "Text uploaded successfully" });
  } catch (error) {
    console.error("File writing error:", error);
    res.status(500).json({ message: "File save error" });
  }
}
