import { useState } from 'react';

import Progress from '../Progress/Progress';
import Photograph from '../Photograph/Photograph';
import CorrectAnswer from '../CorrectAnswer/CorrectAnswer';
import Controller from '../Controller/Controller';
import Preloader from '../Preloader/Preloader';

import './Game.scss';

interface IGameProps {
  round: number;
  score: number;
  photoUrl: string | null;
  distance: number | null;
  photoYear: number | null;
  photoTitle: string;
  photoRegion: string;
  isAnswer: boolean;
  userYear: number;
  isLoading: boolean;
  setUserYear: (value: React.SetStateAction<number>) => void;
  setIsTotal: (value: React.SetStateAction<boolean>) => void;
  showAnswer: () => void;
  getRandomPhoto: () => void;
  resetRound: () => void;
}

function Game({
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
}: IGameProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <main className="game">
      <Progress round={round} score={score} />
      {isLoading ? (
        <Preloader />
      ) : (
        <Photograph
          link={photoUrl}
          distance={distance}
          getRandomPhoto={getRandomPhoto}
          setIsLoaded={setIsLoaded}
        />
      )}
      <CorrectAnswer
        year={photoYear}
        title={photoTitle}
        region={photoRegion}
        distance={distance}
        isAnswer={isAnswer}
      />
      <Controller
        userYear={userYear}
        photoYear={photoYear}
        isAnswer={isAnswer}
        distance={distance}
        round={round}
        setUserYear={setUserYear}
        setIsTotal={setIsTotal}
        showAnswer={showAnswer}
        resetRound={resetRound}
        isLoaded={isLoaded}
        setIsLoaded={setIsLoaded}
      />
    </main>
  );
}

export default Game;
