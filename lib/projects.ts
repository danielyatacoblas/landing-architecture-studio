// Proyectos de demostración: nombres, áreas y años son ficticios; las fotos vienen de Pexels.
export type Project = {
  id: string;
  name: string;
  district: string;
  type: 'Vivienda' | 'Comercial' | 'Paisaje';
  year: number;
  area: number;
  shade: number; // % del patio o terraza en sombra a las 15:00 en verano
  img: string;
  alt: string;
  more: { img: string; alt: string }[];
  text: string;
};

export const PROJECTS: Project[] = [
  { id: 'patio', name: 'Casa Patio', district: 'Barranco', type: 'Vivienda', year: 2025, area: 280, shade: 71,
    img: '/img/hero.jpg', alt: 'Patio con un árbol grande enmarcado por un techo de concreto.',
    more: [{ img: '/img/celosia.jpg', alt: 'Celosía de madera oscura con jardín detrás.' }, { img: '/img/celosia-sombra.jpg', alt: 'Sombra de una celosía sobre un piso de madera.' }],
    text: 'Una casa que gira alrededor de un ficus de cuarenta años. La celosía del patio corta el sol de la tarde sin cerrar la casa.' },
  { id: 'bloque', name: 'Casa Bloque', district: 'Santiago de Surco', type: 'Vivienda', year: 2024, area: 340, shade: 58,
    img: '/img/bloque.jpg', alt: 'Casa de concreto expuesto en volúmenes escalonados con cochera.',
    more: [{ img: '/img/cubos.jpg', alt: 'Casa de cubos de concreto sobre jardín.' }],
    text: 'Tres volúmenes de concreto que se retranquean para que cada dormitorio tenga una terraza en sombra al oeste.' },
  { id: 'ladrillo', name: 'Casa Ladrillo', district: 'Chorrillos', type: 'Vivienda', year: 2023, area: 190, shade: 44,
    img: '/img/ladrillo.jpg', alt: 'Jardín interior junto a un muro de ladrillo rojo con mampara de vidrio.',
    more: [{ img: '/img/sombra-muro.jpg', alt: 'Sombra de una ventana proyectada en un muro.' }],
    text: 'Ladrillo King Kong caravista y un jardín interior que ventila toda la planta baja sin aire acondicionado.' },
  { id: 'atrio', name: 'Edificio Atrio', district: 'Lince', type: 'Vivienda', year: 2024, area: 2400, shade: 82,
    img: '/img/atrio.jpg', alt: 'Atrio interior de un edificio con jardín tropical y pasarelas.',
    more: [{ img: '/img/escalera.jpg', alt: 'Escalera de concreto con sombras rayadas.' }],
    text: 'Dieciocho departamentos que se abren a un atrio con jardín: ventilación cruzada en cada unidad.' },
  { id: 'portico', name: 'Galería Pórtico', district: 'Miraflores', type: 'Comercial', year: 2022, area: 620, shade: 90,
    img: '/img/portico.jpg', alt: 'Pórtico de columnas de piedra con un techo de madera oscura.',
    more: [{ img: '/img/escalera.jpg', alt: 'Escalera de concreto con sombras rayadas.' }],
    text: 'Una galería de tiendas que devuelve a la calle un pórtico techado: sombra pública en plena avenida.' },
  { id: 'rocas', name: 'Patio de Rocas', district: 'San Isidro', type: 'Paisaje', year: 2023, area: 85, shade: 63,
    img: '/img/rocas.jpg', alt: 'Patio hundido con jardín de piedras y escalera metálica.',
    more: [{ img: '/img/jardin.jpg', alt: 'Pasaje lateral de una casa con jardín y luz de mañana.' }],
    text: 'Un sótano convertido en jardín seco: piedras de río, grava y una escalera que trae luz cenital.' },
  { id: 'cactus', name: 'Casa Cactus', district: 'Punta Hermosa', type: 'Vivienda', year: 2025, area: 210, shade: 49,
    img: '/img/cactus.jpg', alt: 'Casa de concreto rodeada de un jardín de cactus.',
    more: [{ img: '/img/jardin.jpg', alt: 'Pasaje lateral con jardín.' }],
    text: 'Casa de playa sin riego: un jardín de cactáceas costeras y muros gruesos que guardan el fresco de la noche.' },
];
