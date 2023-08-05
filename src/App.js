import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoYear, setPhotoYear] = useState(null);
  const [photoTitle, setPhotoTitle] = useState(null);
  const [result, setResult] = useState('');
  const [isAnswer, setIsAnswer] = useState(false)

  function randomInteger(min, max) {
    // получить случайное число от (min) до (max)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  function showAnswer() {
    setIsAnswer(true)
  }

  function getPhoto() {
    const randomNumber = randomInteger(1, 1000000);

    setIsAnswer(false)
    setResult(0)

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
        setPhotoUrl(res.result.photo.file);
        setPhotoYear(res.result.photo.year);
        setPhotoTitle(res.result.photo.title);
      })
      .catch((err) => console.log(err))
  }

  function handleRange(evt) {
    setResult(evt.target.value);
  }

  useEffect(() => {

    getPhoto()
  }, []);

  return (
    <div className="App">
      <img src={`https://pastvu.com/_p/d/${photoUrl}`} alt="logo" />
      <h1>
        {isAnswer && `${photoYear} ${photoTitle}`}
      </h1>
      <p>
        {`Ваш ответ: ${result}`}
      </p>
      <div className="slider">
      <p>1829</p>
      <input type="range"
        min="1826"
        max="2000"
        value={result}
        onChange={handleRange}
      >
      </input>
      <p>2000</p>
      </div>
      <button
        type="button"
        onClick={showAnswer}
      >
        Show
      </button>
      <button
        type="button"
        onClick={getPhoto}
      >
        Next
      </button>
    </div>
  );
}

export default App;
