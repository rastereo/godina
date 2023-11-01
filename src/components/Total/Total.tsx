import React, { useEffect, useState } from 'react';

import './Total.scss';

import { TextField } from '@mui/material';
import mainApi from '../../utils/MainApi';

function Total(props: { score: number, restartGame: () => void }) {
  const { score, restartGame } = props;
  const [value, setValue] = useState<string>('');

  function saveScore() {
    if (value.length > 0) {
      localStorage.setItem('name', value);

      mainApi.setNewScore(value, score)
        .catch((err: Error) => console.log(err));
    }
  }

  useEffect(() => {
    const userName = localStorage.getItem('name');

    if (userName) setValue(userName);
  }, []);

  return (
    <main className="total">
      <h1>
        {`Итог: ${score} из 1000 баллов`}
      </h1>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();

          saveScore();
          restartGame();
        }}
      >
        <TextField
          type="search"
          id="outlined-basic"
          label="Name"
          variant="filled"
          autoComplete="new-password"
          sx={{
            background: 'white',
          }}
          value={value && value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
        >
          <span className="shadow" />
          <span className="edge" />
          <span className="front">
            New Game
          </span>
        </button>
      </form>
    </main>
  );
}

export default Total;
