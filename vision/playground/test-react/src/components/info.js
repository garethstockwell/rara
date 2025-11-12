import { useEffect, useState } from 'react';
import './info.css';

export default function Info({
  contents
}) {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "i") {
        setShowInfo(!showInfo);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const info = showInfo ? <pre id="info" dangerouslySetInnerHTML={{ __html: contents }}></pre> : null;

  return (
    <div>
      { info }
    </div>
  );
}
