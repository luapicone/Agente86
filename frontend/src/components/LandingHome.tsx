import { useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Beams from './Beams'
import BeforeAfterShowcase from './BeforeAfterShowcaseLanding'
import RemodelCarousel from './RemodelCarousel'
import './LandingHome.css'

type FadeInProps = {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

type FeatureCard = {
  title: string
  description: string
}

type Stat = {
  label: string
  value: string
}

const navigation = [
  { label: 'Propuesta', href: '#propuesta' },
  { label: 'Remodelación IA', href: '#remodelacion' },
  { label: 'Impacto', href: '#impacto' },
  { label: 'Tecnología', href: '#tecnologia' },
  { label: 'Marketplace', href: '#marketplace' },
]

const stats: Stat[] = [
  { label: 'Diseños modulares', value: '100%' },
  { label: 'Enfoque sostenible', value: 'Triple impacto' },
  { label: 'Tecnología base', value: 'React + Node.js' },
]

const features: FeatureCard[] = [
  {
    title: 'Vivienda accesible',
    description:
      'Propuestas pensadas para familias que necesitan una solución habitacional posible de construir y ampliar.',
  },
  {
    title: 'Menor costo de obra',
    description:
      'Estimaciones orientadas a reducir materiales innecesarios y aprovechar mejor el presupuesto disponible.',
  },
  {
    title: 'Diseño para crecer',
    description:
      'Opciones modulares que permiten arrancar con lo esencial y ampliar la vivienda en el futuro.',
  },
]

const impacts: FeatureCard[] = [
  {
    title: 'Impacto social',
    description:
      'Acerca una vivienda digna y funcional a familias que hoy necesitan construir con presupuestos ajustados.',
  },
  {
    title: 'Impacto ambiental',
    description:
      'Promueve materiales y estrategias que ayudan a ahorrar energía y reducir desperdicios.',
  },
  {
    title: 'Impacto económico',
    description:
      'Ayuda a tomar decisiones más claras para construir con menos errores y menos gasto innecesario.',
  },
]

const remodelingMaterials = ['Pisos', 'Revestimientos', 'Pinturas', 'Iluminación', 'Maderas', 'Terminaciones']

function FadeIn({ children, delay = 0, duration = 1000, className = '' }: FadeInProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-opacity ${visible ? 'opacity-100' : 'opacity-0'} ${className}`.trim()}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

type AnimatedHeadingProps = {
  text: string
  delay?: number
  charDelay?: number
  duration?: number
  className?: string
}

type AnimatedTextProps = {
  text: string
  delay?: number
  charDelay?: number
  duration?: number
  className?: string
}

type SectionHeaderProps = {
  eyebrow: string
  title: string
  description: string
}

function AnimatedHeading({
  text,
  delay = 200,
  charDelay = 30,
  duration = 500,
  className = '',
}: AnimatedHeadingProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay])

  const lines = text.split('\n')

  return (
    <h1
      className={`text-4xl font-normal leading-none text-white md:text-5xl lg:text-6xl xl:text-7xl ${className}`.trim()}
      style={{ letterSpacing: '-0.04em' }}
    >
      {lines.map((line, lineIndex) => {
        const lineLength = line.length
        return (
          <span key={`${line}-${lineIndex}`} className="block">
            {line.split('').map((char, charIndex) => {
              const transitionDelay = lineIndex * lineLength * charDelay + charIndex * charDelay
              return (
                <span
                  key={`${char}-${lineIndex}-${charIndex}`}
                  className="inline-block"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-18px)',
                    transitionProperty: 'opacity, transform',
                    transitionDuration: `${duration}ms`,
                    transitionDelay: `${transitionDelay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'pre',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              )
            })}
          </span>
        )
      })}
    </h1>
  )
}

