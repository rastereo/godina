import React from 'react';

import './Total.scss';

function Total(props: { score: number, restartGame: () => void }) {
  const { score, restartGame } = props;

  return (
    <main className="total">
      <h1>
        {`Итог: ${score} из 1000 баллов`}
      </h1>
      <button
        type="button"
        onClick={restartGame}
      >
        <span className="shadow" />
        <span className="edge" />
        <span className="front">
          New Game
        </span>
      </button>
    </main>
  );
}

export default Total;
