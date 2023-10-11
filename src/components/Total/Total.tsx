import React from 'react';
import './Total.scss';

function Total(props: { score: number, restartGame: () => void }) {
  const { score, restartGame } = props;

  return (
    <section className="total">
      <h1 className="total">
        {`Итог: ${score} из 1000 баллов`}
      </h1>
      <button
        type="button"
        onClick={restartGame}
      >
        New Game
      </button>
    </section>
  );
}

export default Total;
