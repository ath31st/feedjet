import { Toaster } from 'sonner';

export function ToasterConfig() {
  return (
    <Toaster
      position="bottom-center"
      theme="dark"
      closeButton
      duration={3000}
      richColors
    />
  );
}
