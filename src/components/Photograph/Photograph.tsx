import React from 'react';
import './Photograph.scss';

function Photograph(props: { link: string }) {
  const { link } = props;

  return (
    <section className="photograph">
      <img
        src={link}
        alt="Фото из PastVu"
      />
    </section>
  );
}

export default Photograph;
