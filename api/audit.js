export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY no configurada" });

  try {
    const { messages, tools, max_tokens, model, system } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        tools,
        messages,
      }),
    });

    const data = await response.json();

    // Attach cost calculation to response
    if (data.usage) {
      const inputTokens = (data.usage.input_tokens || 0) + (data.usage.cache_read_input_tokens || 0);
      const outputTokens = data.usage.output_tokens || 0;
      const cacheWriteTokens = data.usage.cache_creation_input_tokens || 0;
      const cost = 
        (inputTokens * 0.000003) + 
        (outputTokens * 0.000015) +
        (cacheWriteTokens * 0.00000375); // cache write costs 1.25x input
      data._cost = {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        cost: parseFloat(cost.toFixed(5)),
      };
    }

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
