import React from "react";
export function Game({ question, choices, answer, onAnswer, scores }: any) {
  return (
    <div>
      <h2>{question.question}</h2>
      {question.type === "audio" && (
        <audio src={question.previewUrl} controls autoPlay />
      )}
      {choices.map((c: string) => (
        <button key={c} onClick={() => onAnswer(c)} className="block my-2 bg-secondary rounded p-2">{c}</button>
      ))}
      <h3>Classement</h3>
      <ul>
        {Object.entries(scores).map(([k, v]) => (
          <li key={k}>{k}: {v}</li>
        ))}
      </ul>
    </div>
  );
}