import { useState } from "react";
import "./MoodTracker.css";

const moods = [
    {
        id: 1,
        emoji: "😊",
        name: "Happy"
    },
    {
        id: 2,
        emoji: "🙂",
        name: "Good"
    },
    {
        id: 3,
        emoji: "😐",
        name: "Okay"
    },
    {
        id: 4,
        emoji: "😔",
        name: "Sad"
    },
    {
        id: 5,
        emoji: "😟",
        name: "Anxious"
    }
];

function MoodTracker() {

    const [selectedMood, setSelectedMood] =
        useState(null);

    const [saved, setSaved] =
        useState(false);


    const handleSaveMood = () => {

        if (!selectedMood) {
            return;
        }

        const moodEntry = {
            id: Date.now(),
            mood: selectedMood.name,
            emoji: selectedMood.emoji,
            date: new Date().toLocaleDateString()
        };


        const existingMoods =JSON.parse(localStorage.getItem("moodEntries")) || [];
        existingMoods.push(moodEntry);


        localStorage.setItem(
            "moodEntries",
            JSON.stringify(existingMoods)
        );


        setSaved(true);

        setSelectedMood(null);


        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };


    return (

        <div className="mood-page">

            <div className="mood-container">


                {/* Heading */}

                <div className="mood-header">

                    <span className="mood-label">
                        MINDCARE
                    </span>

                    <h1>
                        How are you feeling today?
                    </h1>

                    <p>
                        Take a moment to check in
                        with yourself.
                    </p>

                </div>


                {/* Mood Card */}

                <div className="mood-card">

                    <h3>
                        Choose your mood
                    </h3>


                    <div className="mood-options">

                        {moods.map((mood) => (

                            <button
                                key={mood.id}
                                type="button"
                                className={`mood-option ${
                                    selectedMood?.id === mood.id
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedMood(mood)
                                }
                            >

                                <span className="mood-emoji">
                                    {mood.emoji}
                                </span>

                                <span className="mood-name">
                                    {mood.name}
                                </span>

                            </button>

                        ))}

                    </div>


                    {/* Save Button */}

                    <button
                        type="button"
                        className="save-mood-btn"
                        onClick={handleSaveMood}
                        disabled={!selectedMood}
                    >
                        Save Today's Mood
                    </button>


                    {/* Success Message */}

                    {saved && (

                        <div className="mood-success">
                            ✓ Your mood has been saved
                            successfully.
                        </div>

                    )}

                </div>


                {/* Tip */}

               

            </div>

        </div>
    );
}

export default MoodTracker;