import { buildImageUrl } from '@/entities/image';

export const ImageItemView = ({ fileName }: { fileName: string }) => {
  return (
    <div className="fixed inset-0 z-50">
      <img
        src={buildImageUrl(fileName)}
        alt=""
        className="relative z-10 h-full w-full object-contain"
      />
    </div>
  );
};
