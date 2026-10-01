'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, reduced } from '@/lib/motion';

const STEPS = [
  { t: 'Visita al terreno', d: 'Medimos, fotografiamos y anotamos de dónde viene el sol a las 9, a las 12 y a las 4.', img: '/img/compas.jpg', alt: 'Mano usando un compás sobre un plano.', w: '2 semanas' },
  { t: 'Boceto y estudio solar', d: 'Dibujamos a mano y probamos cada volumen en la maqueta digital con el sol de verano e invierno.', img: '/img/boceto.jpg', alt: 'Manos dibujando una casa en un tablero.', w: '4 semanas' },
  { t: 'Maqueta física', d: 'Una maqueta 1:50 en cartón y balsa para que la recorras con la luz de una lámpara.', img: '/img/maqueta.jpg', alt: 'Arquitecto armando una maqueta sobre su mesa.', w: '2 semanas' },
  { t: 'Expediente y obra', d: 'Planos para licencia, metrados y visitas de obra semanales hasta la entrega de llaves.', img: '/img/taller.jpg', alt: 'Muro del taller con planos y maquetas.', w: '8 a 14 meses' },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.pstep').forEach((el) => {
        gsap.fromTo(el.querySelector('.pstep__img'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 80%' } });
      });
      gsap.fromTo('.process__line span', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process__list', start: 'top 70%', end: 'bottom 70%', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="process" id="proceso" ref={root} aria-labelledby="process-title">
      <h2 id="process-title">Así trabajamos, del terreno a las llaves</h2>
      <div className="process__wrap">
        <div className="process__line" aria-hidden="true"><span /></div>
        <ol className="process__list">
          {STEPS.map((s, i) => (
            <li className="pstep" key={s.t}>
              <div className="pstep__img"><Image src={s.img} alt={s.alt} fill sizes="(max-width: 900px) 100vw, 40vw" quality={72} /></div>
              <div className="pstep__text">
                <h3><span className="mono">{i + 1}</span>{s.t}</h3>
                <p>{s.d}</p>
                <p className="pstep__time mono">{s.w}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
