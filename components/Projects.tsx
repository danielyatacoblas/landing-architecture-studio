'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { PROJECTS, type Project } from '@/lib/projects';
import { gsap, reduced } from '@/lib/motion';

const TYPES = ['Todos', 'Vivienda', 'Comercial', 'Paisaje'] as const;

export default function Projects() {
  const [type, setType] = useState<(typeof TYPES)[number]>('Todos');
  const [hover, setHover] = useState<Project | null>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useMemo(() => (type === 'Todos' ? PROJECTS : PROJECTS.filter((p) => p.type === type)), [type]);

  // La vista previa sigue al cursor con inercia (solo con mouse; en táctil cada fila trae su foto).
  useEffect(() => {
    const el = preview.current;
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const fast = reduced();
    const xTo = gsap.quickTo(el, 'x', { duration: fast ? 0 : 0.5, ease: 'expo.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: fast ? 0 : 0.5, ease: 'expo.out' });
    const move = (e: PointerEvent) => { xTo(e.clientX + 24); yTo(e.clientY - 120); };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    if (!root.current || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.prow', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.plist', start: 'top 85%' } });
    }, root);
    return () => ctx.revert();
  }, [list]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <section className="proj" id="proyectos" ref={root} aria-labelledby="proj-title">
      <div className="proj__head">
        <h2 id="proj-title">Siete obras, siete sombras distintas</h2>
        <div className="chips" role="group" aria-label="Filtrar por tipo">
          {TYPES.map((t) => <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => setType(t)}>{t}</button>)}
        </div>
      </div>

      <ul className="plist" onPointerLeave={() => setHover(null)}>
        {list.map((p) => (
          <li key={p.id} className="prow">
            <button type="button" className="prow__btn" onPointerEnter={() => setHover(p)} onFocus={() => setHover(p)} onClick={() => setOpen(p)}>
              <span className="prow__thumb"><Image src={p.img} alt="" fill sizes="(max-width: 760px) 92vw, 1px" quality={65} /></span>
              <span className="prow__name">{p.name}</span>
              <span className="prow__district">{p.district}</span>
              <span className="prow__type">{p.type}</span>
              <span className="prow__year mono">{p.year}</span>
              <span className="prow__shade mono">{p.shade} % sombra</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="note">Sombra medida en el patio o terraza principal a las 15:00 del 21 de diciembre. Proyectos y cifras de demostración.</p>

      <div className="preview" ref={preview} data-on={hover ? '' : undefined} aria-hidden="true">
        {PROJECTS.map((p) => (
          <Image key={p.id} src={p.img} alt="" fill sizes="340px" quality={70} data-on={hover?.id === p.id ? '' : undefined} />
        ))}
      </div>

      <dialog ref={dialog} className="pdlg" aria-labelledby="pdlg-title" onClose={() => setOpen(null)}>
        {open && (
          <article>
            <div className="pdlg__gallery">
              <div className="pdlg__main"><Image src={open.img} alt={open.alt} fill sizes="(max-width: 900px) 100vw, 60vw" quality={80} loading="eager" /></div>
              {open.more.map((m) => <div key={m.img} className="pdlg__sub"><Image src={m.img} alt={m.alt} fill sizes="(max-width: 900px) 50vw, 25vw" quality={70} loading="eager" /></div>)}
            </div>
            <div className="pdlg__body">
              <h2 id="pdlg-title">{open.name}</h2>
              <p>{open.text}</p>
              <dl>
                <div><dt>Distrito</dt><dd>{open.district}</dd></div>
                <div><dt>Año</dt><dd className="mono">{open.year}</dd></div>
                <div><dt>Área</dt><dd className="mono">{open.area.toLocaleString('es-PE')} m²</dd></div>
                <div><dt>Sombra 15:00</dt><dd className="mono">{open.shade} %</dd></div>
              </dl>
              <button type="button" className="btn btn--dark" onClick={() => setOpen(null)} autoFocus>Cerrar</button>
            </div>
          </article>
        )}
      </dialog>
    </section>
  );
}
