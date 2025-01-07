// src/pages/api/proxy.js

export default async function handler(req, res) {
  const { query } = req.query; // Extract query from request
  const apiKey = "2f823db7a513455fd234e7268273706681fc5dea2debdfa4e3a542ba402587cd"; // Use API key from environment variables

  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing" });
  }

  if (!query) {
    return res.status(400).json({ error: "Query parameter is missing" });
  }

  try {
    const response = await fetch(
      `https://serpapi.com/search?engine=google_autocomplete&q=${encodeURIComponent(query)}&api_key=${apiKey}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Error from SerpAPI: ${response.statusText}` });
    }

    const data = await response.json();
    return res.status(200).json(data); // Forward the response to the frontend
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
