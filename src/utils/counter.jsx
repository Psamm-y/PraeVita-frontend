import { useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

function Counter({ from = 0, to = 100 }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.floor(latest));
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    const controls = animate(count, to, { duration: 2 });
    rounded.on('change', (v) => setDisplay(v));
    return () => controls.stop();
  }, [to]);

  return <span>{display}</span>;
}

export default Counter;
