import { AnimatedSigmaBackground } from '@/shared/ui/AnimatedSigmaBackground ';
import { FeedWidget } from '../widgets/feed';
//import { BackgroundAnimation } from '@/shared/ui/BackgroundAnimation';

export function KioskPage() {
  return (
    <div className="h-screen w-screen p-4">
      <AnimatedSigmaBackground />
      {/* <BackgroundAnimation /> */}
      <FeedWidget />
    </div>
  );
}
