/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import Total from '../Total/Total';
import Game from '../Game/Game';
import BasicTable from '../BasicTable/BasicTable';

import apiConfig from '../../utils/apiConfig';

function App() {
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

  let isPhotoLoaded: boolean = false;

  function randomInteger(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
  }

  function getPoints() {
    if (photoYear) setDistance(Math.abs(photoYear - userYear));
  }

  function showAnswer() {
    setIsAnswer(true);

    getPoints();
  }

  async function getRandomPhoto() {
    if (isPhotoLoaded) return;

    const randomApi = randomInteger(0, apiConfig.length - 1);

    const { api, minId, maxId } = apiConfig[randomApi];

    try {
      const {
        url,
        year,
        title,
        region,
      } = await api.getPhoto(randomInteger(minId, maxId), isPhotoLoaded, randomInteger);

      setPhotoUrl(url);
      setPhotoYear(year);
      setPhotoTitle(title);
      setPhotoRegion(region);

      isPhotoLoaded = true;

      setIsLoading(false);
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

  return (
    isTotal
      ? <Total score={score} restartGame={restartGame} />
      : (
        <>
          <Game
            round={round}
            score={score}
            photoUrl={photoUrl}
            distance={distance}
            photoYear={photoYear}
            photoTitle={photoTitle}
            photoRegion={photoRegion}
            isAnswer={isAnswer}
            userYear={userYear}
            isLoading={isLoading}
            setUserYear={setUserYear}
            setIsTotal={setIsTotal}
            showAnswer={showAnswer}
            getRandomPhoto={getRandomPhoto}
            resetRound={resetRound}
          />
          {!isTotal && <BasicTable />}
        </>
      )
  );
}

export default App;
