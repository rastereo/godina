import React, { useEffect, useState } from 'react';

import Progress from '../Progress/Progress';
import Preloader from '../Preloader/Preloader';

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
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isTotal, setIsTotal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function randomInteger(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
  }

  function getPoints(): void {
    const distance = Math.abs(Number(photoYear) - userYear);

    let points = 0;

    if (distance <= 30) points = Math.round(-0.1 * (distance + 0.5) ** 2 + 100);

    setScore(score + points);
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

  function getPhoto() {
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

        if (res.result.can.download === 'login') {
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

  function resetRound() {
    setIsAnswer(false);
    setUserYear(0);

    setRound(round + 1);
  }

  const getRandomPhoto = (): void => {
    const randomApi = randomInteger(1, 1000);

    setIsLoading(true);

    if (randomApi < 500) {
      getPhoto();
    } else {
      getFrame();
    }
  };

  function restartGame() {
    setIsAnswer(false);
    setIsTotal(false);
    setUserYear(0);
    setScore(0);
    setRound(1);

    getRandomPhoto();
  }

  useEffect(() => {
    getRandomPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <main>
        {isTotal
          ? (
            <>
              <h1 className="total">{`Итог: ${score} из 1000 баллов`}</h1>
              <button
                type="button"
                onClick={restartGame}
              >
                New Game
              </button>
            </>
          )
          : (
            <>
              <Progress round={round} score={score} />
              {isLoading
                ? <Preloader />
                : (
                  <div className="test">
                    <img
                      src={photoUrl}
                      alt="Фото из PastVu"
                    />
                  </div>
                )}
              {isAnswer
                && (
                  <>
                    <h1>
                      {`${photoYear} год. ${photoTitle}`}
                    </h1>
                    <p>{photoRegion}</p>
                  </>
                )}
              <p>
                {`Ваш ответ: ${userYear} год`}
              </p>
              <div className="slider">
                <p>1750</p>
                <input
                  type="range"
                  min="1750"
                  max="2023"
                  value={userYear}
                  onChange={(evt) => setUserYear(Number(evt.target.value))}
                  className="slider__range"
                  disabled={isAnswer}
                />
                <p>2023</p>
              </div>
              <button
                type="button"
                onClick={showAnswer}
                disabled={isAnswer || userYear === 0}
              >
                Submit
              </button>
              {round === 10
                ? (
                  <button
                    type="button"
                    onClick={() => setIsTotal(true)}
                    disabled={!isAnswer}
                  >
                    Total
                  </button>
                )
                : (
                  <button
                    type="button"
                    onClick={() => {
                      getRandomPhoto();
                      resetRound();
                    }}
                    disabled={!isAnswer}
                  >
                    Next
                  </button>
                )}
            </>
          )}
      </main>
    </div>
  );
}

export default App;
