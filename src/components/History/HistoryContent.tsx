import { Trash2 } from 'lucide-react';
import type { PlayerId, ScoreRecord } from '../../types/scoring';

interface HistoryContentProps {
  history: ScoreRecord[];
  playerNames: Record<PlayerId, string>;
  onDelete: (id: string) => void;
  t: any;
  viewMode?: 'list' | 'table';
  initialPlayers: any;
}

export const HistoryContent = ({ history, playerNames, onDelete, t, viewMode = 'list', initialPlayers }: HistoryContentProps) => {
  const reversedHistory = [...history].reverse();
  if (reversedHistory.length === 0) return <div className="text-center text-gray-400 py-8">{t('noHistory')}</div>;

  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
            <tr>
              {(['N', 'S', 'W', 'E'] as PlayerId[]).map(id => (
                <th key={id} className="px-2 py-3 font-bold text-center border-b">{playerNames[id]}</th>
              ))}
              <th className="px-2 py-3 font-bold border-b">{t('remark')}</th>
              <th className="px-2 py-3 font-bold text-center border-b">{t('delete')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reversedHistory.map((record: ScoreRecord) => {
              const scores: Record<PlayerId, number> = { N: 0, S: 0, W: 0, E: 0 };
              if (record.type === 'manual' && record.manualScores) {
                Object.entries(record.manualScores).forEach(([pid, val]) => {
                  scores[pid as PlayerId] = val;
                });
              } else {
                const { score, winnerIds, loserIds } = record;
                if (record.type === 'solo') {
                  winnerIds.forEach(id => scores[id] = score);
                  const deduct = score / 3;
                  loserIds.forEach(id => scores[id] = -deduct);
                } else {
                  winnerIds.forEach(id => scores[id] = score);
                  loserIds.forEach(id => scores[id] = -score);
                }
              }

              return (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  {(['N', 'S', 'W', 'E'] as PlayerId[]).map(id => {
                    const val = scores[id];
                    return (
                      <td key={id} className={`px-1 py-3 font-mono font-bold text-center ${val > 0 ? 'text-blue-600' : val < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {val > 0 ? `+${Number(val.toFixed(1))}` : Number(val.toFixed(1))}
                      </td>
                    );
                  })}
                  <td className="px-2 py-3 text-xs text-gray-600 max-w-[100px] truncate" title={record.remark}>
                    {record.remark}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(record.id); }} 
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reversedHistory.map((record: ScoreRecord) => {
        const isManual = record.type === 'manual';
        const bgColor = record.type === 'solo' ? 'bg-yellow-50 border-yellow-200' : 
                        record.type === 'duo' ? 'bg-purple-50 border-purple-200' : 
                        'bg-orange-50 border-orange-200';
        const tagColor = record.type === 'solo' ? 'bg-yellow-100 text-yellow-800' : 
                         record.type === 'duo' ? 'bg-purple-100 text-purple-800' : 
                         'bg-orange-100 text-orange-800';
        const tagName = record.type === 'solo' ? '独' : 
                        record.type === 'duo' ? '对' : '自';

        return (
          <div key={record.id} className={`flex items-center justify-between p-3 rounded-lg border ${bgColor}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${tagColor}`}>
                  {tagName}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {isManual && record.manualScores ? (
                <div className="text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
                  {(Object.entries(record.manualScores) as [PlayerId, number][]).map(([id, val]) => (
                    <span key={id} className="flex items-center gap-1">
                      <span className="text-gray-500">{playerNames[id]}</span>
                      <span className={`font-mono font-bold ${val > 0 ? 'text-blue-600' : val < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {val > 0 ? `+${val}` : val}
                      </span>
                    </span>
                  ))}
                  {record.remark && record.remark !== '自' && (
                    <span className="ml-1 text-xs bg-white/50 px-1 rounded text-gray-600 border border-gray-100">{t('note')}: {record.remark}</span>
                  )}
                </div>
              ) : (
                <div className="text-sm flex flex-wrap items-center gap-1">
                  {record.winnerIds.map((id: PlayerId) => {
                    const isRed = initialPlayers[id].color === 'red';
                    return (
                      <span key={id} className={`px-1.5 py-0.5 rounded text-xs font-bold ${isRed ? 'bg-team-red/10 text-team-red' : 'bg-team-blue/10 text-team-blue'}`}>
                        {playerNames[id]}
                      </span>
                    );
                  })}
                  <span className="mx-1 text-gray-400">{t('won')}</span>
                  <span className="font-mono font-bold text-blue-600">+{record.score}</span>
                  {record.remark && <span className="ml-2 text-xs bg-white/50 px-1 rounded text-gray-600 border border-gray-200">{t('note')}: {record.remark}</span>}
                </div>
              )}
            </div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(record.id); }} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full active:bg-red-100">
              <Trash2 size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
