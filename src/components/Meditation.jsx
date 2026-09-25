import React from "react";
import "./Meditation.css";

const videos = [
    { id: 1, title: "5-Minute Breathing Meditation", description: "A short breathing exercise to help you calm down quickly.", src: "https://www.youtube.com/embed/inpok4MKVLM" },

    { id: 2, title: "10-Minute Meditation for Anxiety", description: "A guided session to help ease anxious thoughts and relax your mind.", src: "https://www.youtube.com/embed/O-6f5wQXSu8" },

    { id: 3, title: "Meditation for Better Sleep", description: "Wind down at the end of the day with this calming sleep meditation.", src: "https://www.youtube.com/embed/1ZYbU82GVz4" }
];

const Meditation = () => {
    return (
        <div className="meditation-page">

            <div className="meditation-title">
                <h1>Meditation</h1>
                <p>Take a few minutes each day to relax your mind and body with these guided meditations.</p>
            </div>

            <div className="video-list">
                {videos.map((video) => (
                    <div key={video.id} className="video-item">

                        <div className="video-box">
                            <iframe width="100%"
                             height="220"
                              src={video.src} 
                             title={video.title} frameBorder="0" allowFullScreen>
                                
                             </iframe>
                        </div>

                        <div className="video-text">
                            <h3>{video.title}</h3>
                            <p>{video.description}</p>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default Meditation;