import type { PlayerConfig } from '../../types/scoring';

interface PlayerButtonProps {
  config: PlayerConfig;
  name: string;
  score: number;
  onClick: () => void;
}

export const PlayerButton = ({ config, name, score, onClick }: PlayerButtonProps) => {
  const isRed = config.color === 'red';
  return (
    <button onClick={onClick} className={`w-full h-full rounded-button flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform ${isRed ? 'bg-team-red text-white' : 'bg-team-blue text-white'}`}>
      <div className="text-sm opacity-90 mb-1">{name}</div>
      <div className="text-3xl font-bold font-mono">{score > 0 ? `+${Number(score.toFixed(1))}` : Number(score.toFixed(1))}</div>
    </button>
  );
};
