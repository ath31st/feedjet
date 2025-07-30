import animationData from '@/shared/assets/Background looping animation.lottie?url';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const BackgroundAnimation = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
    <DotLottieReact src={animationData} loop autoplay />
  </div>
);
