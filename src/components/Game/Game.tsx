import React from 'react';

import './Game.scss';

import Progress from '../Progress/Progress';
import Photograph from '../Photograph/Photograph';
import CorrectAnswer from '../CorrectAnswer/CorrectAnswer';
import Controller from '../Controller/Controller';
import Preloader from '../Preloader/Preloader';

function Game(props: {
  round: number,
  score: number,
  photoUrl: string,
  distance: number | null,
  photoYear: number,
  photoTitle: string
  photoRegion: string,
  isAnswer: boolean,
  userYear: number,
  isLoading: boolean
  setUserYear: (value: React.SetStateAction<number>) => void,
  setIsTotal: (value: React.SetStateAction<boolean>) => void,
  showAnswer: () => void,
  getRandomPhoto: () => void,
  resetRound: () => void,
}) {
  const {
    round,
    score,
    photoUrl,
    distance,
    photoYear,
    photoTitle,
    photoRegion,
    isAnswer,
    userYear,
    isLoading,
    setUserYear,
    setIsTotal,
    showAnswer,
    getRandomPhoto,
    resetRound,
  } = props;

  return (
    <main className="game">
      <Progress round={round} score={score} />
      {isLoading
        ? <Preloader />
        : <Photograph link={photoUrl} distance={distance} />}
      <CorrectAnswer
        year={photoYear}
        title={photoTitle}
        region={photoRegion}
        distance={distance}
        isAnswer={isAnswer}
      />
      <Controller
        userYear={userYear}
        isAnswer={isAnswer}
        round={round}
        setUserYear={setUserYear}
        setIsTotal={setIsTotal}
        showAnswer={showAnswer}
        getRandomPhoto={getRandomPhoto}
        resetRound={resetRound}
      />
    </main>
  );
}

export default Game;
