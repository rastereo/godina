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

        if (res.result.can.download === 'login'){
          setPhotoUrl(file);
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

    getPhoto();
  }

  useEffect(() => {
    getPhoto();
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
                  src={`https://pastvu.com/_p/d/${photoUrl}`}
                  alt="Фото из PstVu"
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
                max="2000"
                value={userYear}
                onChange={(evt) => setUserYear(evt.target.value)}
                className="slider__range"
                disabled={isAnswer}
              >
              </input>
              <p>2000</p>
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
                  getPhoto()
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
