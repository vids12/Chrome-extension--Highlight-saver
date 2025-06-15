/*global chrome*/
import { useEffect, useState } from "react";
import "./App.css";
import { getSummary } from "./getSummary";
import { formatRelativeTime } from "./getRelativeTime";

function App() {
  // const [highlights, setHighlights] = useState([
  //   {
  //     id: "6f3a5eae-2baf-4e7e-b5f5-8c5b8a9238af",
  //     date: "5/23/2025, 11:10:45 PM",
  //     location: "http://localhost:3000/",
  //     text: "Today is a great day. Weather forecast says that it might rain.",
  //   },
  //   {
  //     id: "a9c6f8cd-e6b4-4f03-91db-9fbb2cb3a17e",
  //     date: "5/23/2025, 11:15:12 PM",
  //     location: "https://developer.chrome.com/docs/extensions/",
  //     text: "Chrome Extensions allow you to extend browser functionality with HTML, CSS, and JavaScript.",
  //   },
  //   {
  //     id: "fa85b274-4d52-423a-bdc8-09d2e01efb3e",
  //     date: "5/24/2025, 12:05:37 AM",
  //     location: "https://react.dev/",
  //     text: "React is a JavaScript library for building user interfaces.",
  //   },
  //   {
  //     id: "e0d7f998-52e5-4460-9dc1-8cc1db32fcfd",
  //     date: "5/24/2025, 12:30:21 AM",
  //     location: "https://codeforces.com/problemset/problem/476/B",
  //     text: "Dreamoon and WiFi is a combinatorics problem involving probabilities and string manipulations.",
  //   },
  //   {
  //     id: "c9d4ee8b-e5e3-49ad-b8f0-7fc6a97a6c84",
  //     date: "5/24/2025, 12:45:10 AM",
  //     location: "https://huggingface.co/models",
  //     text: "Hugging Face provides a large collection of transformer models for NLP and beyond.",
  //   },
  // ]);

  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    chrome.storage?.local.get(["highlights"], (result) => {
      setHighlights(result.highlights || []);
    });
  }, []);

  const deleteHighlight = (id) => {
    const newHihghlights = highlights.filter(
      (highlight) => highlight.id !== id
    );
    setHighlights(newHihghlights);
    chrome.storage.local.set({ highlights: newHihghlights });
  };

  const deleteAllHighlight = () => {
    chrome.storage.local.clear();
    setHighlights([]);
  };

  const getSummaryHandler = async (text, id) => {
    setLoading(true);
    try {
      const summary = await getSummary(text);
      var highlightForSummary = highlights.find(
        (highlight) => highlight.id === id
      );
      highlightForSummary.summary = summary;
      chrome.storage.local.set({ highlights });
    } catch (err) {
      console.error("Error getting summary:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <header className="text-center">
        <h1 className="text-textMain text-2xl font-bold uppercase">
          Highlight Saver
        </h1>
        <p className="text-textSecondary text-base">
          Save and manage your text highlights across webpages. Here are your
          saved highlights:
        </p>
      </header>
      <main>
        {highlights.length === 0 ? (
          <p className="text-textMain text-lg font-bold">
            No highlights saved yet.
          </p>
        ) : (
          <div className="highlights-container">
            {highlights.map((highlight, index) => {
              return (
                <div
                  className="border border-border p-4 rounded-md mt-4 bg-white shadow-md"
                  key={index}
                >
                  <p className="text-textMain font-semibold text-base mb-2">
                    {highlight.text}
                  </p>
                  <p className="text-textSecondary text-sm mb-2">
                    Source:{" "}
                    <a
                      href={highlight.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {new URL(highlight.location).hostname}
                    </a>
                    • {formatRelativeTime(highlight.date)}
                  </p>
                  {loading && (
                    <p className="text-sm text-gray-500">Summarizing...</p>
                  )}
                  {error && (
                    <p className="text-sm text-red-500">
                      Error getting summary
                    </p>
                  )}
                  {highlight.summary && (
                    <div className="mt-4 bg-gray-100 p-3 rounded">
                      <strong>Summary:</strong>
                      <p>{highlight.summary}</p>
                    </div>
                  )}
                  <div className="flex gap-2 justify-end items-center mt-1">
                    <button
                      className="bg-primary text-white text-sm py-1 px-3 rounded hover:bg-hover disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        getSummaryHandler(highlight.text, highlight.id)
                      }
                      disabled={loading}
                    >
                      Summarize
                    </button>
                    <button
                      className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => deleteHighlight(highlight.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {highlights.length > 0 && (
          <button
            className="bg-red-500 text-white text-sm py-2 px-3 rounded hover:bg-red-600 mt-4"
            onClick={() => deleteAllHighlight()}
          >
            Clear All Highlights
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
