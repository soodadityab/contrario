import fetch from "node-fetch";

export default async function getDubbedFile(req, res) {
  if (req.method === "GET") {
    const { dubbingId } = req.query;

    try {
      // First, check the status of the dubbing
      const statusResponse = await fetch(
        `https://api.elevenlabs.io/v1/dubbing/${dubbingId}`,
        {
          method: "GET",
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY,
          },
        }
      );

      const statusData = await statusResponse.json();

      if (!statusResponse.ok) {
        console.error("Error fetching dubbing status:", statusData);
        return res.status(statusResponse.status).json(statusData);
      }

      const dubbingStatus = statusData.status;

      if (dubbingStatus === "completed" || dubbingStatus === "dubbed") {
        // Fetch the dubbed file
        const languageCode = "fr"; // Use the target language code
        const fileResponse = await fetch(
          `https://api.elevenlabs.io/v1/dubbing/${dubbingId}/audio/${languageCode}`,
          {
            method: "GET",
            headers: {
              "xi-api-key": process.env.ELEVENLABS_API_KEY,
            },
          }
        );

        if (!fileResponse.ok) {
          const fileError = await fileResponse.json();
          console.error("Error fetching dubbed file:", fileError);
          return res.status(fileResponse.status).json(fileError);
        }

        // Set appropriate headers and pipe the response
        res.setHeader(
          "Content-Type",
          fileResponse.headers.get("Content-Type") || "application/octet-stream"
        );
        res.setHeader("Content-Disposition", "inline");

        fileResponse.body.pipe(res);
      } else if (
        dubbingStatus === "in_progress" ||
        dubbingStatus === "dubbing" ||
        dubbingStatus === "queued" ||
        dubbingStatus === "processing"
      ) {
        // Dubbing is still in progress
        return res.status(200).json({ status: "in_progress" });
      } else if (dubbingStatus === "failed") {
        // Handle failed status
        console.error("Dubbing failed:", statusData);
        return res.status(200).json({ status: "failed", detail: statusData });
      } else {
        // Handle any other unexpected statuses
        console.error("Unexpected dubbing status:", statusData);
        return res.status(200).json({ status: "unknown", detail: statusData });
      }
    } catch (error) {
      console.error("Error fetching dubbing status:", error);
      return res
        .status(500)
        .json({ error: "Error fetching dubbing status from ElevenLabs API" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