function AnimatedText({
  text,
  delay = 800,
  charDelay = 12,
  duration = 450,
  className = '',
}: AnimatedTextProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay])

  const lines = text.split('\n')

  return (
    <div className={className}>
      {lines.map((line, lineIndex) => {
        const words = line.split(' ')
        let charOffset = 0

        return (
          <span key={`${line}-${lineIndex}`} className="block">
            {words.map((word, wordIndex) => {
              const wordNode = (
                <span key={`${word}-${lineIndex}-${wordIndex}`} className="inline-block whitespace-nowrap">
                  {word.split('').map((char, charIndex) => {
                    const transitionDelay = (charOffset + charIndex) * charDelay + lineIndex * line.length * charDelay
                    return (
                      <span
                        key={`${char}-${lineIndex}-${wordIndex}-${charIndex}`}
                        className="inline-block"
                        style={{
                          opacity: visible ? 1 : 0,
                          transform: visible ? 'translateX(0)' : 'translateX(-16px)',
                          transitionProperty: 'opacity, transform',
                          transitionDuration: `${duration}ms`,
                          transitionDelay: `${transitionDelay}ms`,
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                          whiteSpace: 'pre',
                        }}
                      >
                        {char}
                      </span>
                    )
                  })}
                </span>
              )

              charOffset += word.length + 1

              return (
                <span key={`group-${lineIndex}-${wordIndex}`}>
                  {wordNode}
                  {wordIndex < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
                </span>
              )
            })}
          </span>
        )
      })}
    </div>
  )
}

function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-heading-block">
        <div className="section-eyebrow">{eyebrow}</div>
        <h2 className="section-title">{title}</h2>
      </div>
      <p className="section-description">{description}</p>
    </div>
  )
}

type SectionBeamsProps = {
  className?: string
  beamWidth?: number
  beamHeight?: number
  beamNumber?: number
  lightColor?: string
  speed?: number
  noiseIntensity?: number
  scale?: number
  rotation?: number
}

function SectionBeams({ className = '', ...props }: SectionBeamsProps) {
  return (
    <div className={`section-beams ${className}`.trim()} aria-hidden="true">
      <Beams {...props} />
    </div>
  )
}

type LandingHomeProps = {
  onStartProject: () => void
  onOpenMarketplace: () => void
}

