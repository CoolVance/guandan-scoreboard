import { useRegisterSW } from 'virtual:pwa-register/react';
import { RotateCw, X } from 'lucide-react';

export const PWAUpdatePrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">
              {needRefresh ? '发现新版本' : '已准备好离线使用'}
            </h4>
            <p className="text-sm text-gray-500 leading-snug">
              {needRefresh 
                ? '新功能已就绪，点击下方按钮刷新即可应用。' 
                : '应用已离线缓存，即使无网络也能继续计分。'}
            </p>
          </div>
          <button onClick={close} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>
        
        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 active:bg-blue-700 shadow-lg shadow-blue-200"
          >
            <RotateCw size={18} />
            立即刷新应用
          </button>
        )}
      </div>
    </div>
  );
};
