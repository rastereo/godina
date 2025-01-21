import { useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

import colorGradient from '../../utils/colorGradient';

import './Photograph.scss';

interface TransitionStyles {
  entering: {
    opacity: number;
  };
  entered: {
    opacity: number;
  };
  exiting: {
    opacity: number;
  };
  exited: {
    opacity: number;
  };
  unmounted?: {
    opacity: number;
  };
}

interface IPhotographProps {
  link: string | null;
  distance: number | null;
  getRandomPhoto: () => void;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const duration = 200;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles: TransitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

function Photograph({
  link,
  distance,
  getRandomPhoto,
  setIsLoaded,
}: IPhotographProps) {
  const [isTransition, setIsTransition] = useState<boolean>(false);

  const currentImage = useRef<HTMLImageElement>(null);

  function onLoadedPhotograph(isLoaded: boolean): void {
    setIsLoaded(isLoaded);
    setIsTransition(isLoaded);
  }

  useEffect(() => {
    if (currentImage.current !== null && (distance || distance === 0)) {
      if (distance < 30) {
        currentImage.current.style.border = `2px solid ${colorGradient[distance]}`;
      } else {
        currentImage.current.style.border = `2px solid ${
          colorGradient[colorGradient.length - 1]
        }`;
      }
    } else if (currentImage.current !== null) {
      currentImage.current.style.border = 'none';
    }
  }, [distance]);

  if (link) {
    return (
      <section className="photograph">
        <Transition nodeRef={currentImage} in={isTransition} timeout={duration}>
          {(state) => (
            <img
              src={link}
              alt="Фото из игры"
              className="photograph__image"
              ref={currentImage}
              onError={() => {
                setIsLoaded(false);
                getRandomPhoto();
              }}
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
              onLoad={(e) => onLoadedPhotograph(e.isTrusted)}
            />
          )}
        </Transition>
      </section>
    );
  }
  return null;
}

export default Photograph;
