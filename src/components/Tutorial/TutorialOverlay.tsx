import { AlertCircle, Languages } from 'lucide-react';

interface TutorialOverlayProps {
  step: number;
  t: any;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  fabPos: { x: number, y: number } | null;
  onToggleLang: () => void;
  version?: string;
}

export const TutorialOverlay = ({ step, t, onNext, onPrev, onClose, fabPos, onToggleLang, version = 'v2.1.1' }: TutorialOverlayProps) => {
  // 定义每一步的目标区域和说明
  const tutorialSteps = [
    { target: 'fab', title: t('tutorialStep1Title'), desc: t('tutorialStep1Desc'), cardPosition: 'bottom' },
    { target: 'layout', title: t('tutorialLayoutTitle'), desc: t('tutorialLayoutDesc'), cardPosition: 'bottom' },
    { target: 'lang', title: t('tutorialLangTitle'), desc: t('tutorialLangDesc'), cardPosition: 'bottom' },
    { target: 'status', title: t('tutorialStatusTitle'), desc: t('tutorialStatusDesc'), cardPosition: 'bottom' },
    { target: 'reset', title: t('tutorialResetTitle'), desc: t('tutorialResetDesc'), cardPosition: 'bottom' },
    { target: 'levels', title: t('tutorialStep2Title'), desc: t('tutorialStep2Desc'), cardPosition: 'bottom' },
    { target: 'round', title: t('tutorialStep3Title'), desc: t('tutorialStep3Desc'), cardPosition: 'bottom' },
    { target: 'players', title: t('tutorialStep4Title'), desc: t('tutorialStep4Desc'), cardPosition: 'top' },
    { target: 'history', title: t('tutorialStep5Title'), desc: t('tutorialStep5Desc'), cardPosition: 'top' },
  ];

  const currentStep = tutorialSteps[step];
  const isLastStep = step >= tutorialSteps.length - 1;

  const getHighlightStyle = () => {
    if (!currentStep) return {};
    const isUp = fabPos && fabPos.y > window.innerHeight / 2;
    switch (currentStep.target) {
      case 'fab':
        if (!fabPos) return {};
        return { left: `${fabPos.x - 10}px`, top: `${fabPos.y - 10}px`, width: '72px', height: '120px', borderRadius: '36px' };
      case 'layout':
        if (!fabPos) return {};
        return { left: `${fabPos.x}px`, top: isUp ? `${fabPos.y - 56}px` : `${fabPos.y + 112}px`, width: '48px', height: '48px', borderRadius: '50%' };
      case 'lang':
        if (!fabPos) return {};
        return { left: `${fabPos.x}px`, top: isUp ? `${fabPos.y - 112}px` : `${fabPos.y + 168}px`, width: '48px', height: '48px', borderRadius: '50%' };
      case 'status':
        if (!fabPos) return {};
        return { left: `${fabPos.x}px`, top: isUp ? `${fabPos.y - 168}px` : `${fabPos.y + 224}px`, width: '48px', height: '48px', borderRadius: '50%' };
      case 'reset':
        if (!fabPos) return {};
        return { left: `${fabPos.x}px`, top: isUp ? `${fabPos.y - 224}px` : `${fabPos.y + 280}px`, width: '48px', height: '48px', borderRadius: '50%' };
      case 'levels':
        return { left: '0.75rem', top: '1rem', width: 'calc(100% - 1.5rem)', height: '40%', borderRadius: '0.75rem' };
      case 'round':
        return { left: '33.33%', top: '1rem', width: '33.33%', height: '40%', borderRadius: '0.75rem' };
      case 'players':
        return { left: '33.33%', top: 'calc(40% + 1rem)', width: '33.33%', height: 'calc(60% - 3rem)', borderRadius: '0.75rem' };
      case 'history':
        return { left: 'calc(33.33% + 0.5rem)', top: 'calc(60% + 0.5rem)', width: 'calc(33.33% - 1rem)', height: 'calc(20% - 1rem)', borderRadius: '0.75rem' };
      default:
        return {};
    }
  };

  const highlightStyle = getHighlightStyle();
  const getCardPositionClass = () => currentStep?.cardPosition === 'top' ? 'top-20' : 'bottom-20';

  return (
    <div className="fixed inset-0 z-[110] pointer-events-none">
      <div className="absolute inset-0 bg-black/70 pointer-events-auto" onClick={onClose} />
      {currentStep && (
        <div
          className="absolute border-4 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-500 ease-in-out"
          style={highlightStyle}
        />
      )}
      <div className={`absolute ${getCardPositionClass()} left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto transition-all duration-500 ease-in-out animate-in fade-in zoom-in-95 duration-300`}>
        <div className="flex items-start gap-3 mb-4 transition-all duration-300" key={step}>
          <AlertCircle size={32} className="text-blue-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentStep?.title}</h3>
              <button onClick={onToggleLang} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                <Languages size={20} />
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">{currentStep?.desc}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold active:bg-gray-200 text-sm">{t('tutorialSkip')}</button>
          {step > 0 && <button onClick={onPrev} className="flex-1 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold active:bg-blue-200 text-sm">{t('tutorialPrev')}</button>}
          <button onClick={isLastStep ? onClose : onNext} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold active:bg-blue-700 text-sm">{isLastStep ? t('confirm') : t('tutorialNext')}</button>
        </div>
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex justify-center gap-2">
            {tutorialSteps.map((_, idx) => (
              <div key={idx} className={`h-2 rounded-full transition-all ${idx === step ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`} />
            ))}
          </div>
          <div className="text-[10px] text-gray-400 font-mono">{version}</div>
        </div>
      </div>
    </div>
  );
};
