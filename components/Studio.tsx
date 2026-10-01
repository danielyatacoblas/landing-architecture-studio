'use client';
import { useEffect } from 'react';
import { startSmoothScroll } from '@/lib/smooth';
import DemoCta from './DemoCta';
import Header from './Header';
import Hero from './Hero';
import SunStudy from './SunStudy';
import Projects from './Projects';
import Lattice from './Lattice';
import Process from './Process';
import Contact from './Contact';
import Footer from './Footer';

export default function Studio() {
  useEffect(() => startSmoothScroll(1.15), []);

  return (
    <>
      <a href="#proyectos" className="skip">Saltar a los proyectos</a>
      <Header />
      <main>
        <Hero />
        <SunStudy />
        <Projects />
        <Lattice />
        <Process />
        <Contact />
      </main>
      <Footer />
      <DemoCta site="Celosía (estudio de arquitectura)" />
    </>
  );
}
