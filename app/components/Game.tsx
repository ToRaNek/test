// app/components/Game.tsx
import React from 'react';

interface GameQuestion {
  type: 'audio' | 'image';
  question: string;
  previewUrl?: string;
  correct: string;
  choices: string[];
}

interface GameProps {
  question: GameQuestion;
  choices: string[];
  onAnswer: (choice: string) => void;
  scores: Record<string, number>;
}

export function Game({ question, choices, onAnswer, scores }: GameProps) {
  return (
    <div>
      <h2>{question.question}</h2>
      {question.type === 'audio' && <audio src={question.previewUrl} controls autoPlay />}
      {choices.map((c: string) => (
        <button key={c} onClick={() => onAnswer(c)} className="block my-2 bg-secondary rounded p-2">
          {c}
        </button>
      ))}
      <h3>Classement</h3>
      <ul>
        {Object.entries(scores).map(([k, v]) => (
          <li key={k}>
            {k}: {v}
          </li>
        ))}
      </ul>
    </div>
  );
}
