import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { PlayerId } from '../../types/scoring';

interface ManualScoreContentProps {
  players: Record<PlayerId, string>;
  onConfirm: (deltas: Record<PlayerId, number>, remark: string) => void;
  t: any;
  confirmModal: any;
}

export const ManualScoreContent = ({ players, onConfirm, t, confirmModal }: ManualScoreContentProps) => {
  const [scores, setScores] = useState<Record<PlayerId, string>>({ N: '', S: '', E: '', W: '' });
  const [remark, setRemark] = useState('');

  const sum = (Object.values(scores) as string[]).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
  const isValid = sum === 0 && Object.values(scores).some(v => v !== '' && parseInt(v) !== 0);

  const handleSubmit = () => {
    if (!isValid) return;

    const deltas: Record<PlayerId, number> = { N: 0, S: 0, E: 0, W: 0 };
    Object.entries(scores).forEach(([id, val]) => {
      deltas[id as PlayerId] = parseInt(val) || 0;
    });

    confirmModal({
      isOpen: true,
      message: (
        <div className="text-left w-full space-y-1">
          <p className="font-bold mb-2">{t('confirmManualMsg')}</p>
          {(Object.entries(deltas) as [PlayerId, number][]).map(([id, val]) => (
            <div key={id} className="flex justify-between border-b border-gray-100 py-1">
              <span>{players[id]}</span>
              <span className={`font-mono font-bold ${val > 0 ? 'text-blue-600' : val < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {val > 0 ? `+${val}` : val}
              </span>
            </div>
          ))}
        </div>
      ),
      onConfirm: () => {
        onConfirm(deltas, remark);
        confirmModal((prev: any) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleStep = (id: PlayerId, delta: number) => {
    setScores(prev => ({
      ...prev,
      [id]: ((parseInt(prev[id]) || 0) + delta).toString()
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {(['N', 'S', 'W', 'E'] as PlayerId[]).map(id => (
          <div key={id}>
            <label className="block text-xs text-gray-500 mb-1">{players[id]}</label>
            <div className="flex items-center gap-1">
              <button onClick={() => handleStep(id, -1)} className="p-2 bg-gray-100 rounded-lg active:bg-gray-200">
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={scores[id]}
                onChange={e => setScores(prev => ({ ...prev, [id]: e.target.value }))}
                placeholder="0"
                className="w-full p-2 text-xl font-mono text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-0"
              />
              <button onClick={() => handleStep(id, 1)} className="p-2 bg-gray-100 rounded-lg active:bg-gray-200">
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-2 rounded text-center text-sm font-bold ${sum === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {t('sumMustBeZero', { sum: sum.toString() })}
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-2">{t('remarkLabel')}</label>
        <input
          type="text"
          value={remark}
          onChange={e => setRemark(e.target.value)}
          placeholder={t('defaultRemark')}
          className="w-full p-3 text-lg text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 active:bg-blue-700"
      >
        {t('confirmScore')}
      </button>
    </div>
  );
};
