import fetch from "node-fetch";

export default async function getLLMResponse(question) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content:
                "You are conducting a SWE interview. The candidate is asking you questions about the interview problem you gave.",
            },
            { role: "user", content: question },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`LLM Response failed: ${response.statusText}`);
    }

    const responseData = await response.json();
    const isolatedResponse = responseData.choices[0]?.message?.content || "";
    console.log(isolatedResponse);

    return isolatedResponse;
  } catch (error) {
    console.error(
      "Chat completion error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("LLM response generation failed.");
  }
}
