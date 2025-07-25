import React, { useState } from 'react';
import './App.css';
import logo from './ssr-logo.png';  // Import the logo image

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    setLoading(true);  // Show loading state

    const res = await fetch("*LINK YOUR BACKEND SERVER*", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setResponse(data.answer);
    setLoading(false);  // Hide loading state
  };

  return (
    <div>
      <div className="container">
        {/* Display Logo */}
        <img src={logo} alt="Logo" className="logo" />

        <p className="hello-text">Hey There!</p>

        <h1>Query Claude</h1>
        <input
          type="text"
          value={question}
          placeholder="Ask something..."
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={askQuestion}>
          Ask
        </button>
        {loading ? (
          <p className="loading">Loading...</p> // Show loading state
        ) : (
          <p>{response}</p>
        )}
      </div>
    </div>
  );
}

export default App;
