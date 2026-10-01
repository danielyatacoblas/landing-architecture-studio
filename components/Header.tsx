'use client';
import { useEffect, useState } from 'react';

export default function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className="hd" data-solid={solid ? '' : undefined}>
      <a href="#top" className="hd__mark" aria-label="Celosía arquitectos, inicio">
        <svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true">
          {[4, 10, 16, 22].map((x) => <rect key={x} x={x} y="3" width="3" height="22" fill="currentColor" />)}
        </svg>
        Celosía
      </a>
      <nav className="hd__nav" aria-label="Principal">
        <a href="#estudio-solar">Estudio solar</a>
        <a href="#proyectos">Proyectos</a>
        <a href="#proceso">Proceso</a>
        <a href="#contacto" className="hd__cta">Cuéntanos tu terreno</a>
      </nav>
    </header>
  );
}
