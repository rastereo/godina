/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';

import Total from '../Total/Total';
import Game from '../Game/Game';

import pastVuApi from '../../utils/PastVuApi';
import historyPinApi from '../../utils/HistoryPinApi';
import kinopoiskApi from '../../utils/KinopoiskApi';
import BasicTable from '../BasicTable/BasicTable';
import { IApi, IContentPhoto } from '../../types';

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

  function setContentPhoto(
    api: IApi,
    min: number,
    max: number,
  ) {
    const randomIp = randomInteger(min, max);

    api.getPhoto(randomIp, isPhotoLoaded)
      .then(({
        url,
        year,
        title,
        region,
      }: IContentPhoto) => {
        setPhotoUrl(url);
        setPhotoYear(year);
        setPhotoTitle(title);
        setPhotoRegion(region);

        isPhotoLoaded = true;

        setIsLoading(false);
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(getRandomPhoto);
  }

  function fetchWithTimeout(resource: string) {
    const timeout = 5000;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response: any = fetch(resource, {
      signal: controller.signal,
    }).then((res) => {
      clearTimeout(id);

      return res;
    }).catch((error) => {
      clearTimeout(id);

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getRandomPhoto();

      throw error;
    });

    return response;
  }

  function showAnswer() {
    setIsAnswer(true);

    getPoints();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getKinopoiskStill() {
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

            isPhotoLoaded = true;

            setIsLoading(false);
          })
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          .catch(() => getRandomPhoto());
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(() => getRandomPhoto());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getHistoryPinPhoto(): void {
    setContentPhoto(historyPinApi, 1, 1300000);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getLOCPhoto() {
    fetchWithTimeout(`https://www.loc.gov/photos/?fo=json&c=1&sp=${randomInteger(1, 150000)}`)
      .then((res: Response) => {
        if (res.ok) return res.json();

        return Promise.reject();
      })
      .then((image: any) => {
        const sliceYear = Number(image.content.results[0].date.slice(0, 4));
        if (
          sliceYear
          && sliceYear >= 1826
          && !isPhotoLoaded
          && image.content.results[0].image_url.length > 0
          && image.content.results[0].image_url[0] !== 'https://www.loc.gov/static/images/original-format/personal-narrative.svg'
          && image.content.results[0].image_url[0] !== 'https://www.loc.gov/static/images/original-format/group-of-images.svg'
        ) {
          setPhotoYear(sliceYear);

          setPhotoUrl(
            image.content.results[0].image_url[image.content.results[0].image_url.length - 1],
          );

          setPhotoTitle(image.content.results[0].title);

          setPhotoRegion(image.content.results[0].location.join('. '));

          isPhotoLoaded = true;

          setIsLoading(false);
        } else return Promise.reject();
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(() => getRandomPhoto());
  }

  const getRandomPhoto = (): void => {
    if (isPhotoLoaded) return;

    const randomApi = randomInteger(1, 4000);

    if (randomApi <= 1000) setContentPhoto(pastVuApi, 1, 5000000);
    if (randomApi > 1000 && randomApi <= 2000) getKinopoiskStill();
    if (randomApi > 2000 && randomApi <= 3000) setContentPhoto(historyPinApi, 1, 1300000);
    if (randomApi > 3000) getLOCPhoto();
  };

  function resetRound(): void {
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

  function restartGame(): void {
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
