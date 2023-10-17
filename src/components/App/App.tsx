/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';

import Total from '../Total/Total';
import Game from '../Game/Game';

interface Image {
  [key: string]: string,
}

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

  function getFrame(): void {
    const randomNumber = randomInteger(1, 1300000);

    fetch(`https://api.kinopoisk.dev/v1/image?movieId=${randomNumber}`, {
      method: 'GET',
      headers: {
        // eslint-disable-next-line quotes, quote-props, @typescript-eslint/quotes
        "accept": "application/json",
        // eslint-disable-next-line quotes, quote-props, @typescript-eslint/quotes
        "X-API-KEY": "WT3PTTS-XX84176-GZ4PBCW-GAFHWRF",
      },
    })
      .then((res) => {
        if (res.ok) return res.json();

        return res.text()
          .then((error) => Promise.reject(JSON.parse(error)));
      })
      .then((data) => {
        let result: Image | undefined;

        if (data.total === 0) return Promise.reject(new Error('нет фотографий'));

        data.docs.forEach((image: Image) => {
          if (
            image.type === 'screenshot'
            || image.type === 'frame'
            || image.type === 'still'
          ) result = image;
        });

        if (result) return result;

        return Promise.reject(new Error('нет кадра'));
      })
      .then((image) => {
        setPhotoUrl(image.url);

        fetch(`https://api.kinopoisk.dev/v1.3/movie/${image.movieId}`, {
          method: 'GET',
          headers: {
            // eslint-disable-next-line quotes, quote-props, @typescript-eslint/quotes
            "accept": "application/json",
            // eslint-disable-next-line quotes, quote-props, @typescript-eslint/quotes
            "X-API-KEY": "WT3PTTS-XX84176-GZ4PBCW-GAFHWRF",
          },
        })
          .then((res) => {
            if (res.ok) return res.json();

            return res.text()
              .then((error) => Promise.reject(JSON.parse(error)));
          })
          .then((movie) => {
            const { year, name, countries } = movie;

            setPhotoYear(year);
            setPhotoTitle(`Кадр из «${name}»`);

            setPhotoRegion(countries.reduce((acc: string[], region: Image) => {
              acc.push(region.name);

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

  function getPhoto(): void {
    const randomNumber = randomInteger(1, 5000000);

    fetch(`https://pastvu.com/api2?method=photo.giveForPage&params={"cid":${randomNumber}}`)
      .then((res) => {
        if (res.ok) return res.json();

        return res.text()
          .then((error) => Promise.reject(JSON.parse(error)));
      })
      // eslint-disable-next-line consistent-return
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

          setPhotoRegion(regions.reduce((acc: string[], region: Image) => {
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

  function getHistorypinPhoto() {
    const randomNumber = randomInteger(1, 1200000);

    fetch(`http://www.historypin.org/en/api/pin/get.json?id=${randomNumber}`)
      .then((res) => {
        if (res.ok) return res.json();

        return res.text()
          .then((error) => Promise.reject(JSON.parse(error)));
      })
      .then((res) => {
        const {
          caption,
          date,
          display,
          location,
        } = res;

        if (
          date === 'Date Unknown'
          || date === undefined
          || caption === ''
          || display.content === ''
          || location.geo_tags === ''
        ) return Promise.reject();

        if (date.length === 4 && Number(date) >= 1826) {
          setPhotoYear(Number(date));
        } else if (date.length === 11) {
          const averageYear = (Number(date.slice(0, 4)) + Number(date.slice(7))) / 2;

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

    if (randomApi <= 500) getPhoto();
    if (randomApi > 500 && randomApi <= 1000) getFrame();
    if (randomApi > 1000 && randomApi <= 1500) getHistorypinPhoto();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      )
  );
}

export default App;
