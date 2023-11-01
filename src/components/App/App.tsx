/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';

import Total from '../Total/Total';
import Game from '../Game/Game';

import pastVuApi from '../../utils/PastVuApi';
import historyPinApi from '../../utils/HistoryPinApi';
import kinopoiskApi from '../../utils/KinopoiskApi';
import BasicTable from '../BasicTable/BasicTable';

function App() {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoYear, setPhotoYear] = useState<number>(0);
  const [photoTitle, setPhotoTitle] = useState<string>('');
  const [photoRegion, setPhotoRegion] = useState<string>('');
  const [userYear, setUserYear] = useState<number>(0);
  const [isAnswer, setIsAnswer] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [isTotal, setIsTotal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function randomInteger(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
  }

  function getPoints(): void {
    setDistance(Math.abs(photoYear - userYear));
  }

  function showAnswer(): void {
    setIsAnswer(true);

    getPoints();
  }

  function getKinopoiskStill(): void {
    const randomId = randomInteger(1, 1000000);

    kinopoiskApi.getStillList(randomId)
      .then((data) => {
        if (data.total > 0) {
          const { imageUrl } = data.items[randomInteger(1, data.items.length)];

          return imageUrl;
        }

        return Promise.reject();
      })
      .then((image) => {
        setPhotoUrl(image);

        kinopoiskApi.getFilmInfo(randomId)
          .then(({ year, nameRu, countries }) => {
            setPhotoYear(year);
            setPhotoTitle(`Кадр из «${nameRu}»`);

            setPhotoRegion(countries.reduce((acc: string[], region: {
              [key: string]: string,
            }) => {
              acc.push(region.country);

              return acc;
            }, []).join(', '));

            setIsLoading(false);
          })
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          .catch(() => getRandomPhoto());
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(() => getRandomPhoto());
  }

  function getPastVuPhoto(): void {
    const randomNumber = randomInteger(1, 5000000);

    pastVuApi.getPhoto(randomNumber)
      .then((res) => {
        const {
          file,
          year,
          year2,
          title,
          regions,
        } = res.result.photo;

        if (res.result.can.download === 'login' && year >= 1826) {
          setPhotoUrl(`https://pastvu.com/_p/d/${file}`);
          setPhotoYear(Math.round((year + year2) / 2));
          setPhotoTitle(title);

          setPhotoRegion(regions.reduce((acc: string[], region: {
            [key: string]: string,
          }) => {
            acc.push(region.title_local);

            return acc;
          }, []).join(', '));

          setIsLoading(false);
        } else {
          return Promise.reject();
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(() => getRandomPhoto());
  }

  function getHistoryPinPhoto(): void {
    const randomNumber = randomInteger(1, 1182800);

    historyPinApi.getPhoto(randomNumber)
      .then(({
        caption,
        date,
        display,
        location,
      }) => {
        if (date.length === 4 && Number(date) >= 1826) {
          setPhotoYear(Number(date));
        } else if (date.length === 11) {
          const averageYear = Math.round((Number(date.slice(0, 4)) + Number(date.slice(7))) / 2);

          if (averageYear >= 1826) {
            setPhotoYear(averageYear);
          } else return Promise.reject();
        } else return Promise.reject();

        if (display.content.includes('http')) {
          setPhotoUrl(display.content);
        } else return Promise.reject();

        setPhotoTitle(caption);
        setPhotoRegion(location.geo_tags);

        setIsLoading(false);
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(() => getRandomPhoto());
  }

  function resetRound(): void {
    setDistance(null);
    setIsAnswer(false);
    setUserYear(0);
    setDistance(null);
    setRound(round + 1);
  }

  const getRandomPhoto = (): void => {
    const randomApi = randomInteger(1, 1500);

    setIsLoading(true);

    if (randomApi <= 500) getPastVuPhoto();
    if (randomApi > 500 && randomApi <= 1000) getKinopoiskStill();
    if (randomApi > 1000) getHistoryPinPhoto();
  };

  function restartGame(): void {
    setIsAnswer(false);
    setIsTotal(false);
    setUserYear(0);
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
