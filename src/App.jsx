import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Phone, User } from 'lucide-react'

// PROFILE IMAGE LOADING STRATEGY
// - Uses GitHub avatar by default (no local file required)
// - If you later add /public/profile.jpg or /public/profile.webp, they will be tried first
// ...
const GITHUB_USERNAME = 'jawwad9226'
const SIMPLE_SRC = `https://github.com/${GITHUB_USERNAME}.png?size=320`

// Use the base path so URLs work on GitHub Pages (e.g., /Myportfolio/)
const PUBLIC_BASE = import.meta.env.BASE_URL || '/'

const CANDIDATE_SRCS = [
  `${PUBLIC_BASE}profile.webp`, // optional (if you add it later)
  `${PUBLIC_BASE}profile.jpg`,  // your uploaded image in public/
  SIMPLE_SRC,                   // always available fallback (GitHub avatar)
]
// ...

// Default palette (khaki + red accents) if extraction fails
const DEFAULT_PALETTE = {
  bgFrom: '#f7f4ef',
  bgMid: '#fefefe',
  bgTo: '#f1e7d6',
  accent: '#c62828',
  accentSoft: '#e57373',
  chipBg: 'rgba(198,40,40,0.08)',
  chipText: '#a72a2a',
  link: '#0b5aaa',
}

