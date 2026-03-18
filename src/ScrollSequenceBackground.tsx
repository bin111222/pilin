import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 459;

function getFramePath(index: number): string {
    const num = String(index + 1).padStart(3, '0');
    return `https://ik.imagekit.io/jaishreeskinfinitii/pilin/public/seq1/home_${num}.jpg`;
}

export default function ScrollSequenceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const frameIndexRef = useRef({ value: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- Preload all frames ---
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        function renderFrame(index: number) {
            if (!ctx || !canvas) return;
            const img = images[index];
            if (!img || !img.complete) return;

            // Cover-fit the image to the canvas
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;
            const scale = Math.max(cw / iw, ch / ih);
            const drawW = iw * scale;
            const drawH = ih * scale;
            const drawX = (cw - drawW) / 2;
            const drawY = (ch - drawH) / 2;

            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }

        function handleResize() {
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            // Set actual internal canvas resolution
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            // Set CSS display size
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            
            renderFrame(frameIndexRef.current.value);
        }

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === 1) {
                    // Render first frame immediately
                    handleResize();
                }
            };
            images.push(img);
        }
        imagesRef.current = images;

        // Set canvas size
        handleResize();
        window.addEventListener('resize', handleResize);

        // --- GSAP ScrollTrigger to scrub through frames ---
        const obj = frameIndexRef.current;

        const st = gsap.to(obj, {
            value: FRAME_COUNT - 1,
            ease: 'none',
            snap: 'value',
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                onUpdate: () => {
                    renderFrame(Math.round(obj.value));
                },
            },
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            st.scrollTrigger?.kill();
            st.kill();
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="scroll-sequence-canvas"
                aria-hidden="true"
            />
            <div className="scroll-sequence-overlay" aria-hidden="true" />
        </>
    );
}
