import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scenePrompts = {
  hero: {
    depth: 'Dark architectural stage, front copy stable while particles and background haze drift behind it.',
    parallax: 'Hero copy, orb glows and particle field move at independent speeds to create premium depth.',
    camera: 'Slow dolly-in with subtle lateral drift, no hard cuts, only scroll-linked scale and light changes.',
  },
  stats: {
    depth: 'Floating metric panels over a dark glass surface with soft edge lighting.',
    parallax: 'Cards advance slightly faster than the strip to keep momentum after the hero.',
    camera: 'Quick settling move that resets the scene before the content sections begin.',
  },
  proposal: {
    depth: 'Minimal dark canvas with atmospheric glow behind feature cards for measured spatial separation.',
    parallax: 'Copy block, atmosphere and cards travel at different offsets without affecting readability.',
    camera: 'Gentle forward push while the grid locks into place like one continuous sequence.',
  },
  impact: {
    depth: 'Contrast-heavy cards suspended over a deeper background plane with restrained bloom.',
    parallax: 'Foreground cards carry more motion than the section shell to keep focus on the three pillars.',
    camera: 'Smooth pass-through that maintains legibility and premium rhythm.',
  },
  technology: {
    depth: 'Copy column and objective panel live on separate planes with subtle glow and shadow contrast.',
    parallax: 'Tech pills, panel and atmosphere separate slightly to avoid flat scrolling.',
    camera: 'Slow rise with a calm settle into the final team beat.',
  },
  team: {
    depth: 'Minimal closing section with cards hovering over a dark stage and ambient blue-green glows.',
    parallax: 'Team cards move in staggered depth bands while the background remains restrained.',
    camera: 'Final approach that resolves softly at the end of the page.',
  },
}

export function initHomeAnimations(root) {
  if (!root) return () => {}

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return () => {}

  let cleanupThree = null

  const ctx = gsap.context(() => {
    const hero = root.querySelector('.hero-section')
    const heroCanvas = root.querySelector('.hero-canvas')
    const heroCopy = root.querySelector('.hero-copy')
    const heroCard = root.querySelector('.hero-card')
    const orbs = root.querySelectorAll('.hero-orb')
    const sections = root.querySelectorAll('.scene-section')

    gsap.set('.scene-card, .floating-panel', { transformPerspective: 1600 })

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.habitat-navbar', { y: -52, opacity: 0, duration: 0.8 })
      .from('.navbar .nav-item, .navbar .btn-success', { y: -14, opacity: 0, stagger: 0.06, duration: 0.45 }, '-=0.5')
      .from('.hero-copy > *', { y: 42, opacity: 0, stagger: 0.1, duration: 0.8 }, '-=0.25')
      .from(heroCard, { y: 54, opacity: 0, rotateY: -6, duration: 0.9 }, '-=0.6')

    if (hero) {
      gsap.to(hero, {
        '--hero-overlay-opacity': 0.72,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(heroCopy, {
        yPercent: -14,
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(heroCard, {
        yPercent: -8,
        rotateY: -6,
        rotateX: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.1,
        },
      })

      orbs.forEach((orb, index) => {
        gsap.to(orb, {
          xPercent: index === 0 ? -12 : 16,
          yPercent: index === 0 ? 14 : -10,
          scale: index === 0 ? 1.2 : 0.88,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      })
    }

    sections.forEach((section, index) => {
      const sceneKey = section.dataset.scene || 'proposal'
      const prompts = scenePrompts[sceneKey] || scenePrompts.proposal
      section.dataset.depthPrompt = prompts.depth
      section.dataset.parallaxPrompt = prompts.parallax
      section.dataset.cameraPrompt = prompts.camera

      if (!section.classList.contains('hero-section')) {
        gsap.fromTo(section,
          { opacity: 0.72, y: 86 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 55%',
              scrub: 1,
            },
          },
        )
      }

      gsap.to(section.querySelectorAll('.scene-card, .floating-panel'), {
        z: 42,
        rotateX: 3,
        rotateY: index % 2 === 0 ? -2 : 2,
        yPercent: -4,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 25%',
          scrub: 1,
        },
      })

      const atmosphere = section.querySelector('.section-atmosphere')
      if (atmosphere) {
        const [firstGlow, secondGlow] = atmosphere.children
        gsap.to(firstGlow, {
          xPercent: 10,
          yPercent: -14,
          scale: 1.16,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.15,
          },
        })
        gsap.to(secondGlow, {
          xPercent: -10,
          yPercent: 14,
          scale: 0.88,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

      const heading = section.querySelectorAll('.section-kicker, .section-title, .section-text')
      if (heading.length) {
        gsap.from(heading, {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    })

    gsap.utils.toArray(root.querySelectorAll('.feature-card, .impact-card, .team-card, .stat-card, .info-panel')).forEach((card, index) => {
      gsap.from(card, {
        y: 48,
        opacity: 0,
        scale: 0.97,
        rotateX: 4,
        duration: 0.8,
        delay: index * 0.03,
        scrollTrigger: {
          trigger: card,
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    gsap.to(root.querySelectorAll('.tech-pill'), {
      yPercent: -12,
      stagger: 0.03,
      ease: 'none',
      scrollTrigger: {
        trigger: root.querySelector('[data-scene="technology"]'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })

    if (heroCanvas) {
      import('three').then((THREE) => {
        if (!heroCanvas.isConnected) return

        const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true })
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
        camera.position.set(0, 0, 7.2)

        const resize = () => {
          const width = hero.clientWidth || window.innerWidth
          const height = hero.clientHeight || window.innerHeight
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
        }

        const ambient = new THREE.AmbientLight(0x8fbaff, 0.7)
        scene.add(ambient)
        const point = new THREE.PointLight(0x57e49a, 1.8, 24, 2)
        point.position.set(2.4, 1.1, 4.2)
        scene.add(point)

        const geometry = new THREE.BufferGeometry()
        const count = 220
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i += 1) {
          positions[i * 3] = (Math.random() - 0.5) * 11
          positions[i * 3 + 1] = (Math.random() - 0.5) * 7
          positions[i * 3 + 2] = (Math.random() - 0.5) * 5
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        const material = new THREE.PointsMaterial({
          color: 0xa6ffe3,
          size: 0.05,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })

        const particles = new THREE.Points(geometry, material)
        scene.add(particles)

        const state = { progress: 0 }
        const renderScene = () => {
          const p = state.progress
          particles.rotation.y = p * 1.15
          particles.rotation.x = 0.18 + p * 0.25
          particles.position.z = -0.4 + p * 0.8
          point.position.x = 2.4 - p * 1.3
          point.intensity = 1.8 + p * 0.6
          camera.position.z = 7.2 - p * 2.1
          camera.position.x = p * 0.3
          renderer.render(scene, camera)
        }

        resize()
        renderScene()

        const trigger = ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            state.progress = self.progress
            renderScene()
          },
        })

        window.addEventListener('resize', resize, { passive: true })

        cleanupThree = () => {
          trigger.kill()
          window.removeEventListener('resize', resize)
          geometry.dispose()
          material.dispose()
          renderer.dispose()
        }
      })

    }
  }, root)

  return () => {
    cleanupThree?.()
    ctx.revert()
  }
}
