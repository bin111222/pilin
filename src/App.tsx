import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import ScrollSequenceBackground from './ScrollSequenceBackground';

gsap.registerPlugin(ScrollTrigger);

/* ========== CUSTOM CURSOR ========== */
function CustomCursor() {
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const xDot = gsap.quickTo(cursorDot.current, 'x', { duration: 0.04, ease: 'power3' });
    const yDot = gsap.quickTo(cursorDot.current, 'y', { duration: 0.04, ease: 'power3' });
    const xRing = gsap.quickTo(cursorRing.current, 'x', { duration: 0.22, ease: 'power3' });
    const yRing = gsap.quickTo(cursorRing.current, 'y', { duration: 0.22, ease: 'power3' });

    const onMouseMove = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };

    const handleHover = () => {
      cursorRing.current?.classList.add('hovering');
      cursorDot.current?.classList.add('hovering');
    };
    const handleLeave = () => {
      cursorRing.current?.classList.remove('hovering');
      cursorDot.current?.classList.remove('hovering');
    };

    window.addEventListener('mousemove', onMouseMove);
    const els = document.querySelectorAll('a, button, .card-hover');
    els.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      els.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorDot} className="cursor-dot" />
      <div ref={cursorRing} className="cursor-ring" />
    </>
  );
}

/* ========== TEXT SCRAMBLE HOOK ========== */
function useTextScramble(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const frameRef = useRef<number>(0);
  const iterRef = useRef<number>(0);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let frame = 0;
    const totalFrames = text.length * 3;
    const animate = () => {
      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < Math.floor(frame / 3)) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      frame++;
      if (frame < totalFrames) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(text);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, text]);

  void iterRef.current;
  return display;
}

