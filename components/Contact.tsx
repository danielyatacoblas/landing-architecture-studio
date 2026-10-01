'use client';
import { useState, type FormEvent } from 'react';
import { sb } from '@/lib/supabase';
import Select from './Select';

const DISTRICTS = ['Barranco', 'Miraflores', 'San Isidro', 'Santiago de Surco', 'La Molina', 'Chorrillos', 'Punta Hermosa', 'Otro'];
const KINDS = ['Casa nueva', 'Remodelación', 'Edificio', 'Comercial'];
const BUDGETS = ['Menos de US$ 150 mil', 'US$ 150–300 mil', 'US$ 300–600 mil', 'Más de US$ 600 mil'];
type Errors = Partial<Record<'name' | 'email' | 'area' | 'kind', string>>;

export default function Contact() {
  const [kind, setKind] = useState<string | null>(null);
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [who, setWho] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim();
    const area = Number(f.get('area'));
    const err: Errors = {};
    if (name.length < 2) err.name = 'Dinos cómo te llamas.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) err.email = 'Revisa el correo: falta la @ o el dominio.';
    if (!area || area < 40 || area > 50000) err.area = 'Escribe el área del terreno en m² (entre 40 y 50 000).';
    if (!kind) err.kind = 'Elige el tipo de proyecto.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setState('sending');
    await sb.leads(email, `celosia · ${name} · ${kind} · ${f.get('district')} · ${area} m² · ${f.get('budget')}`);
    setWho(name.split(' ')[0]);
    setState('done');
  }

  return (
    <section className="contact" id="contacto" aria-labelledby="contact-title">
      <div className="contact__intro">
        <h2 id="contact-title">Cuéntanos de tu terreno</h2>
        <p>Con el distrito y el área te mandamos, en 48 horas, un estudio solar básico de tu lote. Sin costo y sin compromiso.</p>
        <p className="contact__addr">Jr. Batallón Ayacucho 271, Barranco<br />hola@celosia.pe · +51 1 247 0000</p>
      </div>

      {state === 'done' ? (
        <div className="contact__done" role="status">
          <p>Gracias, {who}. En 48 horas te enviamos el estudio solar de tu terreno.</p>
        </div>
      ) : (
        <form className="contact__form" onSubmit={submit} noValidate>
          <label className="field">
            <span>Nombre</span>
            <input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="c-name" />
            <small id="c-name" className="err">{errors.name}</small>
          </label>
          <label className="field">
            <span>Correo</span>
            <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="c-email" />
            <small id="c-email" className="err">{errors.email}</small>
          </label>
          <Select className="field" label="Distrito" name="district" value={district} onChange={setDistrict} options={DISTRICTS.map((x) => ({ value: x, label: x }))} />
          <label className="field">
            <span>Área del terreno (m²)</span>
            <input name="area" type="number" inputMode="numeric" min={40} placeholder="200" aria-invalid={!!errors.area} aria-describedby="c-area" />
            <small id="c-area" className="err">{errors.area}</small>
          </label>
          <fieldset className="field field--wide" aria-describedby="c-kind">
            <legend>Tipo de proyecto</legend>
            <div className="chips">
              {KINDS.map((k) => <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{k}</button>)}
            </div>
            <small id="c-kind" className="err">{errors.kind}</small>
          </fieldset>
          <Select className="field field--wide" label="Presupuesto aproximado" name="budget" value={budget} onChange={setBudget} options={BUDGETS.map((x) => ({ value: x, label: x }))} />
          <button type="submit" className="btn btn--dark field--wide" disabled={state === 'sending'}>
            {state === 'sending' ? 'Enviando…' : 'Pedir estudio solar gratis'}
          </button>
        </form>
      )}
    </section>
  );
}
