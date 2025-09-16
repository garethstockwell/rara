import { useEffect, useState } from 'react';
import './info.css';

export default function Info({
  contents
}) {
  const [freezeInfo, setFreezeInfo] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "f") {
        setFreezeInfo(!freezeInfo);
        console.log("freezeInfo = " + freezeInfo);
      }

      if (e.key === "i") {
        setShowInfo(!showInfo);
        console.log("showInfo = " + showInfo);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const info = showInfo ? <pre id="info">{contents}</pre> : null;

  return (
    <div>
      { info }
    </div>
  );
}