const clamp = (v, min = 0, max = 255) => Math.max(min, Math.min(max, v))
const toHex = (n) => clamp(Math.round(n)).toString(16).padStart(2, '0')
const rgbToHex = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`
const mix = (c1, c2, t) => Math.round(c1 + (c2 - c1) * t)

function usePaletteFromImage(src, fallback = DEFAULT_PALETTE) {
  const [palette, setPalette] = useState(fallback)

  useEffect(() => {
    if (!src) {
      setPalette(fallback)
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const size = 16
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, size, size)
        const data = ctx.getImageData(0, 0, size, size).data
        let r = 0, g = 0, b = 0, count = 0

        for (let i = 0; i < data.length; i += 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }
        r /= count; g /= count; b /= count

        const base = { r, g, b }
        const light = rgbToHex(mix(base.r, 255, 0.85), mix(base.g, 255, 0.85), mix(base.b, 255, 0.85))
        const mid   = rgbToHex(mix(base.r, 255, 0.95), mix(base.g, 255, 0.95), mix(base.b, 255, 0.95))
        const dark  = rgbToHex(mix(base.r, 240, 0.50), mix(base.g, 240, 0.50), mix(base.b, 240, 0.50))

        const accentR = clamp(base.r + 60, 80, 210)
        const accentG = clamp(base.g - 40, 30, 120)
        const accentB = clamp(base.b - 40, 30, 120)
        const accent = rgbToHex(accentR, accentG, accentB)
        const accentSoft = rgbToHex(mix(accentR, 255, 0.5), mix(accentG, 255, 0.5), mix(accentB, 255, 0.5))
        const chipBg = `rgba(${accentR},${accentG},${accentB},0.10)`
        const chipText = rgbToHex(mix(accentR, 0, 0.1), mix(accentG, 0, 0.1), mix(accentB, 0, 0.1))
        const link = rgbToHex(mix(base.r, 40, 0.2), mix(base.g, 90, 0.4), mix(base.b, 180, 0.6))

        setPalette({
          bgFrom: light,
          bgMid: mid,
          bgTo: dark,
          accent,
          accentSoft,
          chipBg,
          chipText,
          link,
        })
      } catch {
        setPalette(fallback)
      }
    }

    img.onerror = () => setPalette(fallback)
  }, [src])

  return palette
}

function SmartAvatar({ candidates, size = 112, alt = 'Profile photo', onReady }) {
  const [srcIndex, setSrcIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [failedAll, setFailedAll] = useState(false)
  const currentSrc = candidates[srcIndex]

  useEffect(() => {
    setLoaded(false)
    setFailedAll(false)
  }, [srcIndex])

  const onError = () => {
    if (srcIndex < candidates.length - 1) {
      setSrcIndex(srcIndex + 1)
    } else {
      setFailedAll(true)
    }
  }

  const onLoad = () => {
    setLoaded(true)
    onReady && onReady(currentSrc)
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {!loaded && !failedAll && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" aria-hidden="true" />
      )}
      {failedAll ? (
        <div className="flex items-center justify-center rounded-3xl bg-white shadow-2xl border-4 border-white" style={{ width: size, height: size }} title="Default profile icon">
          <User size={Math.max(32, size * 0.45)} className="text-gray-400" />
        </div>
      ) : (
        <motion.img
          src={currentSrc}
          alt={alt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={onLoad}
          onError={onError}
          className="rounded-3xl object-cover shadow-2xl border-4 border-white"
          whileHover={{ scale: 1.05, rotate: 2 }}
          style={{ width: size, height: size }}
        />
      )}
    </div>
  )
}

export default function App() {
  const projects = [
    { name: 'CineTray', repo: 'jawwad9226/CineTray', tags: ['PWA', 'Watchlist', 'Android-focused'], desc: 'A modern, mobile-first Progressive Web App for managing personal entertainment watchlists — built for speed, minimalism, and offline-first use.' },
    { name: 'NCC_Veer_Nirman', repo: 'jawwad9226/Veer_Nirman', tags: ['Full-stack', 'FastAPI', 'React'], desc: 'Maharashtra NCC state-level innovation project — built with FastAPI and React, empowering cadets and instructors through digital innovation.' },
    { name: 'AI Terminal', repo: 'jawwad9226/ai-terminal', tags: ['CLI', 'AI'], desc: 'A cross-platform AI-powered terminal assistant that transforms traditional command-line usage into a smart, interactive experience.' },
    { name: 'NCC_ABYAS', repo: 'jawwad9226/NCC_ABYAS', tags: ['NCC', 'Learning'], desc: 'Interactive NCC learning environment — syllabus-based modules, quizzes, and progress tracking for cadets.' },
    { name: 'Working Hours Record Keeper', repo: 'jawwad9226/hours_records', tags: ['Utility', 'Python'], desc: 'Track, log, and visualize working hours efficiently with a clean Python-based interface.' },
    { name: 'Feedback System', repo: 'jawwad9226/feedback-system', tags: ['Web', 'Data'], desc: 'Lightweight feedback collection and analytics web application with structured insights.' },
  ]

  const skills = [
    'FastAPI', 'React.js', 'Python', 'C / C++', 'Firebase / Firestore', 'SQL',
    'Full-Stack Development', 'Application Development', 'Networking',
    'Data Modeling', 'Data Analysis', 'OOP Concepts'
  ]

  const [themeSource, setThemeSource] = useState(SIMPLE_SRC)
  const palette = usePaletteFromImage(themeSource, DEFAULT_PALETTE)

  const rootStyle = useMemo(() => ({
    ['--bg-from']: palette.bgFrom,
    ['--bg-mid']: palette.bgMid,
    ['--bg-to']: palette.bgTo,
    ['--accent']: palette.accent,
    ['--accent-soft']: palette.accentSoft,
    ['--chip-bg']: palette.chipBg,
    ['--chip-text']: palette.chipText,
    ['--link']: palette.link,
  }), [palette])

  return (
    <div className="min-h-screen text-slate-900 bg-gradient-to-br from-[var(--bg-from)] via-[var(--bg-mid)] to-[var(--bg-to)]" style={rootStyle}>
      <motion.header initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-8">
        <div className="flex items-center gap-6">
          <SmartAvatar candidates={CANDIDATE_SRCS} size={112} alt="Profile photo" onReady={(src) => setThemeSource(src)} />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Shaikh Jawwad Ahmad</h1>
            <p className="text-base text-slate-700 mt-1">Full-Stack Developer • NCC Cadet • Engineer</p>
            <div className="flex gap-3 mt-3 text-slate-600">
              <ContactButton href="mailto:shaikhjawwadahmadmomin@gmail.com" label="Email" icon={<Mail size={18} />} />
              <ContactButton href="tel:+919096997459" label="Call" icon={<Phone size={18} />} />
              <ContactButton href={`https://github.com/${GITHUB_USERNAME}`} label="GitHub" icon={<Github size={18} />} external />
              <ContactButton href="https://www.linkedin.com/in/shaikh-jawwad-ahmad-25002b237/" label="LinkedIn" icon={<Linkedin size={18} />} external />
            </div>
          </div>
        </div>
      </motion.header>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="max-w-5xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-slate-700 leading-relaxed">I am a passionate full-stack developer and NCC cadet with a vision to merge discipline, technology, and impact. My journey has been defined by curiosity, precision, and purpose — from building full-fledged PWA systems to leading state-level NCC innovation projects. I thrive on transforming creative ideas into real, impactful applications.</p>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="max-w-5xl mx-auto p-8 rounded-3xl shadow-lg mb-10 bg-gradient-to-br from-[color:var(--chip-bg)] to-white">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <motion.div key={skill} whileHover={{ scale: 1.05 }} className="py-2 px-4 bg-white rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-slate-800">
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Projects & Creations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <motion.a key={p.repo} href={`https://github.com/${p.repo}`} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.02 }} className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-slate-100 p-5">
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--link)' }}>{p.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{p.desc}</p>
              <div className="text-xs text-slate-600 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="px-2 py-1 rounded-md" style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)' }}>{t}</span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </motion.section>

      <footer className="text-center py-8 text-slate-600 text-sm">
        <span style={{ color: 'var(--chip-text)' }}>Built with ❤️</span> using React + Tailwind + Framer Motion • © {new Date().getFullYear()} Shaikh Jawwad Ahmad
      </footer>
    </div>
  )
}

function ContactButton({ href, label, icon, external = false }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="group relative inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5" style={{ color: 'var(--chip-text)' }} title={label}>
      <span className="text-slate-600 group-hover:text-[color:var(--link)] transition-colors">{icon}</span>
      <span className="text-xs font-medium text-slate-700 group-hover:text-[color:var(--link)] transition-colors">{label}</span>
      <span className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
    </a>
  )
}
