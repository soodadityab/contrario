// pages/api/upload.js

import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import transcribeAudio from "../utils/transcribe";
import getLLMResponse from "../utils/LLM_Response";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "/uploads");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("File parsing error:", err);
      return res.status(500).json({ message: "File upload error" });
    }

    const file = files.file || files.audio;
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    if (!uploadedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const tempPath = uploadedFile.filepath;
    const extension = path.extname(uploadedFile.originalFilename) || ".webm";

    const newFilePath = path.join(
      uploadDir,
      `recording_${Date.now()}${extension}`
    );

    try {
      await fs.promises.rename(tempPath, newFilePath);

      const transcription = await transcribeAudio(newFilePath);

      const LLM_response = await getLLMResponse(transcription);

      // Send a single response with both the transcription and LLM response
      res.status(200).json({ transcription, LLM_response });
    } catch (error) {
      console.error("Error during file processing:", error.message);
      res.status(500).json({ message: "Failed to process the audio file" });
    }
  });
}
