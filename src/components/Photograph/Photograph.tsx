import React, { useEffect, useRef } from 'react';
import './Photograph.scss';

import colorGradient from '../../utils/colorGradient';

function Photograph(props: { link: string, distance: number | null, getRandomPhoto: () => void }) {
  const { link, distance, getRandomPhoto } = props;

  const currentImage = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (currentImage.current !== null && (distance || distance === 0)) {
      if (distance < 30) {
        currentImage.current.style.border = `2px solid ${colorGradient[distance]}`;
      } else {
        currentImage.current.style.border = `2px solid ${colorGradient[colorGradient.length - 1]}`;
      }
    } else if (currentImage.current !== null) {
      currentImage.current.style.border = 'none';
    }
  }, [distance]);

  return (
    <section className="photograph">
      <img
        src={link}
        alt="Фото из PastVu"
        ref={currentImage}
        onError={() => getRandomPhoto()}
      />
    </section>
  );
}

export default Photograph;
