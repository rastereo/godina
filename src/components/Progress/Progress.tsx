import React from 'react';

import './Progress.scss';

function App(props: { round: number, score: number }) {
  const { round, score } = props;

  return (
    <section className="progress">
      <h2>{`Раунд: ${round} из 10`}</h2>
      <h2>{`Счет: ${score}`}</h2>
    </section>
  );
}

export default App;
