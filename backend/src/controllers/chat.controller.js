const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are LocalServe's friendly and helpful AI support assistant. LocalServe is a hyperlocal service marketplace that connects customers with trusted local service providers (plumbers, electricians, cleaners, AC repair technicians, etc.).

Your responsibilities:
- Answer questions about how LocalServe works (searching, booking, payments, reviews).
- Help users understand how to become a service provider.
- Provide guidance on common issues (login problems, booking cancellations, refunds).
- Be concise, warm, and professional. Keep answers under 3 sentences when possible.
- If you don't know the answer, suggest contacting aum.pethani@gmail.com or calling 8309726581.

Do NOT answer questions unrelated to LocalServe or home/local services.`;

const chatWithGroq = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY is not configured in environment variables.");
      return res.status(500).json({ error: "Chat service is not configured." });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", response.status, errorData);
      return res.status(502).json({ error: "Failed to get a response from the AI service." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat controller error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { chatWithGroq };
