import colorGradient from '../utils/colorGradient';

function UseGetColor(distance: number): string {
  if (distance || distance === 0) {
    if (distance < 30) {
      return colorGradient[distance];
    }
    return colorGradient[colorGradient.length - 1];
  }

  return 'none';
}

export default UseGetColor;
