'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, reduced } from '@/lib/motion';
import { sunPosition, sunVector, compass, formatHour, SEASON_LABEL, type Season } from '@/lib/sun';
import type { SceneApi } from '@/lib/scene';

const SEASONS: Season[] = ['verano', 'equinoccio', 'invierno'];

export default function SunStudy() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<SceneApi | null>(null);
  const play = useRef<gsap.core.Tween | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'nogl'>('idle');
  const [hour, setHour] = useState(15);
  const [season, setSeason] = useState<Season>('verano');
  const [shade, setShade] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const pos = sunPosition(hour, season);

  // La maqueta (y Three.js) se cargan solo cuando la sección se acerca al viewport.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || api.current) return;
      io.disconnect();
      const test = document.createElement('canvas');
      if (!test.getContext('webgl2') && !test.getContext('webgl')) { setState('nogl'); return; }
      setState('loading');
      const { createScene } = await import('@/lib/scene');
      api.current = createScene(canvas.current!);
      api.current.resize();
      setState('ready');
    }, { rootMargin: '300px' });
    io.observe(el);
    const ro = new ResizeObserver(() => api.current?.resize());
    ro.observe(el);
    return () => { io.disconnect(); ro.disconnect(); api.current?.dispose(); api.current = null; };
  }, []);

  useEffect(() => {
    if (state !== 'ready' || !api.current) return;
    api.current.setSun(sunVector(pos.altitude, pos.azimuth), pos.altitude);
    const t = setTimeout(() => setShade(api.current!.shadePct()), playing ? 0 : 60);
    return () => clearTimeout(t);
  }, [state, pos.altitude, pos.azimuth, playing]);

  function toggleDay() {
    if (playing) { play.current?.kill(); setPlaying(false); return; }
    const o = { h: hour >= 17.9 ? 6 : hour };
    setPlaying(true);
    play.current = gsap.to(o, {
      h: 18, duration: reduced() ? 0.01 : 9 * ((18 - o.h) / 12), ease: 'none',
      onUpdate: () => setHour(Math.round(o.h * 4) / 4),
      onComplete: () => setPlaying(false),
    });
  }

  return (
    <section className="sun" id="estudio-solar" aria-labelledby="sun-title">
      <div className="sun__head">
        <h2 id="sun-title">Mueve el sol sobre Lima y mira dónde cae la sombra</h2>
        <p>Es la Casa Patio en Barranco, a escala. La celosía de madera deja pasar luz en invierno y corta el sol del verano. Gira la maqueta con el dedo o el mouse.</p>
      </div>

      <div className="sun__stage" ref={wrap}>
        <canvas ref={canvas} className="sun__canvas" aria-label={`Maqueta 3D de la Casa Patio con el sol a las ${formatHour(hour)} del ${SEASON_LABEL[season]}`} role="img" />
        {state !== 'ready' && (
          <div className="sun__state">
            {state === 'nogl' ? 'Tu navegador no tiene WebGL activo: la maqueta 3D no puede mostrarse.' : 'Cargando maqueta 3D…'}
          </div>
        )}
        <div className="sun__compass" aria-hidden="true"><span>N</span></div>

        <div className="sun__read" aria-live="polite">
          <p className="sun__shade"><b className="tnum">{shade === null ? '—' : `${shade} %`}</b> del patio en sombra</p>
          <dl>
            <div><dt>Fecha</dt><dd>{SEASON_LABEL[season]}</dd></div>
            <div><dt>Hora solar</dt><dd className="mono">{formatHour(hour)}</dd></div>
            <div><dt>Altura</dt><dd className="mono">{pos.altitude > 0 ? `${Math.round(pos.altitude)}°` : 'bajo el horizonte'}</dd></div>
            <div><dt>Viene del</dt><dd>{compass(pos.azimuth)}</dd></div>
          </dl>
        </div>
      </div>

      <div className="sun__controls">
        <div className="seg" role="radiogroup" aria-label="Época del año">
          {SEASONS.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={season === s} onClick={() => setSeason(s)}>
              {s === 'verano' ? 'Verano' : s === 'invierno' ? 'Invierno' : 'Equinoccio'}
            </button>
          ))}
        </div>
        <label className="hour">
          <span className="sr">Hora del día</span>
          <span className="mono" aria-hidden="true">06:00</span>
          <input type="range" min={6} max={18} step={0.25} value={hour} onChange={(e) => { play.current?.kill(); setPlaying(false); setHour(Number(e.target.value)); }} aria-valuetext={formatHour(hour)} />
          <span className="mono" aria-hidden="true">18:00</span>
        </label>
        <button type="button" className="btn btn--sun" onClick={toggleDay} disabled={state !== 'ready'}>
          {playing ? 'Pausar' : 'Ver el día completo'}
        </button>
      </div>
    </section>
  );
}
