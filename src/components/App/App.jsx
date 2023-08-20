import { useEffect, useState } from 'react';

import Preloader from '../Preloader/Preloader';

function App() {
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoYear, setPhotoYear] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoRegion, setPhotoRegion] = useState('');
  const [userYear, setUserYear] = useState(0);
  const [isAnswer, setIsAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isTotal, setIsTotal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function randomInteger(min, max) {
    // получить случайное число от (min) до (max)
    return Math.round(min + Math.random() * (max - min));
  }

  function getPoints() {
    const distance = Math.abs(photoYear - userYear);

    const points = 100 - distance;

    setScore(score + points);
  }

  function showAnswer() {
    setIsAnswer(true);

    getPoints();
  }

  function getFrame() {
    setIsLoading(true);
    
    fetch('https://api.kinopoisk.dev/v1.3/movie/random', {
      method: 'GET',
      headers: {
        "accept": "application/json",
        "X-API-KEY": "WT3PTTS-XX84176-GZ4PBCW-GAFHWRF",
      }
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        return res.text()
          .then((error) => Promise.reject(JSON.parse(error)));
      })
      .then((data) => {
        fetch(`https://api.kinopoisk.dev/v1/image?movieId=${data.id}`, {
          method: 'GET',
          headers: {
            "accept": "application/json",
            "X-API-KEY": "WT3PTTS-XX84176-GZ4PBCW-GAFHWRF",
          }
        })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
  
          return res.text()
            .then((error) => Promise.reject(JSON.parse(error)));
        })
        .then((data) => {
          let result;

          data.docs.forEach((image) => {
            if (image.type === 'still' || image.type === 'frame') {
              return result = image.url;
            }
          })

          if (result) {
            return result;
          }

          return Promise.reject('нет кадра');
        })
        .then((url) => setPhotoUrl(url))
        .catch(() => getFrame())

        setPhotoYear(data.year)
        setPhotoTitle(`Кадр из ${data.name}`)

        setPhotoRegion(data.countries.reduce((acc, region) => {
          acc.push(region.name);

          return acc;
        }, []).join(', '))

        setIsLoading(false)
      })
      .catch((err) => console.log(err))
  }

  function getPhoto() {
    const randomNumber = randomInteger(1, 5000000);

    setIsLoading(true);

    fetch(`https://pastvu.com/api2?method=photo.giveForPage&params={"cid":${randomNumber}}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        return res.text()
          .then((error) => {
            return Promise.reject(JSON.parse(error));
          });
      })
      .then((res) => {
        const { file, year, year2, title, regions } = res.result.photo;

        if (res.result.can.download === 'login') {
          setPhotoUrl(`https://pastvu.com/_p/d/${file}`);
          setPhotoYear(Math.round((year + year2) / 2));
          setPhotoTitle(title);

          setPhotoRegion(regions.reduce((acc, region) => {
            acc.push(region.title_local);

            return acc;
          }, []).join(', '))

          setIsLoading(false);
        } else {
          return Promise.reject();
        }

      })
      .catch(() => getPhoto())
  }

  function getRandomPhoto() {
    const randomApi = randomInteger(1, 1000);

    if (randomApi < 500) {
      getPhoto()
    } else {
      getFrame()
    }
  }

  function resetRound() {
    setIsAnswer(false);
    setUserYear(0);

    setRound(round + 1);
  }

  function restartGame() {
    setIsAnswer(false);
    setIsTotal(false);
    setUserYear(0)
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
            <div className="result">
              <p>{`Раунд: ${round} из 10`}</p>
              <p>{`Счет: ${score}`}</p>
            </div>
            {isLoading
              ? <Preloader />
              : (
                <img
                  src={photoUrl}
                  alt="Фото из PastVu"
                />
              )
            }
            {isAnswer &&
              <>
                <h1>
                  {`${photoYear} год. ${photoTitle}`}
                </h1>
                <p>{photoRegion}</p>
              </>
            }
            <p>
              {`Ваш ответ: ${userYear} год`}
            </p>
            <div className="slider">
              <p>1750</p>
              <input type="range"
                min="1750"
                max="2023"
                value={userYear}
                onChange={(evt) => setUserYear(evt.target.value)}
                className="slider__range"
                disabled={isAnswer}
              >
              </input>
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
              ?
              <button
                type="button"
                onClick={() => setIsTotal(true)}
                disabled={!isAnswer}
              >
                Total
              </button>
              :
              <button
                type="button"
                onClick={() => {
                  getRandomPhoto()
                  resetRound()
                }}
                disabled={!isAnswer}
              >
                Next
              </button>
            }
          </>
        )
      }
    </div>
  );
}

export default App;
