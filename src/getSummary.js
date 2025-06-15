import { apiKey } from "./api";

export const getSummary = async (text) => {
  console.log("Loading...");
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
      }),
    }
  );
  console.log("Loaded!");
  const data = await response.json();
  console.log("data aa gya", { data });

  return data?.[0]?.summary_text || "No summary found.";
};
