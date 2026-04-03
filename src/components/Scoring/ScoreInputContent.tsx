import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { PlayerId } from '../../types/scoring';

interface ScoreInputContentProps {
  mode: 'solo' | 'duo';
  currentPlayerId: PlayerId | null;
  players: Record<PlayerId, string>;
  onConfirm: (points: number, remark: string) => void;
  partner: PlayerId | null;
  setPartner: (id: PlayerId | null) => void;
  t: any;
  soloCandidates: Array<{ val: number, label: string, defaultRemark: string }>;
}

export const ScoreInputContent = ({ mode, currentPlayerId, onConfirm, partner, setPartner, t, soloCandidates }: ScoreInputContentProps) => {
  const [score, setScore] = useState<string>('');
  const [remark, setRemark] = useState('');

  // 自动设置队友
  useEffect(() => {
    if (mode === 'duo' && currentPlayerId) {
      const partnerMap: Record<string, PlayerId> = { N: 'S', S: 'N', W: 'E', E: 'W' };
      setPartner(partnerMap[currentPlayerId]);
    }
  }, [mode, currentPlayerId, setPartner]);

  const candidates = mode === 'solo'
    ? soloCandidates
    : [
      { val: 10, label: '10', defaultRemark: '10' },
      { val: 15, label: '15', defaultRemark: '15' },
      { val: 20, label: '20', defaultRemark: '20' },
      { val: 25, label: '25', defaultRemark: '25' }
    ];

  const isValid = score && (mode === 'solo' || partner);

  const handleCandidateClick = (c: any) => {
    setScore(c.val.toString());
    if (c.defaultRemark) {
      setRemark(c.defaultRemark);
    }
  };

  const handleStep = (delta: number) => {
    setScore(prev => ((parseInt(prev) || 0) + delta).toString());
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-500 mb-2">{t('scoreValue')}</label>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {candidates.map((c: any) => (
            <button key={c.val} onClick={() => handleCandidateClick(c)} className="py-2 bg-gray-100 rounded text-xs font-medium text-gray-700 active:bg-gray-200 truncate">
              {c.label || c.val}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleStep(-1)} className="p-4 bg-gray-100 rounded-xl active:bg-gray-200 flex-none">
            <Minus size={24} />
          </button>
          <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder={t('enterScore')} className="flex-1 p-3 text-2xl font-mono text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-0" autoFocus />
          <button onClick={() => handleStep(1)} className="p-4 bg-gray-100 rounded-xl active:bg-gray-200 flex-none">
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-2">{t('remarkLabel')}</label>
        <input type="text" value={remark} onChange={e => setRemark(e.target.value)} placeholder={t('defaultRemark')} className="w-full p-3 text-xl text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <button onClick={() => onConfirm(parseInt(score), remark)} disabled={!isValid} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 active:bg-blue-700">
        {t('confirmScore')}
      </button>
    </div>
  );
};
