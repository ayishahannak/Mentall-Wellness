import React, { useState, useEffect } from "react";
import "./Journal.css";

const Journal = () => {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("journalEntries");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSave = () => {
    if (!text.trim())
         return;

    const entry = {
      id: Date.now(),
      text: text,
      date: new Date().toLocaleDateString(),
    };

    setEntries([entry, ...entries]);
    setText("");
  };

  return (
    <div className="journal-page">
      <div className="journal-title">
        <h1>Journal</h1>
        <p>A private space to write down your thoughts.</p>
      </div>

      <div className="journal-write">
        <textarea
          placeholder="What's on your mind today?"
          value={text}
          onChange={handleChange}
          rows={5}
        />

        <button className="journal-save" onClick={handleSave}>
          Save Entry
        </button>
      </div>

      <div className="journal-entries">
        {entries.map((entry) => (
          <div key={entry.id} className="journal-entry">
            <span className="entry-date">{entry.date}</span>
         <p className="entry-text">{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;