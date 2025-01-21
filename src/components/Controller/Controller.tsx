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
      <button
        type="button"
        onClick={showAnswer}
        disabled={isAnswer || userYear === 0}
      >
        <span className="shadow" />
        <span className="edge" />
        <span className="front">Submit</span>
      </button>
      {round === 10 ? (
        <button
          type="button"
          onClick={() => setIsTotal(true)}
          disabled={!isAnswer}
        >
          <span className="shadow" />
          <span className="edge" />
          <span className="front">Total</span>
        </button>
      ) : (
        <button
          type="submit"
          onClick={() => {
            resetRound();
            setIsLoaded(false);
          }}
          disabled={!isAnswer}
        >
          <span className="shadow" />
          <span className="edge" />
          <span className="front">Next</span>
        </button>
      )}
    </section>
  );
}

export default Controller;
