'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, reduced } from '@/lib/motion';

const LINES = ['Diseñamos la sombra', 'antes que la casa.'];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current || reduced()) return;
    const ctx = gsap.context(() => {
      // Las líneas de la celosía se abren como persianas y dejan ver la foto.
      gsap.fromTo('.hero__slat', { scaleX: 1 }, { scaleX: 0, duration: 1.3, ease: 'expo.inOut', stagger: 0.06 });
      gsap.from('.hero__line > span', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.7 });
      gsap.from('.hero__meta > *', { opacity: 0, y: 14, duration: 0.8, ease: 'expo.out', stagger: 0.08, delay: 1.1 });
      gsap.to('.hero__photo img', { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__photo">
        <Image src="/img/hero.jpg" alt="Patio con un árbol grande enmarcado por un techo de concreto, Casa Patio." fill priority sizes="100vw" quality={80} />
        <div className="hero__slats" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => <span className="hero__slat" key={i} />)}
        </div>
      </div>
      <div className="hero__text">
        <h1 id="hero-title" className="hero__title">
          {LINES.map((l) => <span className="hero__line" key={l}><span>{l}</span></span>)}
        </h1>
        <div className="hero__meta">
          <p>Estudio de arquitectura en Barranco. Casas, edificios y patios pensados para el sol de Lima: dónde cae, cuándo quema y cómo usarlo a favor.</p>
          <a href="#estudio-solar" className="btn btn--light">Probar el estudio solar</a>
        </div>
      </div>
    </section>
  );
}
