import eagleUrl from '@/shared/assets/digital_eagle.svg';

interface InfoHeaderProps {
  isEffectiveXl: boolean;
  title?: string;
}

export function InfoHeader({ isEffectiveXl, title }: InfoHeaderProps) {
  return (
    <>
      {isEffectiveXl ? (
        <div className="flex h-1/4 items-center justify-center px-12 py-4">
          <img
            src={eagleUrl}
            alt="Eagle"
            className="h-full w-2/5 object-contain"
            style={{ filter: 'drop-shadow(0 0 6px var(--border))' }}
          />
          <h1 className="w-3/5 overflow-hidden text-center font-semibold text-6xl uppercase">
            {title ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'}
          </h1>
        </div>
      ) : (
        <div className="flex h-1/3 flex-col items-center justify-center gap-10 px-10">
          <img
            src={eagleUrl}
            alt="Eagle"
            className="h-2/3 object-contain"
            style={{ filter: 'drop-shadow(0 0 6px var(--border))' }}
          />
          <h1 className="overflow-hidden text-center font-semibold text-6xl uppercase">
            {title ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'}
          </h1>
        </div>
      )}
    </>
    // <div
    //   className={`flex ${isEffectiveXl ? 'h-1/4' : 'h-1/7'} items-center justify-center px-18 py-4`}
    // >
    //   <img
    //     src={eagleUrl}
    //     alt="Eagle"
    //     className="h-full w-1/2 object-contain"
    //     style={{ filter: 'drop-shadow(0 0 6px var(--border))' }}
    //   />
    //   <h1
    //     className={`w-${isEffectiveXl ? '4/5' : '2/3'} overflow-hidden text-center font-semibold text-7xl uppercase`}
    //   >
    //     {title ||
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'}
    //   </h1>
    // </div>
  );
}
