import QRCode from 'qrcode';

// Rendered to SVG at build time: no runtime request, no JS.
export async function QrCode({
  url,
  label,
  size = 128,
}: {
  url: string;
  label: string;
  size?: number;
}) {
  const svg = await QRCode.toString(url, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#15121F', light: '#FFFFFF' },
  });
  return (
    <div
      role="img"
      aria-label={label}
      className="rounded-xl border-2 border-ink bg-white"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
