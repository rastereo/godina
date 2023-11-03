import React, { useEffect, useRef } from 'react';
import './Photograph.scss';

import colorGradient from '../../utils/colorGradient';

function Photograph(
  props: {
    link: string | null,
    distance: number | null,
    getRandomPhoto: () => void,
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>
  },
) {
  const {
    link,
    distance,
    getRandomPhoto,
    setIsLoaded,
  } = props;

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
      {link && (
        <img
          src={link}
          alt="Фото из игры"
          ref={currentImage}
          onError={() => {
            setIsLoaded(false);
            getRandomPhoto();
          }}
          onLoad={(e) => setIsLoaded(e.isTrusted)}
        />
      )}
    </section>
  );
}

export default Photograph;
