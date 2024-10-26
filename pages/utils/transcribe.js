import fs from "fs";
import Groq from "groq-sdk";

const groq = new Groq();

export default async function transcribeAudio(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Audio file not found.");
  }

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      response_format: "json",
      language: "en",
      temperature: 0.0,
    });

    return transcription.text;
  } catch (error) {
    console.error(
      "Transcription error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Transcription failed.");
  }
}
