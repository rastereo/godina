import './GameButton.scss';

interface IGameButtonProps {
  handleClick?: () => void;
  text: string;
  type: 'submit' | 'reset' | 'button' | undefined;
  isDisabled?: boolean;
}

function GameButton({ handleClick, isDisabled, text, type }: IGameButtonProps) {
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className="game-button"
    >
      <span className="game-button__shadow" />
      <span className="game-button__edge" />
      <span className="game-button__front">{text}</span>
    </button>
  );
}

export default GameButton;
