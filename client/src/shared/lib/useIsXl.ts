import { useEffect, useState } from 'react';

export function useIsXl() {
  const [isXl, setIsXl] = useState(() => window.innerWidth >= 1280);

  useEffect(() => {
    function onResize() {
      setIsXl(window.innerWidth >= 1280);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isXl;
}
