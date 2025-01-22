import Timer from '../Timer/Timer';
import './Progress.scss';

interface IProgressProps {
  round: number;
  score: number;
  seconds: number;
  isLoading: boolean;
}

function Progress({ round, score, seconds, isLoading }: IProgressProps) {
  return (
    <section className="progress">
      <h2>{`Раунд: ${round} из 10`}</h2>
      <Timer seconds={seconds} isLoading={isLoading} />
      <h2>{`Счет: ${score}`}</h2>
    </section>
  );
}

export default Progress;
