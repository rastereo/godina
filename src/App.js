import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoYear, setPhotoYear] = useState(null);
  const [photoTitle, setPhotoTitle] = useState(null);
  const [userYear, setUserYear] = useState(0);
  const [isAnswer, setIsAnswer] = useState(false)

  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)

  const [isTotal, setIsTotal] = useState(false)

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
    setIsAnswer(true)

    getPoints()
  }

  function getPhoto() {
    const randomNumber = randomInteger(1, 10000000);

    fetch(`https://pastvu.com/api2?method=photo.giveForPage&params={"cid":${randomNumber}}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        return res.text()
          .then((error) => {
            return Promise.reject(JSON.parse(error))
          });
      })
      .then((res) => {
        const { file, year, title } = res.result.photo

        setPhotoUrl(file);
        setPhotoYear(year);
        setPhotoTitle(title);

      })
      .catch((err) => {
        getPhoto();
      })
  }

  function handleRange(evt) {
    setUserYear(evt.target.value);
  }

  function resetRound() {
    setIsAnswer(false)
    setUserYear(0)

    setRound(round + 1)
  }

  function restartGame() {
    setIsAnswer(false);
    setIsTotal(false);
    setUserYear(0)
    setScore(0);
    setRound(1);
    getPhoto();

    console.log(round, 'до getPhoto')
  }

  useEffect(() => {
    getPhoto()
  }, []);

  return (
    <div className="App">
      {isTotal
        ? (
          <>
            <h1 className="total">{`Итог: ${score}`}</h1>
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
            <img src={`https://pastvu.com/_p/d/${photoUrl}`} alt="logo" />
            <h1>
              {isAnswer && `${photoYear} ${photoTitle}`}
            </h1>
            <p>
              {`Ваш ответ: ${userYear}`}
            </p>
            <div className="slider">
              <p>1826</p>
              <input type="range"
                min="1826"
                max="2000"
                value={userYear}
                onChange={handleRange}
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
