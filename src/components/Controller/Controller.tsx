import React, { useEffect, useRef } from 'react';

import './Controller.scss';

function Controller(props: {
  userYear: number,
  round: number,
  isAnswer: boolean
  setUserYear: (value: React.SetStateAction<number>) => void,
  setIsTotal: (value: React.SetStateAction<boolean>) => void
  showAnswer: () => void,
  getRandomPhoto: () => void,
  resetRound: () => void,
}) {
  const {
    userYear,
    isAnswer,
    round,
    setUserYear,
    setIsTotal,
    showAnswer,
    getRandomPhoto,
    resetRound,
  } = props;

  const inputNumber = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputNumber.current?.focus();
  }, [round]);

  return (
    <section className="controller">
      <p>
        Ваш ответ:
        <input
          type="number"
          value={userYear.toString()}
          onChange={(evt) => setUserYear(Number(evt.target.value))}
          min={1826}
          max={new Date().getFullYear()}
          disabled={isAnswer}
          ref={inputNumber}
        />
        год
      </p>
      <div className="slider">
        <p>1826</p>
        <input
          type="range"
          min="1826"
          max={new Date().getFullYear()}
          value={userYear}
          onChange={(evt) => setUserYear(Number(evt.target.value))}
          className="slider__range"
          disabled={isAnswer}
        />
        <p>{new Date().getFullYear()}</p>
      </div>
      <button
        type="button"
        onClick={showAnswer}
        disabled={isAnswer || userYear === 0}
      >
        <span className="shadow" />
        <span className="edge" />
        <span className="front">
          Submit
        </span>
      </button>
      {round === 10
        ? (
          <button
            type="button"
            onClick={() => setIsTotal(true)}
            disabled={!isAnswer}
          >
            <span className="shadow" />
            <span className="edge" />
            <span className="front">
              Total
            </span>
          </button>
        )
        : (
          <button
            type="submit"
            onClick={() => {
              getRandomPhoto();
              resetRound();
            }}
            disabled={!isAnswer}
          >
            <span className="shadow" />
            <span className="edge" />
            <span className="front">
              Next
            </span>
          </button>
        )}
    </section>
  );
}

export default Controller;
