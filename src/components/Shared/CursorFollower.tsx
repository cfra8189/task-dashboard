import React, { useEffect, useState } from 'react';

interface Props {
  activeDragging: boolean;
}

export default function CursorFollower({ activeDragging }: Props) {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      setPos({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  // Always show the dot as the page default pointer; when `activeDragging` we show the inverted (white) version
  const show = true;
  const size = activeDragging ? 20 : 14;
  const border = activeDragging ? '2px solid #000' : '2px solid #fff';
  const bg = activeDragging ? '#fff' : '#000';

  const style: React.CSSProperties = {
    position: 'fixed',
    left: pos.x,
    top: pos.y,
    width: size,
    height: size,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: bg,
    border: border,
    pointerEvents: 'none',
    zIndex: 99999,
    display: show ? 'block' : 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  };

  return <div style={style} aria-hidden />;
}
