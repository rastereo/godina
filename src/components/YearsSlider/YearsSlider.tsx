// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import './YearsSlider.scss';

import UseGetColor from '../../hooks/UseGetColor';

function YearsSlider(props: {
  userYear: number,
  photoYear: number | null,
  isAnswer: boolean,
  distance: number | null,
  setUserYear: (value: React.SetStateAction<number>) => void,
  isLoaded: boolean
}) {
  const {
    userYear,
    photoYear,
    isAnswer,
    distance,
    setUserYear,
    isLoaded,
  } = props;

  const todyYear = new Date().getFullYear();

  function getColorRange(): string {
    if (distance || distance === 0) return UseGetColor(distance);

    return 'none';
  }

  const handleStyle = {
    width: '14px',
    height: '44px',
    opacity: `${isLoaded ? 1 : 0}`,
    border: '2px solid hsl(250deg 100% 20%)',
    borderRadius: 4,
    marginTop: '-20px',
    background: 'linear-gradient(to left, hsl(250deg 100% 16%) 0%, hsl(250deg 100% 32%) 8%, hsl(250deg 100% 32%) 92%, hsl(250deg 100% 16%) 100%)',
  };

  if (isAnswer && distance && distance >= 0 && photoYear) {
    return (
      <div className="slider">
        <p>1826</p>
        <Slider
          range
          min={1826}
          max={todyYear}
          value={[userYear, photoYear]}
          marks={{
            1850: 1850,
            1900: 1900,
            1950: 1950,
            2000: 2000,
          }}
          disabled
          handleStyle={{
            background: `${getColorRange()}`,
            width: '10px',
            height: '34px',
            opacity: 1,
            border: 'none',
            borderRadius: 0,
            marginTop: '-15px',
          }}
          railStyle={{
            background: '#fff',
            display: 'none',
          }}
          trackStyle={{
            background: `${getColorRange()}`,
            zIndex: 1,
          }}
        />
        <p>{new Date().getFullYear()}</p>
      </div>
    );
  }

  if (isAnswer && distance === 0 && photoYear) {
    return (
      <div className="slider">
        <p>1826</p>
        <Slider
          min={1826}
          max={todyYear}
          value={[userYear, photoYear]}
          marks={{
            1850: 1850,
            1900: 1900,
            1950: 1950,
            2000: 2000,
          }}
          disabled
          handleStyle={{
            background: `${getColorRange()}`,
            width: '14px',
            height: '44px',
            opacity: 1,
            border: 'none',
            borderRadius: 0,
            marginTop: '-20px',
          }}
          railStyle={{
            background: '#fff',
            display: 'none',
          }}
          trackStyle={{
            background: 'none',
            zIndex: 1,
          }}
        />
        <p>{new Date().getFullYear()}</p>
      </div>
    );
  }

  return (
    <div className="slider">
      <p>1826</p>
      <Slider
        min={1826}
        max={new Date().getFullYear()}
        value={userYear}
        marks={{
          1850: 1850,
          1900: 1900,
          1950: 1950,
          2000: 2000,
        }}
        startPoint={(1826 + todyYear) / 2}
        defaultValue={(1826 + todyYear) / 2}
        onChange={(number) => setUserYear(Number(number))}
        handleStyle={handleStyle}
        railStyle={{
          background: '#fff',
        }}
        trackStyle={{
          background: 'none',
        }}
        disabled={!isLoaded}
      />
      <p>{todyYear}</p>
    </div>
  );
}

export default YearsSlider;
