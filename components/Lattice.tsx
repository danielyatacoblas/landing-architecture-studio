'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, reduced } from '@/lib/motion';

export default function Lattice() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current || reduced()) return;
    const ctx = gsap.context(() => {
      // La sombra rayada se desliza sobre el texto mientras bajas, como el sol moviéndose por la celosía.
      gsap.fromTo('.lat__shadow', { xPercent: -30 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } });
      gsap.fromTo('.lat__img img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="lat" ref={root} aria-labelledby="lat-title">
      <div className="lat__img">
        <Image src="/img/celosia-sombra.jpg" alt="Sombra de una celosía de madera proyectada sobre un piso de tablones." fill sizes="(max-width: 900px) 100vw, 50vw" quality={78} />
      </div>
      <div className="lat__body">
        <div className="lat__shadow" aria-hidden="true" />
        <h2 id="lat-title">La celosía es nuestro material favorito</h2>
        <p>Un listón de madera de 10 centímetros, repetido cada 45, decide cuánta luz entra a un patio. Lo calculamos para cada casa: más cerrado al oeste, más abierto al sur, donde el sol de Lima llega bajo en invierno.</p>
        <p>Nada de aire acondicionado como primera respuesta. Primero la sombra, después la máquina.</p>
      </div>
    </section>
  );
}
