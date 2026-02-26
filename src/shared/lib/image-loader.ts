export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  return `/api/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
