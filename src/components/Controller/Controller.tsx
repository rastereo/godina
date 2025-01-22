import GameButton from '../GameButton/GameButton';
import YearsSlider from '../YearsSlider/YearsSlider';

import './Controller.scss';

interface IControllerProps {
  userYear: number;
  photoYear: number | null;
  round: number;
  isAnswer: boolean;
  distance: number | null;
  setUserYear: (value: React.SetStateAction<number>) => void;
  setIsTotal: (value: React.SetStateAction<boolean>) => void;
  showAnswer: () => void;
  resetRound: () => void;
  isLoaded: boolean;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Controller({
  userYear,
  photoYear,
  round,
  isAnswer,
  distance,
  setUserYear,
  setIsTotal,
  showAnswer,
  resetRound,
  isLoaded,
  setIsLoaded,
}: IControllerProps) {
  return (
    <section className="controller">
      <p>
        Ваш ответ:
        <input
          type="number"
          value={userYear.toString()}
          onChange={(evt) => setUserYear(Number(evt.target.value))}
          min={1826}
          max={new Date().getFullYear()}
          disabled={isAnswer || !isLoaded}
        />
        год
      </p>
      <YearsSlider
        userYear={userYear}
        photoYear={photoYear}
        isAnswer={isAnswer}
        distance={distance}
        setUserYear={setUserYear}
        isLoaded={isLoaded}
      />
      <GameButton
        handleClick={showAnswer}
        isDisabled={isAnswer || userYear === 0}
        text="Отправить"
        type="submit"
      />
      {round === 10 ? (
        <GameButton
          handleClick={() => setIsTotal(true)}
          isDisabled={!isAnswer}
          text="Итог"
          type="button"
        />
      ) : (
        <GameButton
          handleClick={() => {
            resetRound();
            setIsLoaded(false);
          }}
          isDisabled={!isAnswer}
          text="Далее"
          type="button"
        />
      )}
    </section>
  );
}

export default Controller;
