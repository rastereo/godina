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

  function getPoints(): void {
    if (photoYear) setDistance(Math.abs(photoYear - userYear));
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

            isPhotoLoaded = true;

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

        if (res.result.can.download === 'login' && year >= 1826 && !isPhotoLoaded) {
          setPhotoUrl(`https://pastvu.com/_p/d/${file}`);
          setPhotoYear(Math.round((year + year2) / 2));
          setPhotoTitle(title);

          setPhotoRegion(regions.reduce((acc: string[], region: {
            [key: string]: string,
          }) => {
            acc.push(region.title_local);

            return acc;
          }, []).join(', '));

          isPhotoLoaded = true;

          setIsLoading(false);
        } else {
          return Promise.reject();
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(() => getRandomPhoto());
  }

  function getHistoryPinPhoto(): void {
    const randomNumber = randomInteger(1, 1300000);

    historyPinApi.getPhoto(randomNumber)
      .then(({
        caption,
        date,
        display,
        location,
      }) => {
        if (!isPhotoLoaded) {
          if (date.length === 4 && Number(date) >= 1826) {
            setPhotoYear(Number(date));
          } else if (date.length === 11) {
            const averageYear = Math.round((Number(date.slice(0, 4)) + Number(date.slice(7))) / 2);

            if (averageYear >= 1826) {
              setPhotoYear(averageYear);
            } else return Promise.reject();
          } else if (date.length === 10) {
            const sliceYear = Number(date.slice(0, 4));

            if (sliceYear >= 1826) {
              setPhotoYear(sliceYear);
            } else return Promise.reject();
          } else return Promise.reject();

          if (
            display.content.includes('http')
            && display.content !== 'https://photos-cdn.historypin.org/services/thumb/phid/1095200/dim/1000x1000/c/1512924030'
          ) {
            // https://photos-cdn.historypin.org/services/thumb/phid/1078627/dim/1000x1000/c/1499828996
            setPhotoUrl(display.content);
          } else return Promise.reject();

          setPhotoTitle(caption);
          setPhotoRegion(location.geo_tags);

          isPhotoLoaded = true;

          setIsLoading(false);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(() => getRandomPhoto());
  }

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

    if (randomApi <= 1000) getPastVuPhoto();
    if (randomApi > 1000 && randomApi <= 2000) getKinopoiskStill();
    if (randomApi > 2000 && randomApi <= 3000) getHistoryPinPhoto();
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
