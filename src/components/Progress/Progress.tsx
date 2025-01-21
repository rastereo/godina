import './Progress.scss';

interface IProgressProps {
  round: number;
  score: number;
}

function Progress({ round, score }: IProgressProps) {
  return (
    <section className="progress">
      <h2>{`Раунд: ${round} из 10`}</h2>
      <h2>{`Счет: ${score}`}</h2>
    </section>
  );
}

export default Progress;
