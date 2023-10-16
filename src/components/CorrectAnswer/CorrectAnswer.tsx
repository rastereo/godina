import React, { useEffect, useRef } from 'react';

import './CorrectAnswer.scss';

import colorGradient from '../../utils/colorGradient';

function CorrectAnswer(props: {
  year: number,
  title: string,
  region: string,
  distance: number | null,
  isAnswer: boolean
}) {
  const {
    year,
    title,
    region,
    distance,
    isAnswer,
  } = props;

  const currentYear = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (currentYear.current !== null && (distance || distance === 0)) {
      if (distance < 30) {
        currentYear.current.style.backgroundColor = colorGradient[distance];
      } else {
        currentYear.current.style.backgroundColor = colorGradient[colorGradient.length - 1];
      }
    } else if (currentYear.current !== null) {
      currentYear.current.style.backgroundColor = 'inherit';
    }
  }, [distance]);

  return (
    <section className="correct-answer">
      <h2 ref={currentYear}>{isAnswer && `${year} год`}</h2>
      <p>{isAnswer && title}</p>
      <p>{isAnswer && region}</p>
    </section>
  );
}

export default CorrectAnswer;
