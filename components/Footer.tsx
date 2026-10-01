import { waLink } from '@/lib/contact';

export default function Footer() {
  return (
    <footer className="ft">
      <p className="ft__word" aria-hidden="true">Celosía</p>
      <div className="ft__row">
        <p>Diseño demo: Celosía es un estudio ficticio; proyectos, cifras y direcciones son de ejemplo. ¿Quieres una web así para tu estudio? Fotografía: <a href="https://www.pexels.com" rel="noopener">Pexels</a>.</p>
        <a className="badge" href={waLink('Celosía (estudio de arquitectura)')} target="_blank" rel="noopener">Diseño y desarrollo: Daniel Yataco · WhatsApp <span className="nowrap">975 118 790</span></a>
      </div>
    </footer>
  );
}
