import './Timer.scss';

interface ITimerProps {
  seconds: number;
  isLoading: boolean;
}

function Timer({ seconds, isLoading }: ITimerProps) {
  return (
    !isLoading && (
      <p className={`timer ${seconds <= 10 && 'timer_red'}`}>
        <span>{seconds}</span>
      </p>
    )
  );
}

export default Timer;