function LandingHome({ onStartProject, onOpenMarketplace }: LandingHomeProps) {
  const lowerContentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cleanups: Array<() => void> = []

    const ctx = gsap.context(() => {
      const root = lowerContentRef.current
      if (!root) return

      const headers = gsap.utils.toArray<HTMLElement>('.section-header', root)
      const grids = gsap.utils.toArray<HTMLElement>('.highlights-grid, .split-layout, .cards-grid, .stacked-cards, .marketplace-card', root)
      const cards = gsap.utils.toArray<HTMLElement>('.highlight-card, .feature-card, .marketplace-bullet, .tech-pill', root)
      const magicCards = gsap.utils.toArray<HTMLElement>('.highlight-card, .feature-card, .marketplace-bullets', root)
      const sectionBeams = gsap.utils.toArray<HTMLElement>('.section-beams', root)
      const disableInteractiveFx = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches

      headers.forEach((header) => {
        gsap.fromTo(
          header,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 84%',
              once: true,
            },
          },
        )
      })

      grids.forEach((grid) => {
        gsap.fromTo(
          grid,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              once: true,
            },
          },
        )
      })

      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 28, scale: 0.985 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: 0.1,
              ease: 'power3.out',
              overwrite: true,
            },
          )
        },
      })

      magicCards.forEach((card) => {
        card.classList.add('magic-card')
        card.style.setProperty('--magic-glow-color', '132, 0, 255')
      })

      sectionBeams.forEach((beam, index) => {
        const canvas = beam.querySelector('canvas')

        gsap.to(beam, {
          y: index % 2 === 0 ? -18 : 18,
          x: index % 2 === 0 ? 10 : -10,
          duration: 6.5 + index,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        if (canvas) {
          gsap.to(canvas, {
            scale: index % 2 === 0 ? 1.08 : 1.12,
            rotation: index % 2 === 0 ? -2.2 : 2.2,
            duration: 8 + index,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: '50% 50%',
          })
        }
      })

      if (!disableInteractiveFx && magicCards.length > 0) {
        const spotlight = document.createElement('div')
        spotlight.className = 'cards-spotlight'
        document.body.appendChild(spotlight)

        const handleDocumentMove = (event: MouseEvent) => {
          const pointerX = event.clientX
          const pointerY = event.clientY
          let insideAnyCard = false

          magicCards.forEach((card) => {
            const rect = card.getBoundingClientRect()
            const inside = pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom

            if (inside) {
              insideAnyCard = true
              const relativeX = ((pointerX - rect.left) / rect.width) * 100
              const relativeY = ((pointerY - rect.top) / rect.height) * 100
              card.style.setProperty('--glow-x', `${relativeX}%`)
              card.style.setProperty('--glow-y', `${relativeY}%`)
              card.style.setProperty('--glow-intensity', '1')
            } else {
              card.style.setProperty('--glow-intensity', '0')
            }
          })

          gsap.to(spotlight, {
            x: pointerX,
            y: pointerY,
            opacity: insideAnyCard ? 0.75 : 0,
            duration: insideAnyCard ? 0.18 : 0.35,
            ease: 'power2.out',
            overwrite: true,
          })
        }

        document.addEventListener('mousemove', handleDocumentMove)
        cleanups.push(() => {
          document.removeEventListener('mousemove', handleDocumentMove)
          spotlight.remove()
        })

        magicCards.forEach((card) => {
          const isTechSectionCard = Boolean(card.closest('#tecnologia'))

          const spawnParticleBurst = (x: number, y: number) => {
            for (let index = 0; index < 8; index += 1) {
              const particle = document.createElement('span')
              particle.className = 'magic-particle'
              particle.style.left = `${x}px`
              particle.style.top = `${y}px`
              card.appendChild(particle)

              gsap.fromTo(
                particle,
                { x: 0, y: 0, scale: 0.4, opacity: 0 },
                {
                  x: (Math.random() - 0.5) * 90,
                  y: (Math.random() - 0.5) * 90,
                  scale: 1,
                  opacity: 1,
                  duration: 0.28,
                  ease: 'back.out(1.7)',
                  onComplete: () => {
                    gsap.to(particle, {
                      opacity: 0,
                      scale: 0.2,
                      duration: 0.45,
                      ease: 'power2.out',
                      onComplete: () => particle.remove(),
                    })
                  },
                },
              )
            }
          }

          const handleMove = (event: MouseEvent) => {
            if (isTechSectionCard) return

            const rect = card.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            const rotateX = ((y - centerY) / centerY) * -5
            const rotateY = ((x - centerX) / centerX) * 7
            const magnetX = (x - centerX) * 0.03
            const magnetY = (y - centerY) * 0.03

            gsap.to(card, {
              rotateX,
              rotateY,
              x: magnetX,
              y: magnetY,
              duration: 0.22,
              ease: 'power2.out',
              transformPerspective: 1000,
              overwrite: true,
            })
          }

          const handleEnter = (event: MouseEvent) => {
            const rect = card.getBoundingClientRect()
            spawnParticleBurst(event.clientX - rect.left, event.clientY - rect.top)
          }

          const handleLeave = () => {
            card.style.setProperty('--glow-intensity', '0')

            if (isTechSectionCard) return

            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              x: 0,
              y: 0,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: true,
            })
          }

          const handleClick = (event: MouseEvent) => {
            const rect = card.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            const radius = Math.max(rect.width, rect.height)
            const ripple = document.createElement('span')
            ripple.className = 'magic-ripple'
            ripple.style.width = `${radius * 1.6}px`
            ripple.style.height = `${radius * 1.6}px`
            ripple.style.left = `${x - radius * 0.8}px`
            ripple.style.top = `${y - radius * 0.8}px`
            card.appendChild(ripple)

            gsap.fromTo(
              ripple,
              { scale: 0, opacity: 0.9 },
              {
                scale: 1,
                opacity: 0,
                duration: 0.75,
                ease: 'power2.out',
                onComplete: () => ripple.remove(),
              },
            )
          }

          card.addEventListener('mousemove', handleMove)
          card.addEventListener('mouseenter', handleEnter)
          card.addEventListener('mouseleave', handleLeave)
          card.addEventListener('click', handleClick)

          cleanups.push(() => {
            card.removeEventListener('mousemove', handleMove)
            card.removeEventListener('mouseenter', handleEnter)
            card.removeEventListener('mouseleave', handleLeave)
            card.removeEventListener('click', handleClick)
          })
        })
      }

      ScrollTrigger.refresh()
    }, lowerContentRef)

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      ctx.revert()
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <section className="relative min-h-screen overflow-hidden px-6 pt-6 md:px-12 lg:px-16">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/habitatia-background.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="relative z-10 min-h-screen">
          <header>
            <div className="liquid-glass flex items-center justify-between rounded-xl px-5 py-3 text-white md:px-6">
              <div className="text-3xl font-semibold tracking-tight">HabitatIA</div>

            <nav className="hidden items-center gap-8 text-base text-white/90 md:flex">
              {navigation.map((item) => (
                <a key={item.href} className="transition-colors hover:text-gray-300" href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={onStartProject}
              className="rounded-lg bg-white px-7 py-2.5 text-base font-medium text-black transition-colors hover:bg-gray-100"
            >
              Empezar ahora
            </button>
          </div>
        </header>

        <section className="flex h-[calc(100vh-6rem)] flex-1 pt-6 lg:pt-10">
          <div className="flex h-full w-full flex-col">
            <div className="hero-layout lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-end">
              <div className="mt-12 max-w-[760px] lg:mt-16">
                <FadeIn delay={100} duration={800}>
                  <div className="hero-eyebrow mb-4 md:mb-5">
                    Planificación inteligente para vivienda accesible
                  </div>
                </FadeIn>

                <AnimatedHeading
                  text={'Diseñamos\nviviendas posibles\ncon IA.'}
                  className="hero-heading mb-5 lg:mb-6"
                />

                <AnimatedText
                  delay={800}
                  text={'HabitatIA te ayuda a planificar viviendas simples, funcionales y sostenibles, priorizando el costo, el aprovechamiento de materiales y la posibilidad de crecer por etapas.'}
                  className="hero-copy max-w-[640px] text-[0.98rem] md:text-[1.08rem] lg:text-[1.16rem] leading-snug mb-7 lg:mb-8"
                />

                <FadeIn delay={1200} duration={900}>
                  <div className="mt-14 flex flex-wrap gap-3 mb-8 lg:mt-18 lg:mb-10">
                    <button type="button" onClick={onStartProject} className="hero-btn-primary">Empezar ahora</button>
                    <button type="button" onClick={onOpenMarketplace} className="hero-btn-outlined">Ver marketplace</button>
                  </div>
                </FadeIn>

                <FadeIn delay={1500} duration={900} className="mt-8 lg:mt-12">
                  <div>
                    <div className="hero-stats-divider" />
                    <div className="hero-stats-row">
                      <div className="hero-stat-item">
                        <div className="hero-stat-icon-wrap">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                        </div>
                        <div>
                          <div className="hero-stat-value text-[1.35rem] md:text-[1.65rem] lg:text-[1.9rem]">+120</div>
                          <div className="hero-stat-label text-[0.8rem] md:text-[0.86rem] lg:text-[0.92rem]">viviendas planificadas</div>
                        </div>
                      </div>
                      <div className="hero-stat-sep" />
                      <div className="hero-stat-item">
                        <div className="hero-stat-icon-wrap">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 8C8 10 5.9 16.17 3.82 19.34c-.11.16.04.34.2.26C7.38 17.9 13 15.57 17 8z"/>
                            <path d="M3.82 19.34C8 15 11 13 17 8"/>
                          </svg>
                        </div>
                        <div>
                          <div className="hero-stat-value text-[1.35rem] md:text-[1.65rem] lg:text-[1.9rem]">30%</div>
                          <div className="hero-stat-label text-[0.8rem] md:text-[0.86rem] lg:text-[0.92rem]">menos desperdicio de materiales</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>
        </div>
      </section>

      <div ref={lowerContentRef} className="content-shell px-6 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
        <div className="content-container">
          <section className="section" id="propuesta">
            <SectionBeams
              className="section-beams-propuesta"
              beamWidth={2.2}
              beamHeight={13}
              beamNumber={11}
              lightColor="#2274ff"
              speed={2.1}
              noiseIntensity={1.55}
              scale={0.24}
              rotation={-8}
            />

            <div className="section-content">
            <FadeIn delay={180} duration={900}>
              <div className="highlights-grid">
                {stats.map((stat) => (
                  <div key={stat.label} className="highlight-card">
                    <div className="highlight-value">{stat.value}</div>
                    <div className="highlight-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={240} duration={900}>
              <SectionHeader
                eyebrow="Propuesta"
                title="Una plataforma pensada para ordenar decisiones, costos y crecimiento de una vivienda real."
                description="HabitatIA organiza la información con una estructura más clara para que una familia pueda entender mejor qué construir, cómo priorizar y cómo proyectar una ampliación futura."
              />
            </FadeIn>

            <div className="split-layout proposal-layout">
              <FadeIn delay={320} duration={900}>
                <article className="feature-card feature-card-primary">
                  <h3 className="feature-title">Una herramienta pensada para viviendas posibles y reales.</h3>
                  <p className="feature-description">
                    Combinamos planificación simple, criterios de ahorro y diseño modular para acercar soluciones
                    habitacionales a familias que necesitan construir con recursos limitados.
                  </p>
                </article>
              </FadeIn>

              <FadeIn delay={420} duration={900}>
                <article className="feature-card feature-card-secondary">
                  <div className="card-eyebrow">Objetivo del MVP</div>
                  <p className="feature-description">
                    Construir una primera versión capaz de orientar a una familia sobre qué vivienda conviene, cuánto
                    podría costar y cómo se podría construir de forma progresiva.
                  </p>
                </article>
              </FadeIn>
            </div>
            </div>
          </section>

          <BeforeAfterShowcase />

          <section className="section section-remodelacion" id="remodelacion">
            <SectionBeams
              className="section-beams-remodelacion"
              beamWidth={2.1}
              beamHeight={14}
              beamNumber={11}
              lightColor="#34d399"
              speed={2.15}
              noiseIntensity={1.6}
              scale={0.23}
              rotation={-7}
            />

            <div className="section-content">
            <FadeIn delay={260} duration={900}>
              <h2 className="section-title">Sacás una foto de un ambiente y la IA te ayuda a remodelarlo antes de comprar materiales.</h2>
            </FadeIn>

            <div className="split-layout remodel-layout">
              <FadeIn delay={340} duration={900}>
                <article className="feature-card feature-card-primary remodel-main-card">
                  <div className="card-eyebrow">Nueva funcionalidad</div>
                  <h3 className="feature-title">Una experiencia guiada para remodelar con más claridad visual.</h3>
                  <p className="feature-description">
                    Desde una simple foto, la plataforma va a detectar oportunidades de mejora y proponer materiales que ayuden a renovar el ambiente con una referencia visual mucho más concreta.
                  </p>

                  <div className="remodel-materials">
                    {remodelingMaterials.map((material) => (
                      <span key={material} className="remodel-material-pill">
                        {material}
                      </span>
                    ))}
                  </div>

                  <div className="marketplace-bullets remodel-bullets">
                    <div className="marketplace-bullet">subís la foto de un ambiente real de tu casa</div>
                    <div className="marketplace-bullet">la IA recomienda materiales acordes al espacio</div>
                    <div className="marketplace-bullet">elegís alternativas y ves cómo quedaría el resultado final</div>
                  </div>
                </article>
              </FadeIn>

              <FadeIn delay={400} duration={900}>
                <div className="remodel-carousel-card">
                  <RemodelCarousel />
                </div>
              </FadeIn>
            </div>
            </div>
          </section>

          <section className="section" id="impacto">
            <SectionBeams
              className="section-beams-impacto"
              beamWidth={2.1}
              beamHeight={14}
              beamNumber={11}
              lightColor="#d4af37"
              speed={2.2}
              noiseIntensity={1.65}
              scale={0.24}
              rotation={6}
            />

            <div className="section-content">
            <FadeIn delay={260} duration={900}>
              <SectionHeader
                eyebrow="Triple impacto"
                title="Tecnología aplicada a una vivienda digna, accesible y eficiente."
                description="HabitatIA busca que más familias puedan proyectar una casa posible de construir hoy y preparada para crecer mejor con el tiempo."
              />
            </FadeIn>

            <div className="cards-grid cards-grid-3">
              {impacts.map((impact, index) => (
                <FadeIn key={impact.title} delay={360 + index * 110} duration={900}>
                  <article className={`feature-card feature-card-equal ${index === 0 ? 'impact-social' : index === 1 ? 'impact-environmental' : 'impact-economic'}`}>
                    <h3 className="feature-title">{impact.title}</h3>
                    <p className="feature-description">{impact.description}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
            </div>
          </section>

          <section className="section" id="tecnologia">
            <SectionBeams
              className="section-beams-tecnologia"
              beamWidth={2}
              beamHeight={15}
              beamNumber={12}
              lightColor="#7c3aed"
              speed={2.35}
              noiseIntensity={1.7}
              scale={0.22}
              rotation={-4}
            />

            <div className="section-content">
            <FadeIn delay={280} duration={900}>
              <SectionHeader
                eyebrow="Tecnología Base"
                title="Una base técnica clara para orientar mejor antes de construir."
                description="La experiencia combina información ordenada, un lenguaje simple y una base tecnológica flexible para evolucionar hacia recomendaciones más inteligentes."
              />
            </FadeIn>

            <div className="split-layout tech-layout">
              <FadeIn delay={360} duration={900}>
                <article className="feature-card feature-card-primary tech-main-card">
                  <h3 className="feature-title">Orientación clara para decidir mejor antes de construir.</h3>
                  <p className="feature-description">
                    La plataforma fue pensada para dar una primera orientación clara sobre qué vivienda conviene,
                    cuánto podría costar y cómo se podría construir de forma progresiva.
                  </p>
                  <div className="tech-pills">
                    {['React', 'Bootstrap', 'Node.js', 'API REST', 'Cloud Computing', 'IA Generativa'].map((tech) => (
                      <span key={tech} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              </FadeIn>

              <div className="stacked-cards">
                {features.map((feature, index) => (
                  <FadeIn key={feature.title} delay={440 + index * 110} duration={900}>
                    <article className="feature-card">
                      <h3 className="feature-title">{feature.title}</h3>
                      <p className="feature-description">{feature.description}</p>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </div>
            </div>
          </section>

          <section className="section section-final" id="marketplace">
            <SectionBeams
              className="section-beams-marketplace"
              beamWidth={2.1}
              beamHeight={13}
              beamNumber={10}
              lightColor="#60a5fa"
              speed={2}
              noiseIntensity={1.5}
              scale={0.22}
              rotation={8}
            />

            <div className="section-content">
            <FadeIn delay={300} duration={900}>
              <SectionHeader
                eyebrow="Marketplace"
                title="Materiales, compras y decisiones básicas para gastar mejor."
                description="La capa comercial de HabitatIA ordena alternativas y ayuda a comparar compras dentro de un presupuesto real, sin perder claridad ni foco."
              />
            </FadeIn>

            <FadeIn delay={400} duration={900}>
              <article className="feature-card marketplace-card">
                <div className="marketplace-layout">
                  <div>
                    <h3 className="feature-title">Comprar con criterio, comparar opciones y construir por etapas.</h3>
                    <p className="feature-description">
                      La propuesta de HabitatIA también contempla una capa de marketplace para orientar compras,
                      comparar alternativas y optimizar materiales dentro de un presupuesto real.
                    </p>
                  </div>

                  <div className="marketplace-bullets">
                    <div className="marketplace-bullet">pensar una vivienda posible según el dinero disponible</div>
                    <div className="marketplace-bullet">construir por etapas y crecer más adelante</div>
                    <div className="marketplace-bullet">tomar decisiones más claras con menos desperdicio</div>
                  </div>
                </div>
              </article>
            </FadeIn>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default LandingHome
