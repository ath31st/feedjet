import {
  buildLogoUrl,
  useDeleteLogo,
  useGetLogo,
  useUploadLogo,
} from '@/entities/branding';
import { toast } from 'sonner';

const ALLOWED_LOGO_TYPES = ['image/png', 'image/svg+xml'];

export const useLogo = () => {
  const { data: logo, isLoading } = useGetLogo();
  const { mutate: uploadLogo, isPending: isUploadPending } = useUploadLogo();
  const { mutate: deleteLogo, isPending: isDeletePending } = useDeleteLogo();

  const handleUploadLogo = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    uploadLogo(formData);
  };

  const handleDeleteLogo = () => {
    if (!logo) return;

    deleteLogo({ filename: logo.fileName });
  };

  const uploadIfAllowed = (file: File) => {
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      toast.error(`Неподдерживаемый формат: ${file.name}`);
      return;
    }

    handleUploadLogo(file);
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    uploadIfAllowed(file);

    event.target.value = '';
  };

  const handleDropFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    uploadIfAllowed(file);
  };

  return {
    logoUrl: logo ? buildLogoUrl(logo.fileName) : null,
    isLoading,
    isUploading: isUploadPending,
    isDeleting: isDeletePending,
    hasLogo: !!logo,
    handleSelectFile,
    handleDropFiles,
    handleDeleteLogo,
  };
};
