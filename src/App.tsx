import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import ScrollSequenceBackground from './ScrollSequenceBackground';

gsap.registerPlugin(ScrollTrigger);

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 });
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(2, 6, 23, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(30px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(30px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(148, 163, 184, 0.06)' : 'none',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', opacity: 0,
      }}>
        <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#fff',
            }}>PIL</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>PIL India</div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginTop: -2 }}>Pharmaceutical Excellence</div>
            </div>
          </a>
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={{
                color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.3s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                {link.label}
              </a>
            ))}
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: 13 }}>
              Get in Touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <div style={{ width: 24, height: 2, background: 'var(--text-primary)', transition: 'all 0.3s ease', transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <div style={{ width: 24, height: 2, background: 'var(--text-primary)', margin: '6px 0', transition: 'all 0.3s ease', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: 24, height: 2, background: 'var(--text-primary)', transition: 'all 0.3s ease', transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(40px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600 }}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

/* ========== HERO ========== */
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-badge', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.8 })
        .fromTo('.hero-title-line', { y: 80, opacity: 0, rotateX: 20 }, { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.15 }, '-=0.4')
        .fromTo('.hero-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
        .fromTo('.hero-buttons', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.3')
        .fromTo('.hero-scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.2');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', paddingTop: 100,
    }}>
      <div className="container-max" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <div className="hero-badge" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 60,
          background: 'rgba(59, 158, 255, 0.08)', border: '1px solid rgba(59, 158, 255, 0.15)',
          fontSize: 13, fontWeight: 500, color: 'var(--accent-primary)', marginBottom: 36, opacity: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)', display: 'inline-block' }} />
          WHO-GMP Certified since 1983
        </div>

        <h1 style={{ marginBottom: 28 }}>
          <div className="hero-title-line" style={{
            fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--text-primary)', opacity: 0,
          }}>Pioneering the</div>
          <div className="hero-title-line" style={{
            fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, opacity: 0,
          }}><span className="gradient-text">Future of Health</span></div>
        </h1>

        <p className="hero-subtitle" style={{
          maxWidth: 600, margin: '0 auto 48px', fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.7,
          color: 'var(--text-secondary)', opacity: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          India's premier pharmaceutical manufacturer delivering world-class formulations
          across <strong style={{ color: 'var(--text-primary)' }}>50+ countries</strong> with
          cutting-edge R&D and WHO-GMP certified excellence.
        </p>

        <div className="hero-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', opacity: 0 }}>
          <button className="btn-primary">
            Explore Products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <button className="btn-outline">
            Our Story
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16" fill="currentColor" /></svg>
          </button>
        </div>

        <div className="hero-scroll-indicator" style={{
          position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' as const,
          opacity: 0, animation: 'bounce-slow 2s ease-in-out infinite',
        }}>
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
        </div>
      </div>
    </section>
  );
}

/* ========== MARQUEE ========== */
function MarqueeSection() {
  const items = ['WHO-GMP Certified', '·', '500+ Formulations', '·', '50+ Countries', '·', 'ISO 9001:2015', '·', 'DSIR Recognized R&D', '·', '40+ Years of Trust', '·'];
  return (
    <div style={{ overflow: 'hidden', padding: '20px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="marquee-track" style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap' }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)',
            color: item === '·' ? 'var(--accent-primary)' : 'var(--text-muted)', flexShrink: 0,
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
    { value: '500+', label: 'Formulations' },
    { value: '50+', label: 'Countries Served' },
    { value: '40+', label: 'Years of Excellence' },
    { value: '2000+', label: 'Team Members' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={statsRef} className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-card glass card-hover" style={{ padding: '40px 32px', borderRadius: 'var(--radius-lg)', textAlign: 'center', opacity: 0 }}>
              <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{stat.label}</div>
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
      gsap.fromTo('.about-left', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' } });
      gsap.fromTo('.about-right', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' } });
    }, aboutRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={aboutRef} id="about" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="about-left" style={{ opacity: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 60,
              background: 'rgba(59, 158, 255, 0.08)', border: '1px solid rgba(59, 158, 255, 0.15)',
              fontSize: 12, fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: 24,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            }}>About PIL India</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24 }}>
              Four Decades of <span className="gradient-text-alt">Pharmaceutical Trust</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 40 }}>
              Since 1983, PIL India has been at the forefront of pharmaceutical innovation.
              Our journey from a single facility to a global powerhouse reflects our commitment
              to quality, research, and improving lives worldwide.
            </p>
            <button className="btn-primary" style={{ padding: '14px 28px', fontSize: 14 }}>
              Learn More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="about-right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, opacity: 0 }}>
            {features.map((f, i) => (
              <div key={i} className="glass card-hover" style={{
                padding: '28px 24px', borderRadius: 'var(--radius-lg)',
                transform: i % 2 === 1 ? 'translateY(20px)' : 'none',
              }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== PRODUCTS ========== */
function ProductsSection() {
  const productsRef = useRef<HTMLDivElement>(null);
  const categories = [
    { name: 'Anti-Diabetic', count: '45+ SKUs', color: '#3b9eff' },
    { name: 'Cardiology', count: '38+ SKUs', color: '#60c0ff' },
    { name: 'Neurology', count: '32+ SKUs', color: '#1a6ed8' },
    { name: 'Antibiotics', count: '55+ SKUs', color: '#3b9eff' },
    { name: 'Nutraceuticals', count: '28+ SKUs', color: '#60c0ff' },
    { name: 'Gastroenterology', count: '22+ SKUs', color: '#1a6ed8' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.products-header', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: productsRef.current, start: 'top 80%' },
      });
      gsap.fromTo('.product-card', { y: 50, opacity: 0, scale: 0.95 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.product-cards-grid', start: 'top 80%' },
      });
    }, productsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={productsRef} id="products" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="products-header" style={{ textAlign: 'center', marginBottom: 72, opacity: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 60,
            background: 'rgba(59, 158, 255, 0.08)', border: '1px solid rgba(59, 158, 255, 0.15)',
            fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 24,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          }}>Product Categories</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Comprehensive <span className="gradient-text">Therapeutic Range</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            From anti-diabetics to cardiology, our portfolio spans 20+ therapeutic categories with 500+ carefully developed formulations.
          </p>
        </div>
        <div className="product-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {categories.map((cat, i) => (
            <div key={i} className="product-card glass card-hover" style={{
              padding: '36px 28px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', position: 'relative', overflow: 'hidden', opacity: 0,
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`, opacity: 0.6 }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: `${cat.color}12`, border: `1px solid ${cat.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: cat.color, fontWeight: 700
                }}>{cat.name.substring(0, 2)}</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 4 }}><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>{cat.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{cat.count}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button className="btn-outline">View Full Catalog <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></button>
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
      const tl = gsap.timeline({ scrollTrigger: { trigger: mfgRef.current, start: 'top 70%' } });
      tl.fromTo('.mfg-header', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.mfg-visual', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
        .fromTo('.mfg-capability', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, '-=0.6');
    }, mfgRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={mfgRef} id="manufacturing" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="mfg-header" style={{ textAlign: 'center', marginBottom: 72, opacity: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 60,
            background: 'rgba(59, 158, 255, 0.08)', border: '1px solid rgba(59, 158, 255, 0.15)',
            fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 24,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          }}>Manufacturing Excellence</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
            World-Class <span className="gradient-text">Production Facilities</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Multiple WHO-GMP certified plants equipped with cutting-edge machinery, producing billions of units annually with unwavering quality standards.
          </p>
        </div>
        <div className="mfg-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          <div className="mfg-visual glass" style={{
            borderRadius: 'var(--radius-xl)', padding: 48, position: 'relative', overflow: 'hidden', opacity: 0,
            minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 'var(--radius-xl)', padding: 1,
              background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.2), transparent 50%, rgba(124, 58, 237, 0.2))',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              pointerEvents: 'none',
            }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 24 }}>🏭</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                <span className="gradient-text">5+ Manufacturing Plants</span>
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
                Spread across India with combined capacity of 10B+ units annually
              </p>
              <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[{ val: '10B+', label: 'Units/Year' }, { val: '95%', label: 'Automation' }, { val: '24/7', label: 'Operations' }].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent-primary)' }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {capabilities.map((cap, i) => (
              <div key={i} className="mfg-capability glass card-hover" style={{
                padding: '24px 28px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: 20, opacity: 0,
              }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>{cap.title}</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{cap.desc}</p>
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
    { title: 'DSIR Recognized Lab', desc: 'Our R&D lab is recognized by the Department of Scientific and Industrial Research, Government of India.', gradient: 'linear-gradient(135deg, #1a6ed8, #3b9eff)' },
    { title: 'Novel Drug Delivery', desc: 'Developing extended-release, sustained-release, and targeted drug delivery systems for enhanced efficacy.', gradient: 'linear-gradient(135deg, #3b9eff, #60c0ff)' },
    { title: 'Analytical Excellence', desc: 'State-of-the-art HPLC, GC, dissolution, and stability testing equipment ensuring pharmaceutical precision.', gradient: 'linear-gradient(135deg, #1a6ed8, #60c0ff)' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rd-header', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: rdRef.current, start: 'top 80%' } });
      gsap.fromTo('.rd-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.rd-cards', start: 'top 80%' } });
    }, rdRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rdRef} id="rd" className="section-padding" style={{ position: 'relative' }}>
      <div className="orb orb-green" style={{ width: 350, height: 350, top: '40%', left: '-5%' }} />
      <div className="container-max">
        <div className="rd-header" style={{ textAlign: 'center', marginBottom: 72, opacity: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 60,
            background: 'rgba(0, 180, 216, 0.08)', border: '1px solid rgba(0, 180, 216, 0.15)',
            fontSize: 12, fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: 24,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          }}>Research & Development</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Innovation at <span className="gradient-text-alt">the Molecular Level</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Our DSIR-recognized research center drives continuous innovation in drug formulation, novel delivery systems, and process optimization.
          </p>
        </div>
        <div className="rd-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {rdItems.map((item, i) => (
            <div key={i} className="rd-card glass card-hover" style={{
              padding: '40px 32px', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden', opacity: 0,
            }}>
              <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: item.gradient, opacity: 0.5, filter: 'blur(1px)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>{item.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{item.desc}</p>
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
    { name: 'Southeast Asia', countries: '12 countries', flag: '🌏' },
    { name: 'Africa', countries: '18 countries', flag: '🌍' },
    { name: 'Latin America', countries: '8 countries', flag: '🌎' },
    { name: 'Middle East', countries: '6 countries', flag: '🕌' },
    { name: 'CIS Region', countries: '5 countries', flag: '🏔️' },
    { name: 'Europe', countries: '4 countries', flag: '🇪🇺' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.exports-header', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: exportsRef.current, start: 'top 80%' } });
      gsap.fromTo('.exports-stat', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.exports-stats-grid', start: 'top 85%' } });
      gsap.fromTo('.region-card', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.regions-grid', start: 'top 85%' } });
    }, exportsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={exportsRef} id="exports" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="exports-header" style={{ textAlign: 'center', marginBottom: 72, opacity: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 60,
            background: 'rgba(59, 158, 255, 0.08)', border: '1px solid rgba(59, 158, 255, 0.15)',
            fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 24,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          }}>Global Footprint</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Healing Lives <span className="gradient-text">Across Borders</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Our pharmaceuticals reach patients in over 50 countries, backed by international regulatory approvals and trusted partnerships.
          </p>
        </div>
        <div className="exports-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 56 }}>
          {[
            { val: '50+', label: 'Countries', color: '#1a6ed8' },
            { val: '200+', label: 'Global Partners', color: '#3b9eff' },
            { val: '25%', label: 'Revenue from Exports', color: '#60c0ff' },
            { val: '100+', label: 'Registrations', color: '#a8d8ff' },
          ].map((stat, i) => (
            <div key={i} className="exports-stat glass" style={{
              padding: '32px 24px', borderRadius: 'var(--radius-lg)', textAlign: 'center', opacity: 0,
              borderTop: `2px solid ${stat.color}30`,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.val}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="regions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {regions.map((r, i) => (
            <div key={i} className="region-card glass card-hover" style={{
              padding: '24px 28px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', opacity: 0,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59, 158, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: 700, fontSize: 12 }}>{r.name.substring(0, 1)}</div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{r.name}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.countries}</p>
              </div>
              <svg style={{ marginLeft: 'auto' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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
      gsap.fromTo('.cta-content', { y: 40, opacity: 0, scale: 0.97 }, {
        y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
      });
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ctaRef} id="contact" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="cta-content" style={{
          position: 'relative', borderRadius: 'var(--radius-xl)', padding: 'clamp(48px, 6vw, 80px)', textAlign: 'center',
          overflow: 'hidden', opacity: 0, background: 'rgba(59, 158, 255, 0.03)', border: '1px solid rgba(59, 158, 255, 0.1)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(59, 158, 255, 0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Ready to <span className="gradient-text">Partner With Us?</span>
            </h2>
            <p style={{ maxWidth: 520, margin: '0 auto 40px', fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              Whether you're looking for contract manufacturing, distribution partnerships,
              or product inquiries — let's create healthier futures together.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary">
                Contact Us
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <button className="btn-outline">
                Download Brochure
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              </button>
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
    <footer style={{ position: 'relative', paddingTop: 80, paddingBottom: 32, borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container-max">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff',
              }}>PIL</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>PIL India</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 280, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              Pioneering pharmaceutical excellence since 1983. Delivering quality healthcare solutions to 50+ countries.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['IN', 'TW', 'LI'].map((s, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(59, 158, 255, 0.04)', border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textDecoration: 'none',
                  fontFamily: 'var(--font-display)', transition: 'all 0.3s ease',
                }}>{s}</a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' as const,
              }}>{title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map((link, i) => (
                  <a key={i} href="#" style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid var(--border-subtle)', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2025 PIL India. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((link, i) => (
              <a key={i} href="#" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
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

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => { lenis.destroy(); };
  }, []);

  return (
    <>
      <ScrollSequenceBackground />
      <div className="grid-bg" />
      <div className="noise-overlay" />
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
