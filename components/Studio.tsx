'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from '@/lib/motion';
import Header from './Header';
import Hero from './Hero';
import SunStudy from './SunStudy';
import Projects from './Projects';
import Lattice from './Lattice';
import Process from './Process';
import Contact from './Contact';
import Footer from './Footer';

export default function Studio() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ duration: 1.15 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);

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
    </>
  );
}
