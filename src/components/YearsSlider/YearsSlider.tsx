import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import './YearsSlider.scss';

import UseGetColor from '../../hooks/UseGetColor';

function YearsSlider(props: {
  userYear: number,
  photoYear: number,
  isAnswer: boolean,
  distance: number | null,
  setUserYear: (value: React.SetStateAction<number>) => void,
}) {
  const {
    userYear,
    photoYear,
    isAnswer,
    distance,
    setUserYear,
  } = props;

  const todyYear = new Date().getFullYear();

  function getColorRange(): string {
    if (distance || distance === 0) return UseGetColor(distance);

    return 'none';
  }

  if (isAnswer && distance && distance >= 0) {
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
            width: '14px',
            height: '24px',
            opacity: 1,
            border: 'none',
            borderRadius: 0,
            marginTop: '-10px',
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

  if (isAnswer && distance === 0) {
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
            height: '24px',
            opacity: 1,
            border: 'none',
            borderRadius: 0,
            marginTop: '-10px',
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
        handleStyle={{
          background: 'blue',
          width: '14px',
          height: '24px',
          opacity: 1,
          border: 'none',
          borderRadius: 0,
          marginTop: '-10px',
        }}
        railStyle={{
          background: '#fff',
        }}
        trackStyle={{
          background: 'none',
        }}
      />
      <p>{todyYear}</p>
    </div>
  );
}

export default YearsSlider;
