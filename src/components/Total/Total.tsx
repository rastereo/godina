import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';

import mainApi from '../../utils/MainApi';

import './Total.scss';
import GameButton from '../GameButton/GameButton';

interface ITotalProps {
  score: number;
  restartGame: () => void;
}

function Total({ score, restartGame }: ITotalProps) {
  const [value, setValue] = useState<string>('');

  function saveScore() {
    if (value.length > 0) {
      localStorage.setItem('name', value);

      mainApi.setNewScore(value, score).catch((err: Error) => console.log(err));
    }
  }

  useEffect(() => {
    const userName = localStorage.getItem('name');

    if (userName) setValue(userName);
  }, []);

  return (
    <main className="total">
      <h1>{`Итог: ${score} из 1000 баллов`}</h1>
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
          label="Имя"
          variant="filled"
          autoComplete="new-password"
          sx={{
            fontFamily: 'Better VCR, sans-serif',
            background: 'white',
            '& input': { fontFamily: 'Better VCR, sans-serif' },
            '& label': { fontFamily: 'Better VCR, sans-serif' },
          }}
          value={value && value}
          onChange={(e) => setValue(e.target.value)}
        />
        <GameButton text="Новая Игра" type="submit" />
      </form>
    </main>
  );
}

export default Total;
