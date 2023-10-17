import React, { useEffect, useRef } from 'react';

import './Controller.scss';

import YearsSlider from '../YearsSlider/YearsSlider';

function Controller(props: {
  userYear: number,
  photoYear: number
  round: number,
  isAnswer: boolean,
  distance: number | null,
  setUserYear: (value: React.SetStateAction<number>) => void,
  setIsTotal: (value: React.SetStateAction<boolean>) => void,
  showAnswer: () => void,
  getRandomPhoto: () => void,
  resetRound: () => void,
}) {
  const {
    userYear,
    photoYear,
    round,
    isAnswer,
    distance,
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
      <YearsSlider
        userYear={userYear}
        photoYear={photoYear}
        isAnswer={isAnswer}
        distance={distance}
        setUserYear={setUserYear}
      />
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
