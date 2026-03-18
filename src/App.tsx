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
    // GSAP quickTo creates a highly optimized function that binds to a specific property.
    // This allows buttery smooth, zero-latency following compared to typical React state or CSS transitons.
    const xDot = gsap.quickTo(cursorDot.current, "x", {duration: 0.05, ease: "power3"});
    const yDot = gsap.quickTo(cursorDot.current, "y", {duration: 0.05, ease: "power3"});
    const xRing = gsap.quickTo(cursorRing.current, "x", {duration: 0.25, ease: "power3"});
    const yRing = gsap.quickTo(cursorRing.current, "y", {duration: 0.25, ease: "power3"});

    const onMouseMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const handleHover = () => {
      if (cursorRing.current) cursorRing.current.classList.add('hovering');
      if (cursorDot.current) cursorDot.current.classList.add('hovering');
    };
    const handleLeave = () => {
      if (cursorRing.current) cursorRing.current.classList.remove('hovering');
      if (cursorDot.current) cursorDot.current.classList.remove('hovering');
    };

    window.addEventListener('mousemove', onMouseMove);
    
    // Add hovering effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card-hover');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach((el) => {
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
      gsap.fromTo(navRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.5 });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100 && !mobileOpen) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileOpen]);

  return (
    <>
      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        transition: 'padding 0.4s ease, background 0.4s ease, backdrop-filter 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
      }}>
        <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" className="card-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 4,
              border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)',
            }}>PIL</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>PIL India</div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginTop: 0 }}>Pharmaceuticals</div>
            </div>
          </a>
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={{
                color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.3s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                {link.label}
              </a>
            ))}
            <button className="btn-outline" style={{ padding: '10px 24px', fontSize: 13 }}>
              <span>Get in Touch</span>
            </button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'none', padding: 8 }}>
            <div style={{ width: 24, height: 2, background: 'var(--text-primary)', transition: 'all 0.3s ease', transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <div style={{ width: 24, height: 2, background: 'var(--text-primary)', margin: '6px 0', transition: 'all 0.3s ease', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: 24, height: 2, background: 'var(--text-primary)', transition: 'all 0.3s ease', transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(2, 6, 23, 0.98)', backdropFilter: 'blur(40px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500 }}>
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
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.hero-badge', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2, delay: 0.8 })
        .fromTo('.hero-title-line', 
          { y: 80, clipPath: 'inset(100% 0 0 0)' }, 
          { y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.5, stagger: 0.15 }, '-=0.8')
        .fromTo('.hero-subtitle', 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2 }, '-=1')
        .fromTo('.hero-buttons, .hero-scroll-indicator', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.2 }, '-=1');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', paddingTop: 80,
    }}>
      <div className="container-max" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <div className="hero-badge" style={{
          display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)',
          fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 48, opacity: 0, letterSpacing: '0.15em', textTransform: 'uppercase'
        }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-secondary)', display: 'inline-block' }} />
          WHO-GMP Certified since 1983
        </div>

        <h1 style={{ marginBottom: 32 }}>
          <div style={{ overflow: 'hidden', paddingBottom: 10 }}>
            <div className="hero-title-line" style={{
              fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--text-primary)',
            }}>Pioneering the</div>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: 10 }}>
            <div className="hero-title-line" style={{
              fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05,
            }}><span className="gradient-text-alt">Future of Health</span></div>
          </div>
        </h1>

        <p className="hero-subtitle" style={{
          maxWidth: 600, margin: '0 auto 56px', fontSize: 'clamp(15px, 1.8vw, 17px)', lineHeight: 1.8,
          color: 'var(--text-secondary)', opacity: 0, fontWeight: 400,
        }}>
          India's premier pharmaceutical manufacturer delivering world-class formulations
          across <span style={{ color: 'var(--text-primary)' }}>50+ countries</span> with
          cutting-edge R&D and manufacturing excellence.
        </p>

        <div className="hero-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', opacity: 0 }}>
          <button className="btn-primary"><span>Explore Products</span></button>
          <button className="btn-outline"><span>Our Story</span></button>
        </div>

        <div className="hero-scroll-indicator" style={{
          position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'var(--text-muted)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' as const,
          opacity: 0, animation: 'bounce-slow 2s ease-in-out infinite',
        }}>
          <div style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, transparent, var(--text-muted))' }} />
        </div>
      </div>
    </section>
  );
}

