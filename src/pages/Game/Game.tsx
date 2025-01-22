import { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';

import Progress from '../../components/Progress/Progress';
import Photograph from '../../components/Photograph/Photograph';
import CorrectAnswer from '../../components/CorrectAnswer/CorrectAnswer';
import Controller from '../../components/Controller/Controller';
import Preloader from '../../components/Preloader/Preloader';
import Total from '../../components/Total/Total';
import apiConfig from '../../utils/apiConfig';

import './Game.scss';

// interface IGameProps {
//   round: number;
//   score: number;
//   photoUrl: string | null;
//   distance: number | null;
//   photoYear: number | null;
//   photoTitle: string;
//   photoRegion: string;
//   isAnswer: boolean;
//   userYear: number;
//   isLoading: boolean;
//   setUserYear: (value: React.SetStateAction<number>) => void;
//   setIsTotal: (value: React.SetStateAction<boolean>) => void;
//   showAnswer: () => void;
//   getRandomPhoto: () => void;
//   resetRound: () => void;
//   seconds: number;
// }

function Game() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoYear, setPhotoYear] = useState<number | null>(null);
  const [photoTitle, setPhotoTitle] = useState<string>('');
  const [photoRegion, setPhotoRegion] = useState<string>('');
  const [userYear, setUserYear] = useState<number>(0);
  const [isAnswer, setIsAnswer] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [isTotal, setIsTotal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  let isPhotoLoaded: boolean = false;

  function randomInteger(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
  }

  let expiryTimestamp: Date = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 30);

  const { seconds, isRunning, pause, restart } = useTimer({
    expiryTimestamp,
  });

  function getPoints() {
    if (photoYear) setDistance(Math.abs(photoYear - userYear));
  }

  function showAnswer() {
    setIsAnswer(true);
    pause();
    getPoints();
  }

  async function getRandomPhoto() {
    if (isPhotoLoaded) return;

    const randomApi = randomInteger(0, apiConfig.length - 1);

    const { api, minId, maxId } = apiConfig[randomApi];

    try {
      const { url, year, title, region } = await api.getPhoto(
        randomInteger(minId, maxId),
        isPhotoLoaded,
        randomInteger
      );

      setPhotoUrl(url);
      setPhotoYear(year);
      setPhotoTitle(title);
      setPhotoRegion(region);

      isPhotoLoaded = true;

      setIsLoading(false);

      expiryTimestamp = new Date();
      expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 30);

      restart(expiryTimestamp);
    } catch {
      getRandomPhoto();
    }
  }

  function resetRound() {
    isPhotoLoaded = false;

    setIsLoading(true);
    setPhotoUrl(null);
    setPhotoYear(null);
    setDistance(null);
    setIsAnswer(false);
    setUserYear(0);
    setRound(round + 1);

    getRandomPhoto();
  }

  function restartGame() {
    isPhotoLoaded = false;

    setIsLoading(true);
    setPhotoUrl(null);
    setPhotoYear(null);
    setIsAnswer(false);
    setUserYear(0);
    setIsTotal(false);
    setScore(0);
    setRound(1);
    setDistance(null);

    getRandomPhoto();
  }

  useEffect(() => {
    getRandomPhoto();
  }, []);

  useEffect(() => {
    let points = 0;

    if (distance !== null && distance <= 30) {
      points = Math.round(-0.1 * (distance + 0.5) ** 2 + 100);
    }

    setScore(score + points);
  }, [distance]);

  useEffect(() => {
    console.log(isRunning);
    if (!isRunning) {
      showAnswer();
    }
  }, [isRunning]);

  return isTotal ? (
    <Total score={score} restartGame={restartGame} />
  ) : (
    <main className="game">
      <Progress
        round={round}
        score={score}
        seconds={seconds}
        isLoading={isLoading}
      />
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
