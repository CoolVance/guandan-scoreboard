export const TopModeIcon = ({ active }: { active?: boolean }) => (
  <div className={`flex gap-0.5 h-5 items-center justify-center transition-all duration-500 ${active ? 'scale-110 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-90'}`}>
    <div className={`w-1.5 h-full rounded-full shadow-sm transition-all duration-500 ${active ? 'bg-white' : 'bg-red-500'}`} />
    <div className={`w-1.5 h-full rounded-full shadow-sm transition-all duration-500 ${active ? 'bg-white' : 'bg-yellow-400'}`} />
    <div className={`w-1.5 h-full rounded-full shadow-sm transition-all duration-500 ${active ? 'bg-white' : 'bg-blue-500'}`} />
  </div>
);

export const BottomModeIcon = ({ active }: { active?: boolean }) => (
  <div className={`relative w-6 h-6 flex items-center justify-center transition-all duration-500 ${active ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 rotate-90'}`}>
    <div className="absolute w-1.5 h-full flex flex-col justify-between">
      <div className={`w-full h-[35%] rounded-sm shadow-sm transition-all duration-500 ${active ? 'bg-white' : 'bg-red-500'}`} />
      <div className={`w-full h-[35%] rounded-sm shadow-sm transition-all duration-500 ${active ? 'bg-white' : 'bg-red-500'}`} />
    </div>
    <div className="absolute h-1.5 w-full flex justify-between items-center">
      <div className={`h-full w-[35%] rounded-sm shadow-sm transition-all duration-500 ${active ? 'bg-white' : 'bg-blue-500'}`} />
      <div className={`h-full w-[35%] rounded-sm shadow-sm transition-all duration-500 ${active ? 'bg-white' : 'bg-blue-500'}`} />
    </div>
    <div className={`z-10 w-1.5 h-1.5 rounded-full shadow-inner transition-all duration-500 ${active ? 'bg-white scale-125' : 'bg-gray-300'}`} />
  </div>
);