/* ========== MARQUEE ========== */
function MarqueeSection() {
  const items = ['WHO-GMP Certified', '/', '500+ Formulations', '/', '50+ Countries', '/', 'ISO 9001:2015', '/', 'DSIR Recognized R&D', '/', '40+ Years of Trust', '/'];
  return (
    <div style={{ overflow: 'hidden', padding: '24px 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
      <div className="marquee-track" style={{ display: 'flex', gap: 60, whiteSpace: 'nowrap' }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-body)', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: item === '/' ? 'var(--border-glass)' : 'var(--text-secondary)', flexShrink: 0,
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
    { value: '40+', label: 'Years of Trust' },
    { value: '2000+', label: 'Team Members' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card', 
        { y: 60, clipPath: 'inset(100% 0 0 0)' }, 
        { y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.2, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
      );
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={statsRef} className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{ padding: '64px 0', textAlign: 'center', opacity: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 16, color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>{stat.label}</div>
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
      tl.fromTo('.about-left > *', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 })
      .fromTo('.about-right > div', 
        { y: 60, opacity: 0, scale: 0.98 }, 
        { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.1 }, '-=1');
    }, aboutRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={aboutRef} id="about" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="about-left">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px',
              borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)',
              fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 32,
              letterSpacing: '0.15em', textTransform: 'uppercase' as const, opacity: 0,
            }}>About PIL India</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 32, opacity: 0 }}>
              Four Decades of <br /><span className="gradient-text-alt">Pharmaceutical Trust</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 48, fontWeight: 300, opacity: 0 }}>
              Since 1983, PIL India has been at the forefront of pharmaceutical innovation.
              Our journey from a single facility to a global powerhouse reflects our unwavering commitment
              to quality, research, and improving lives worldwide.
            </p>
            <div style={{ opacity: 0 }}>
              <button className="btn-outline"><span>Learn More</span></button>
            </div>
          </div>
          <div className="about-right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} className="glass card-hover" style={{
                padding: '32px 24px', borderRadius: 'var(--radius-lg)', opacity: 0,
                transform: i % 2 === 1 ? 'translateY(24px)' : 'none',
              }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>{f.title}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)', fontWeight: 400 }}>{f.desc}</p>
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
    { name: 'Anti-Diabetic', count: '45+ SKUs' },
    { name: 'Cardiology', count: '38+ SKUs' },
    { name: 'Neurology', count: '32+ SKUs' },
    { name: 'Antibiotics', count: '55+ SKUs' },
    { name: 'Nutraceuticals', count: '28+ SKUs' },
    { name: 'Gastroenterology', count: '22+ SKUs' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: productsRef.current, start: 'top 80%' }, defaults: { ease: 'expo.out' } });
      tl.fromTo('.products-header > *', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 })
      .fromTo('.product-card', 
        { y: 50, opacity: 0, clipPath: 'inset(10% 0 0 0)' }, 
        { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.2, stagger: 0.1 }, '-=0.8')
      .fromTo('.products-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.5');
    }, productsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={productsRef} id="products" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="products-header" style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px',
            borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)',
            fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 32,
            letterSpacing: '0.15em', textTransform: 'uppercase' as const, opacity: 0
          }}>Product Categories</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 24, opacity: 0 }}>
            Comprehensive <span className="gradient-text-alt">Therapeutic Range</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, opacity: 0 }}>
            From anti-diabetics to cardiology, our portfolio spans 20+ therapeutic categories with 500+ carefully developed formulations.
          </p>
        </div>
        <div className="product-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map((cat, i) => (
            <div key={i} className="product-card glass card-hover" style={{
              padding: '32px 28px', borderRadius: 'var(--radius-lg)', opacity: 0,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, marginBottom: 8, color: 'var(--text-primary)' }}>{cat.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{cat.count}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
          ))}
        </div>
        <div className="products-btn" style={{ textAlign: 'center', marginTop: 64, opacity: 0 }}>
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
        .fromTo('.mfg-visual', { scale: 0.95, opacity: 0, clipPath: 'inset(10% 0 0 0)' }, { scale: 1, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.5 }, '-=1')
        .fromTo('.mfg-capability', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, '-=1.2');
    }, mfgRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={mfgRef} id="manufacturing" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="mfg-header" style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px',
            borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)',
            fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 32,
            letterSpacing: '0.15em', textTransform: 'uppercase' as const, opacity: 0
          }}>Manufacturing Excellence</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 24, opacity: 0 }}>
            World-Class <span className="gradient-text-alt">Production</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, opacity: 0 }}>
            Multiple WHO-GMP certified plants equipped with cutting-edge machinery, producing billions of units annually with unwavering quality standards.
          </p>
        </div>
        <div className="mfg-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          <div className="mfg-visual glass" style={{
            borderRadius: 'var(--radius-lg)', padding: '64px 48px', position: 'relative', overflow: 'hidden', opacity: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, marginBottom: 16 }}>
              5+ Manufacturing Plants
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 48, fontWeight: 300 }}>
              Spread across India with combined capacity of 10B+ units annually
            </p>
            <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[{ val: '10B+', label: 'Units/Year' }, { val: '95%', label: 'Automation' }, { val: '24/7', label: 'Operations' }].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 8 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {capabilities.map((cap, i) => (
              <div key={i} className="mfg-capability glass card-hover" style={{
                padding: '28px 32px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: 20, opacity: 0,
              }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>{cap.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 400 }}>{cap.desc}</p>
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
        .fromTo('.rd-card', { y: 60, opacity: 0, clipPath: 'inset(10% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.2, stagger: 0.15 }, '-=0.8');
    }, rdRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rdRef} id="rd" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="rd-header" style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px',
            borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)',
            fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 32,
            letterSpacing: '0.15em', textTransform: 'uppercase' as const, opacity: 0
          }}>Research & Development</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 24, opacity: 0 }}>
            Innovation at <span className="gradient-text-alt">Molecular Level</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, opacity: 0 }}>
            Our DSIR-recognized research center drives continuous innovation in drug formulation, novel delivery systems, and process optimization.
          </p>
        </div>
        <div className="rd-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {rdItems.map((item, i) => (
            <div key={i} className="rd-card glass card-hover" style={{
              padding: '40px 32px', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', opacity: 0,
            }}>
              <div style={{ width: 16, height: 1, background: 'var(--text-primary)', marginBottom: 24 }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, marginBottom: 12, color: 'var(--text-primary)' }}>{item.title}</h3>
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
      tl.fromTo('.exports-header > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 })
        .fromTo('.exports-stat', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, '-=0.8')
        .fromTo('.region-card', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, stagger: 0.05 }, '-=0.8');
    }, exportsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={exportsRef} id="exports" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="exports-header" style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px',
            borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)',
            fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 32,
            letterSpacing: '0.15em', textTransform: 'uppercase' as const, opacity: 0
          }}>Global Footprint</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 24, opacity: 0 }}>
            Healing Lives <span className="gradient-text-alt">Across Borders</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300, opacity: 0 }}>
            Our pharmaceuticals reach patients in over 50 countries, backed by international regulatory approvals and trusted partnerships.
          </p>
        </div>
        <div className="exports-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 56 }}>
          {[
            { val: '50+', label: 'Countries' },
            { val: '200+', label: 'Global Partners' },
            { val: '25%', label: 'Export Revenue' },
            { val: '100+', label: 'Registrations' },
          ].map((stat, i) => (
            <div key={i} className="exports-stat glass" style={{
              padding: '32px 24px', borderRadius: 'var(--radius-lg)', textAlign: 'center', opacity: 0,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 12 }}>{stat.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="regions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {regions.map((r, i) => (
            <div key={i} className="region-card glass card-hover" style={{
              padding: '24px 28px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 16, opacity: 0,
            }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{r.name}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.countries}</p>
              </div>
              <svg style={{ marginLeft: 'auto' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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
      gsap.fromTo('.cta-content', 
        { y: 60, opacity: 0, clipPath: 'inset(10% 0 0 0)' }, 
        { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' } }
      );
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ctaRef} id="contact" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-max">
        <div className="cta-content glass" style={{
          position: 'relative', borderRadius: 'var(--radius-xl)', padding: 'clamp(64px, 8vw, 100px)', textAlign: 'center',
          opacity: 0,
        }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 24 }}>
              Ready to <span className="gradient-text-alt">Partner With Us?</span>
            </h2>
            <p style={{ maxWidth: 520, margin: '0 auto 48px', fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 300 }}>
              Whether you're looking for contract manufacturing, distribution partnerships,
              or product inquiries — let's create healthier futures together.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
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
    <footer style={{ position: 'relative', paddingTop: 100, paddingBottom: 32, borderTop: '1px solid var(--border-glass)' }}>
      <div className="container-max">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 48, marginBottom: 80 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 4, border: '1px solid var(--border-glass)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)',
              }}>PIL</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 18, color: 'var(--text-primary)' }}>PIL India</div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 280, fontWeight: 300 }}>
              Pioneering pharmaceutical excellence since 1983. Delivering quality healthcare solutions to 50+ countries.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['IN', 'TW', 'LI'].map((s, i) => (
                <a key={i} href="#" className="card-hover" style={{
                  width: 36, height: 36, borderRadius: 4,
                  border: '1px solid var(--border-glass)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontSize: 11, fontWeight: 500, textDecoration: 'none',
                  fontFamily: 'var(--font-display)', transition: 'all 0.3s ease',
                }}>{s}</a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
                marginBottom: 24, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
              }}>{title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          borderTop: '1px solid var(--border-glass)', paddingTop: 32,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 300 }}>© 2025 PIL India. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 32 }}>
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

    // Connect Lenis to GSAP ScrollTrigger
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