/* ========== NAVBAR ========== */
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Manufacturing', href: '#manufacturing' },
  { label: 'R&D', href: '#rd' },
  { label: 'Exports', href: '#exports' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.3 });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y > lastScrollY && y > 100 && !mobileOpen) setNavVisible(false);
      else setNavVisible(true);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileOpen]);

  return (
    <>
      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '14px 0' : '22px 0',
        background: scrolled ? 'rgba(5, 10, 20, 0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(28px) saturate(1.6)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(1.6)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(240, 244, 255, 0.07)' : 'none',
        boxShadow: scrolled ? 'inset 0 -1px 0 rgba(255,255,255,0.04)' : 'none',
        transition: 'padding 0.4s ease, background 0.5s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: 0,
      }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="/" className="card-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 4,
              border: '1px solid rgba(240,244,255,0.1)',
              background: 'rgba(240,244,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              color: 'var(--text-primary)', letterSpacing: '0.05em',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>PIL</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>PIL India</div>
              <div style={{ fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginTop: 1 }}>Pharmaceuticals</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={{
                color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12, fontWeight: 500,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                transition: 'color 0.3s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                {link.label}
              </a>
            ))}
            <button className="btn-outline" style={{ padding: '8px 20px', fontSize: 11 }}>
              <span>Get in Touch</span>
            </button>
          </div>

          {/* Mobile Burger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5, minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 22, height: 1.5, background: 'var(--text-primary)', transition: 'all 0.3s ease', transform: mobileOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }} />
            <div style={{ width: 22, height: 1.5, background: 'var(--text-primary)', transition: 'all 0.3s ease', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: 22, height: 1.5, background: 'var(--text-primary)', transition: 'all 0.3s ease', transform: mobileOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(5, 10, 20, 0.97)', backdropFilter: 'blur(40px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36,
        }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

/* ========== HERO (LEFT-ALIGNED, ASYMMETRIC) ========== */
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrambleActive, setScrambleActive] = useState(false);
  const scrambled1 = useTextScramble('Pioneering', scrambleActive);
  const scrambled2 = useTextScramble('the Future', scrambleActive);
  const scrambled3 = useTextScramble('of Health', scrambleActive);

  useEffect(() => {
    const timer = setTimeout(() => setScrambleActive(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.hero-tag',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, delay: 0.4 })
        .fromTo('.hero-title-word',
          { y: 100, rotateX: -15, opacity: 0 },
          { y: 0, rotateX: 0, opacity: 1, duration: 1.4, stagger: 0.12 }, '-=0.6')
        .fromTo('.hero-sub',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 }, '-=0.8')
        .fromTo('.hero-cta',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.7')
        .fromTo('.hero-aside',
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2 }, '-=1.2');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" style={{
      position: 'relative', minHeight: '100dvh',
      display: 'flex', alignItems: 'center',
      paddingTop: 80, overflow: 'hidden',
    }}>
      <div className="container-max" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Asymmetric split: left content + right aside */}
        <div className="hero-layout">

          {/* Left: Main content */}
          <div>
            {/* Overline tag */}
            <div className="hero-tag" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: 48, opacity: 0,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--accent-primary)',
                display: 'inline-block',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', fontWeight: 600 }}>
                WHO-GMP Certified since 1983
              </span>
            </div>

            {/* Title — 3 lines, each word fades up */}
            <h1 style={{ marginBottom: 40, overflow: 'visible', perspective: 800 }}>
              {[scrambled1, scrambled2, scrambled3].map((word, i) => (
                <div key={i} style={{ overflow: 'hidden', paddingBottom: 4 }}>
                  <div className="hero-title-word" style={{
                    fontSize: 'clamp(44px, 7.5vw, 96px)',
                    fontWeight: 600,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.0,
                    color: i === 2 ? 'transparent' : 'var(--text-primary)',
                    background: i === 2 ? 'linear-gradient(135deg, #F0F4FF 0%, #7BB3FF 60%, #A8B8D8 100%)' : undefined,
                    WebkitBackgroundClip: i === 2 ? 'text' : undefined,
                    backgroundClip: i === 2 ? 'text' : undefined,
                    WebkitTextFillColor: i === 2 ? 'transparent' : undefined,
                    opacity: 0,
                    display: 'block',
                  }}>{word}</div>
                </div>
              ))}
            </h1>

            <p className="hero-sub" style={{
              maxWidth: 520, fontSize: 'clamp(15px, 1.6vw, 17px)',
              lineHeight: 1.8, color: 'var(--text-secondary)',
              fontWeight: 300, marginBottom: 52, opacity: 0,
            }}>
              India's premier pharmaceutical manufacturer delivering world-class formulations
              across&nbsp;<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>50+ countries</span> with
              cutting-edge R&D and manufacturing excellence.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn-primary hero-cta" style={{ opacity: 0 }}>
                <span>Explore Products</span>
              </button>
              <button className="btn-outline hero-cta" style={{ opacity: 0 }}>
                <span>Our Story</span>
              </button>
            </div>
          </div>

          {/* Right: Floating stats card */}
          <div className="hero-aside hero-aside-col">
            <div className="glass" style={{
              borderRadius: 16, padding: '36px 28px',
              display: 'flex', flexDirection: 'column', gap: 28,
              animation: 'float-y 5s ease-in-out infinite',
            }}>
              {[
                { val: '500+', label: 'Formulations', note: 'across 20+ categories' },
                { val: '50+', label: 'Countries', note: 'global export reach' },
                { val: '40+', label: 'Years', note: 'of pharmaceutical trust' },
              ].map((s, i) => (
                <div key={i} style={{ borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none', paddingBottom: i < 2 ? 28 : 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, letterSpacing: '-0.05em', color: 'var(--text-primary)', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 300 }}>{s.note}</div>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div style={{
              marginTop: 28, textAlign: 'center', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: 8,
              color: 'var(--text-muted)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            }}>
              <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, transparent, var(--text-muted))' }} />
              <span>Scroll</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== MARQUEE ========== */
function MarqueeSection() {
  const items = ['WHO-GMP Certified', '·', '500+ Formulations', '·', '50+ Countries', '·', 'ISO 9001:2015', '·', 'DSIR Recognized R&D', '·', '40+ Years of Trust', '·'];
  return (
    <div style={{
      overflow: 'hidden', padding: '20px 0',
      borderTop: '1px solid var(--border-glass)',
      borderBottom: '1px solid var(--border-glass)',
      background: 'rgba(5, 10, 20, 0.3)',
    }}>
      <div className="marquee-track" style={{ display: 'flex', gap: 56, whiteSpace: 'nowrap' }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontSize: 11, fontWeight: item === '·' ? 400 : 500,
            fontFamily: 'var(--font-body)', letterSpacing: item === '·' ? '0' : '0.12em',
            textTransform: 'uppercase',
            color: item === '·' ? 'var(--border-glass)' : 'var(--text-muted)',
            flexShrink: 0,
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ========== STATS ========== */
function StatsSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const stats = [
    { value: '500+', label: 'Formulations', sub: 'Across 20+ therapeutic categories' },
    { value: '50+', label: 'Countries Served', sub: 'With regulatory approvals' },
    { value: '40+', label: 'Years of Trust', sub: 'Since 1983' },
    { value: '2000+', label: 'Team Members', sub: 'Dedicated professionals' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card',
        { y: 50, opacity: 0, clipPath: 'inset(20% 0 0 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
      );
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={statsRef} className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{
              borderRight: i < stats.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 60, fontWeight: 600,
                letterSpacing: '-0.05em', lineHeight: 1, marginBottom: 12,
                color: 'var(--text-primary)',
              }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 300 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== ABOUT ========== */
function AboutSection() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const features = [
    { title: 'DSIR Recognized R&D', desc: 'Government-recognized research center driving pharmaceutical innovation' },
    { title: 'WHO-GMP Facilities', desc: 'State-of-the-art manufacturing across multiple certified plants' },
    { title: 'Global Presence', desc: 'Exporting to 50+ countries with regulatory approvals worldwide' },
    { title: '500+ Formulations', desc: 'Comprehensive portfolio spanning 20+ therapeutic categories' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' }, defaults: { ease: 'expo.out' } });
      tl.fromTo('.about-overline', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
        .fromTo('.about-h2', { y: 40, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.2 }, '-=0.6')
        .fromTo('.about-p', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
        .fromTo('.about-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
        .fromTo('.about-feat', { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1 }, '-=1.2');
    }, aboutRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={aboutRef} id="about" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="about-grid">
          <div>
            <div className="about-overline overline" style={{ marginBottom: 36, opacity: 0 }}>
              About PIL India
            </div>
            <h2 className="about-h2" style={{
              fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 600,
              letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 32, opacity: 0,
            }}>
              Four Decades of<br /><span className="gradient-text-alt">Pharmaceutical Trust</span>
            </h2>
            <p className="about-p" style={{
              fontSize: 16, lineHeight: 1.9, color: 'var(--text-secondary)',
              marginBottom: 48, fontWeight: 300, opacity: 0, maxWidth: 480,
            }}>
              Since 1983, PIL India has been at the forefront of pharmaceutical innovation.
              Our journey from a single facility to a global powerhouse reflects our unwavering commitment
              to quality, research, and improving lives worldwide.
            </p>
            <div className="about-btn" style={{ opacity: 0 }}>
              <button className="btn-outline"><span>Learn More</span></button>
            </div>
          </div>

          <div className="about-feat-grid">
            {features.map((f, i) => (
              <div key={i} className={`about-feat glass card-hover${i % 2 === 1 ? ' about-feat-offset' : ''}`} style={{
                padding: '32px 24px', borderRadius: 'var(--radius-lg)', opacity: 0,
                marginTop: i % 2 === 1 ? 28 : 0,
              }}>
                <div style={{ width: 20, height: 1, background: 'rgba(74,143,255,0.6)', marginBottom: 20 }} />
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{f.title}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)', fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== PRODUCTS (BENTO GRID) ========== */
function ProductsSection() {
  const productsRef = useRef<HTMLDivElement>(null);
  const categories = [
    { name: 'Anti-Diabetic', count: '45+ SKUs', size: 'large' },
    { name: 'Cardiology', count: '38+ SKUs', size: 'small' },
    { name: 'Neurology', count: '32+ SKUs', size: 'small' },
    { name: 'Antibiotics', count: '55+ SKUs', size: 'large' },
    { name: 'Nutraceuticals', count: '28+ SKUs', size: 'small' },
    { name: 'Gastroenterology', count: '22+ SKUs', size: 'small' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: productsRef.current, start: 'top 80%' }, defaults: { ease: 'expo.out' } });
      tl.fromTo('.prod-overline', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
        .fromTo('.prod-h2', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.6')
        .fromTo('.prod-p', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
        .fromTo('.product-card', { y: 40, opacity: 0, clipPath: 'inset(15% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, stagger: 0.08 }, '-=0.8')
        .fromTo('.prod-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5');
    }, productsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={productsRef} id="products" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        {/* Header – left-aligned */}
        <div className="products-header-split">
          <div>
            <div className="prod-overline overline" style={{ marginBottom: 28, opacity: 0 }}>Product Categories</div>
            <h2 className="prod-h2" style={{
              fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 600,
              letterSpacing: '-0.04em', lineHeight: 1.1, opacity: 0,
            }}>
              Comprehensive<br /><span className="gradient-text-alt">Therapeutic Range</span>
            </h2>
          </div>
          <div style={{ alignSelf: 'end' }}>
            <p className="prod-p" style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, opacity: 0 }}>
              From anti-diabetics to cardiology, our portfolio spans 20+ therapeutic categories with 500+ carefully developed formulations.
            </p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="products-bento">
          {categories.map((cat, i) => (
            <div key={i} className={`product-card glass card-hover${cat.size === 'large' ? ' product-card-span' : ''}`} style={{
              padding: cat.size === 'large' ? '44px 36px' : '32px 28px',
              borderRadius: 'var(--radius-lg)', opacity: 0,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              flexDirection: 'column', gap: 32,
              minHeight: cat.size === 'large' ? 180 : 160,
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: cat.size === 'large' ? 22 : 17, fontWeight: 500, marginBottom: 8, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{cat.name}</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{cat.count}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>

        <div className="prod-btn" style={{ textAlign: 'center', marginTop: 56, opacity: 0 }}>
          <button className="btn-outline"><span>View Full Catalog</span></button>
        </div>
      </div>
    </section>
  );
}

/* ========== MANUFACTURING ========== */
function ManufacturingSection() {
  const mfgRef = useRef<HTMLDivElement>(null);
  const capabilities = [
    { title: 'Tablets', desc: 'High-speed rotary press lines with coating systems' },
    { title: 'Capsules', desc: 'Automated encapsulation with precision filling' },
    { title: 'Injectables', desc: 'Aseptic processing in ISO Class 5 cleanrooms' },
    { title: 'Liquids & Syrups', desc: 'High-volume liquid oral filling lines' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: mfgRef.current, start: 'top 70%' }, defaults: { ease: 'expo.out' } });
      tl.fromTo('.mfg-header > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 })
        .fromTo('.mfg-panel', { scale: 0.94, opacity: 0, clipPath: 'inset(8% 0 0 0)' }, { scale: 1, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.5 }, '-=1')
        .fromTo('.mfg-cap', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.1 }, '-=1.2');
    }, mfgRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={mfgRef} id="manufacturing" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="mfg-header" style={{ marginBottom: 80 }}>
          <div className="overline" style={{ marginBottom: 28, opacity: 0 }}>Manufacturing Excellence</div>
          <div className="section-header-split">
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.1, opacity: 0 }}>
              World-Class<br /><span className="gradient-text-alt">Production</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, opacity: 0 }}>
              Multiple WHO-GMP certified plants equipped with cutting-edge machinery, producing billions of units annually with unwavering quality standards.
            </p>
          </div>
        </div>

        <div className="mfg-grid">
          {/* Left panel */}
          <div className="mfg-panel glass" style={{
            borderRadius: 'var(--radius-xl)', padding: '60px 48px',
            position: 'relative', overflow: 'hidden', opacity: 0,
          }}>
            {/* Decorative accent line */}
            <div style={{ position: 'absolute', top: 0, left: 48, right: 48, height: 1, background: 'linear-gradient(to right, transparent, rgba(74,143,255,0.3), transparent)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.03em' }}>
              5+ Manufacturing Plants
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 56, fontWeight: 300 }}>
              Spread across India with combined capacity of 10B+ units annually
            </p>
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              {[{ val: '10B+', label: 'Units/Year' }, { val: '95%', label: 'Automation' }, { val: '24/7', label: 'Operations' }].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.03em' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right capabilities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {capabilities.map((cap, i) => (
              <div key={i} className="mfg-cap glass card-hover" style={{
                padding: '24px 28px', borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', gap: 20, opacity: 0,
              }}>
                <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(74,143,255,0.3)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 5, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{cap.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 300 }}>{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== R&D ========== */
function RDSection() {
  const rdRef = useRef<HTMLDivElement>(null);
  const rdItems = [
    { title: 'DSIR Recognized Lab', desc: 'Our R&D lab is recognized by the Department of Scientific and Industrial Research, Government of India.' },
    { title: 'Novel Drug Delivery', desc: 'Developing extended-release, sustained-release, and targeted drug delivery systems for enhanced efficacy.' },
    { title: 'Analytical Excellence', desc: 'State-of-the-art HPLC, GC, dissolution, and stability testing equipment ensuring pharmaceutical precision.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: rdRef.current, start: 'top 80%' }, defaults: { ease: 'expo.out' } });
      tl.fromTo('.rd-header > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 })
        .fromTo('.rd-card', { y: 50, opacity: 0, clipPath: 'inset(12% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.2, stagger: 0.12 }, '-=0.8');
    }, rdRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rdRef} id="rd" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="rd-header" style={{ marginBottom: 80 }}>
          <div className="overline" style={{ marginBottom: 28, opacity: 0 }}>Research & Development</div>
          <div className="rd-header-split">
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.1, opacity: 0 }}>
              Innovation at<br /><span className="gradient-text-alt">Molecular Level</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, opacity: 0 }}>
              Our DSIR-recognized research center drives continuous innovation in drug formulation, novel delivery systems, and process optimization.
            </p>
          </div>
        </div>

        <div className="rd-cards-grid">
          {rdItems.map((item, i) => (
            <div key={i} className="rd-card glass card-hover" style={{
              padding: '44px 36px', borderRadius: 'var(--radius-lg)',
              position: 'relative', overflow: 'hidden', opacity: 0,
            }}>
              {/* Top accent */}
              <div style={{ position: 'absolute', top: 0, left: 36, width: 40, height: 1, background: 'rgba(74,143,255,0.5)' }} />
              <div style={{ marginTop: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, fontWeight: 600 }}>
                  0{i + 1}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{item.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)', fontWeight: 300 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== EXPORTS ========== */
function ExportsSection() {
  const exportsRef = useRef<HTMLDivElement>(null);
  const regions = [
    { name: 'Southeast Asia', countries: '12 countries' },
    { name: 'Africa', countries: '18 countries' },
    { name: 'Latin America', countries: '8 countries' },
    { name: 'Middle East', countries: '6 countries' },
    { name: 'CIS Region', countries: '5 countries' },
    { name: 'Europe', countries: '4 countries' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: exportsRef.current, start: 'top 80%' }, defaults: { ease: 'expo.out' } });
      tl.fromTo('.exp-header > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 })
        .fromTo('.exp-stat', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, '-=0.8')
        .fromTo('.region-card', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.06 }, '-=0.8');
    }, exportsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={exportsRef} id="exports" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="exp-header" style={{ marginBottom: 80 }}>
          <div className="overline" style={{ marginBottom: 28, opacity: 0 }}>Global Footprint</div>
          <div className="exp-header-split">
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.1, opacity: 0 }}>
              Healing Lives<br /><span className="gradient-text-alt">Across Borders</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, opacity: 0 }}>
              Our pharmaceuticals reach patients in over 50 countries, backed by international regulatory approvals and trusted partnerships.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="exp-stats-grid">
          {[
            { val: '50+', label: 'Countries' },
            { val: '200+', label: 'Global Partners' },
            { val: '25%', label: 'Export Revenue' },
            { val: '100+', label: 'Registrations' },
          ].map((stat, i) => (
            <div key={i} className="exp-stat glass" style={{
              padding: '28px 24px', borderRadius: 'var(--radius-lg)', textAlign: 'center', opacity: 0,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.04em' }}>{stat.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Regions */}
        <div className="regions-grid">
          {regions.map((r, i) => (
            <div key={i} className="region-card glass card-hover" style={{
              padding: '20px 24px', borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', gap: 16, opacity: 0,
            }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3, letterSpacing: '-0.01em' }}>{r.name}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.countries}</p>
              </div>
              <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== CTA ========== */
function CTASection() {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-inner > *',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' } }
      );
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ctaRef} id="contact" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="glass" style={{
          position: 'relative', borderRadius: 24, padding: 'clamp(64px, 8vw, 100px) clamp(48px, 6vw, 80px)',
          overflow: 'hidden',
        }}>
          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(to right, transparent, rgba(74,143,255,0.4), transparent)' }} />

          <div className="cta-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <div className="overline" style={{ justifyContent: 'center', marginBottom: 32 }}>
              Partner With Us
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 600, letterSpacing: '-0.04em', marginBottom: 24, lineHeight: 1.1 }}>
              Ready to&nbsp;<span className="gradient-text-alt">Partner?</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.9, color: 'var(--text-secondary)', marginBottom: 48, fontWeight: 300 }}>
              Whether you're looking for contract manufacturing, distribution partnerships,
              or product inquiries — let's create healthier futures together.
            </p>
            <div className="cta-btn-row" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary"><span>Contact Us</span></button>
              <button className="btn-outline"><span>Download Brochure</span></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== FOOTER ========== */
function Footer() {
  const footerLinks: Record<string, string[]> = {
    Company: ['About Us', 'Board of Directors', 'Values', 'Careers', 'News'],
    Products: ['Anti-Diabetic', 'Cardiology', 'Neurology', 'Antibiotics', 'PIL Care', 'Pet Care'],
    Operations: ['Manufacturing', 'R&D', 'Quality Assurance', 'Exports', 'Certifications'],
    Connect: ['Contact', 'Partner With Us', 'Investor Relations', 'Media Kit'],
  };

  return (
    <footer style={{ position: 'relative', paddingTop: 100, paddingBottom: 40, borderTop: '1px solid var(--border-glass)', background: 'rgba(5, 10, 20, 0.65)', backdropFilter: 'blur(24px) saturate(1.5)', WebkitBackdropFilter: 'blur(24px) saturate(1.5)' }}>
      <div className="container-max">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 4,
                border: '1px solid var(--border-glass)',
                background: 'rgba(240,244,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              }}>PIL</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>PIL India</div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 260, fontWeight: 300 }}>
              Pioneering pharmaceutical excellence since 1983. Quality healthcare to 50+ countries.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['IN', 'TW', 'LI'].map((s, i) => (
                <a key={i} href="#" className="card-hover" style={{
                  width: 34, height: 34, borderRadius: 4,
                  border: '1px solid var(--border-glass)',
                  background: 'rgba(240,244,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, textDecoration: 'none',
                  fontFamily: 'var(--font-display)', transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>{s}</a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 24, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>{title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {links.map((link, i) => (
                  <a key={i} href="#" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s ease', fontWeight: 300 }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid var(--border-glass)', paddingTop: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 300 }}>© 2025 PIL India. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((link, i) => (
              <a key={i} href="#" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s ease', fontWeight: 300 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ========== MAIN APP ========== */
export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => { lenis.destroy(); };
  }, []);

  return (
    <>
      <CustomCursor />
      <ScrollSequenceBackground />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <StatsSection />
        <AboutSection />
        <ProductsSection />
        <ManufacturingSection />
        <RDSection />
        <ExportsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
