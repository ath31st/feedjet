interface FullyKioskLinkProps {
  ip: string;
}

export function FullyKioskLink({ ip }: FullyKioskLinkProps) {
  const url = `http://${ip}:2323/home`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      📺 {ip}
    </a>
  );
}
