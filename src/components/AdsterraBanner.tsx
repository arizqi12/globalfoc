import { useEffect, useRef } from "react";

interface AdsterraBannerProps {
  atKey: string; // Key iklan dari Adsterra
  format?: string;
  height?: number;
  width?: number;
}

export default function AdsterraBanner({
  atKey = "8157ab8b546ad933d958680a417a9cc4",
  height = 90,
  width = 728,
}: AdsterraBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Bersihkan isi slot sebelum memasang script baru
    bannerRef.current.innerHTML = "";

    const confScript = document.createElement("script");
    confScript.type = "text/javascript";
    confScript.text = `
      atOptions = {
        'key' : '${atKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const adScript = document.createElement("script");
    adScript.type = "text/javascript";
    adScript.src = `//www.highperformanceformat.com/${atKey}/invoke.js`;

    bannerRef.current.appendChild(confScript);
    bannerRef.current.appendChild(adScript);
  }, [atKey, height, width]);

  return (
    <div className="my-6 flex justify-center items-center overflow-hidden">
      <div ref={bannerRef} />
    </div>
  );
}
