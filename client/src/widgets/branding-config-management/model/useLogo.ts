import {
  buildLogoUrl,
  useDeleteLogo,
  useGetLogo,
  useUploadLogo,
} from '@/entities/branding';

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

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    handleUploadLogo(file);

    event.target.value = '';
  };

  return {
    logoUrl: logo ? buildLogoUrl(logo.fileName) : null,
    isLoading,
    isUploading: isUploadPending,
    isDeleting: isDeletePending,
    hasLogo: !!logo,
    handleSelectFile,
    handleDeleteLogo,
  };
};
