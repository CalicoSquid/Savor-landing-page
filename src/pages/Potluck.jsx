import { useState, useRef, useEffect, useCallback } from 'react'
import './potluck.css'

// ── Constants ──────────────────────────────────────────────────────────────────
const GQL_ENDPOINT = 'https://savor-app-server-gql-production.up.railway.app'
const MAX_SPINS    = 3
const SPIN_DURATION = 1800
const SPIN_SYMBOLS  = ['🍳','🥗','🍝','🍕','🍔','🍜','🥘','🍱','🌮','🥐','🍣','🍲','🥩','🍰','🦞','🌯','🍛','🫕']

const IDLE_HEADLINES = ['Spin For Your Supper!','What\'s on the menu?','Feeling lucky, chef?','Leave it to fate.','Let the wheel decide.','No plans? No problem.']
const IDLE_SUBLINES  = ['No scrolling. No deciding. Just cook.','One spin. One recipe. Done.','The universe picked it. You cook it.','Dinner sorted in seconds.']
const MID_HEADLINES  = ['Not feeling it?','Uninspired?','Not quite right?','Keep going?','Nearly there.']
const CAP_HEADLINES  = ['That\'s your three.','Three spins. That\'s the deal.','The wheel has spoken.','Alright, you\'ve seen enough.']
const CAP_CHEEKS     = ['Surely one of those will do?','The wheel tried its best.','Three great options right there.','You dare defy the universe?']

const SAVOR_SCREENSHOTS = [
    { file: '/screenshots/scan.png', title: 'Snap to Save', sub: 'Point your camera at any cookbook page. Savor reads it, structures it, saves it. No typing.', bg: 'linear-gradient(135deg, #C62828, #FF4081)' },
    { file: '/screenshots/found.png',  title: 'Just One Tap',   sub: 'Browse the web inside the app. Find a recipe you love, hit import — it\'s yours forever.',     bg: 'linear-gradient(135deg, #303F9F, #5C6BC0)' },
    { file: '/screenshots/community.png',       title: 'Share the Love', sub: 'Post to the community feed. See what the world is cooking. Save anything that looks good.',   bg: 'linear-gradient(135deg, #8BC34A, #689F38)' },
]

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ── GraphQL fetch ──────────────────────────────────────────────────────────────
async function fetchRandomRecipe(excludeIds = []) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10000)
    try {
        const res = await fetch(GQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                query: `query RandomRecipe($excludeIds: [ID]) {
                    randomRecipe(excludeIds: $excludeIds) {
                        id name description image category cuisine
                    }
                }`,
                variables: { excludeIds },
            }),
        })
        const json = await res.json()
        return json?.data?.randomRecipe ?? null
    } finally {
        clearTimeout(timer)
    }
}

// ── SlotReel (web port) ────────────────────────────────────────────────────────
const NOTCH_COLORS = ['#FF9800', '#4caf50', '#142829']

function SlotReel({ recipe, isSpinning, index, onPress }) {
    const [spinSymbol, setSpinSymbol] = useState(null)
    const [locked, setLocked]         = useState(!!recipe)
    const [scale, setScale]           = useState(1)
    const [glow, setGlow]             = useState(false)
    const [nameFade, setNameFade]     = useState(recipe ? 1 : 0)
    const prevId = useRef(recipe?.id)

    // Spinning ticker
    useEffect(() => {
        if (!isSpinning || locked) return
        let step = 0
        const totalSteps = Math.round(SPIN_DURATION / 55)
        let t
        const tick = () => {
            step++
            setSpinSymbol(prev => {
                let next
                do { next = SPIN_SYMBOLS[Math.floor(Math.random() * SPIN_SYMBOLS.length)] }
                while (next === prev)
                return next
            })
            const progress = Math.min(step / totalSteps, 1)
            const delay = 55 + (190 - 55) * progress
            t = setTimeout(tick, delay)
        }
        t = setTimeout(tick, 55)
        return () => clearTimeout(t)
    }, [isSpinning, locked])

    // Lock on new recipe
    useEffect(() => {
        if (!recipe) {
            setLocked(false); setScale(1); setGlow(false); setNameFade(0); setSpinSymbol(null)
            prevId.current = null
            return
        }
        if (recipe.id === prevId.current) return
        prevId.current = recipe.id
        setLocked(true); setSpinSymbol(null)
        // Spring-ish scale punch
        setScale(0.84)
        setTimeout(() => setScale(1.06), 60)
        setTimeout(() => setScale(1),    180)
        // Glow flash
        setGlow(true)
        setTimeout(() => setGlow(false), 480)
        // Name fade
        setTimeout(() => setNameFade(1), 200)
    }, [recipe?.id])

    const isFilled   = !!recipe
    const isShowSpin = isSpinning && !locked

    return (
        <div className="pl-reel-col">
            <div
                className={`pl-reel-frame ${isFilled ? 'pl-reel-frame--filled' : ''} ${glow ? 'pl-reel-frame--glow' : ''}`}
                onClick={isFilled && onPress ? onPress : undefined}
                style={{ cursor: isFilled ? 'pointer' : 'default', transform: `scale(${scale})`, transition: 'transform 0.15s' }}
            >
                <div className="pl-reel-notch" style={{ background: NOTCH_COLORS[index] }} />
                <div className="pl-reel-window">
                    {isFilled ? (
                        <div className="pl-reel-locked">
                            <img src="/potluck/savor-logo.png" alt="Savor" className="pl-reel-logo" />
                        </div>
                    ) : isShowSpin && spinSymbol ? (
                        <div className="pl-reel-spin"><span className="pl-reel-emoji">{spinSymbol}</span></div>
                    ) : (
                        <div className="pl-reel-idle"><span className="pl-reel-q">?</span></div>
                    )}
                </div>
            </div>
            <div className="pl-reel-name" style={{ opacity: nameFade, transition: 'opacity 0.28s' }}>
                {recipe?.name ?? ''}
            </div>
        </div>
    )
}

// ── Main Potluck page ──────────────────────────────────────────────────────────
export default function Potluck() {
    const [phase,      setPhase]      = useState('idle')   // idle | spinning | revealed | softCap
    const [spinCount,  setSpinCount]  = useState(0)
    const [seenIds,    setSeenIds]    = useState([])
    const [slots,      setSlots]      = useState([null, null, null])
    const [errorMsg,   setErrorMsg]   = useState(null)
    const [rotation,   setRotation]   = useState(0)
    const [raysVis,    setRaysVis]    = useState(false)
    const [copy] = useState(() => ({
        idleHeadline: pick(IDLE_HEADLINES),
        idleSubline:  pick(IDLE_SUBLINES),
        midHeadline:  pick(MID_HEADLINES),
        capHeadline:  pick(CAP_HEADLINES),
        capCheek:     pick(CAP_CHEEKS),
    }))

    const rotRef     = useRef(0)
    const rafRef     = useRef(null)
    const [spinBtnScale, setSpinBtnScale] = useState(1)

    const isSpinning = phase === 'spinning'
    const isSoftCap  = phase === 'softCap'
    const hasSpun    = spinCount > 0

    // Entry spin demo
    useEffect(() => {
        const target = 2.4 * 360
        const start  = performance.now()
        const dur    = 1400
        const animate = (now) => {
            const t = Math.min((now - start) / dur, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            const val = ease * target
            setRotation(val)
            rotRef.current = val
            if (t < 1) rafRef.current = requestAnimationFrame(animate)
        }
        const id = setTimeout(() => { rafRef.current = requestAnimationFrame(animate) }, 400)
        return () => { clearTimeout(id); cancelAnimationFrame(rafRef.current) }
    }, [])

    const handleSpin = useCallback(async () => {
        if (phase === 'spinning') return
        setErrorMsg(null)
        setPhase('spinning')
        setRaysVis(false)
        setSpinBtnScale(0.94)
        setTimeout(() => setSpinBtnScale(1), 220)

        const target = rotRef.current + (4 + Math.random()) * 360
        const start  = performance.now()
        const animPromise = new Promise(resolve => {
            const animate = (now) => {
                const t = Math.min((now - start) / SPIN_DURATION, 1)
                const ease = 1 - Math.pow(1 - t, 3)
                const val = rotRef.current + (target - rotRef.current) * ease
                setRotation(val)
                if (t < 1) { rafRef.current = requestAnimationFrame(animate) }
                else        { rotRef.current = target; resolve() }
            }
            rafRef.current = requestAnimationFrame(animate)
        })

        const [recipe] = await Promise.all([
            fetchRandomRecipe(seenIds).catch(() => null),
            animPromise,
        ])

        if (!recipe) {
            setPhase(spinCount > 0 ? 'revealed' : 'idle')
            setErrorMsg('Couldn\'t reach the server — give it another spin.')
            return
        }

        const nextCount = spinCount + 1
        const nextSeen  = [...seenIds, recipe.id]
        const nextSlots = slots.map((s, i) => i === nextCount - 1 ? recipe : s)

        setSeenIds(nextSeen)
        setSpinCount(nextCount)
        setSlots(nextSlots)
        setPhase(nextCount >= MAX_SPINS ? 'softCap' : 'revealed')
        setRaysVis(true)
    }, [phase, seenIds, spinCount, slots])

    const handleReset = useCallback(() => {
        setPhase('idle'); setSpinCount(0); setSeenIds([]); setSlots([null, null, null])
        setErrorMsg(null); setRaysVis(false)
    }, [])

    const headline = isSoftCap ? copy.capHeadline : hasSpun ? copy.midHeadline : copy.idleHeadline
    const subline  = isSoftCap ? copy.capCheek    : hasSpun ? `${MAX_SPINS - spinCount} spin${MAX_SPINS - spinCount === 1 ? '' : 's'} left — make it count.` : copy.idleSubline

    return (
        <main className="page pl-page">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="pl-hero">
                <div className="pl-hero-bg" />
                <div className="container pl-hero-inner">

                    {/* Wheel demo */}
                    <div className="pl-wheel-col">
                        <img src="/potluck/wordmark2.png" alt="Potluck by Savor" className="pl-wordmark" />

                        <div className="pl-wheel-wrap">
                            <img
                                src="/potluck/rays.png"
                                alt=""
                                className="pl-rays"
                                style={{ opacity: raysVis ? 1 : 0, transition: 'opacity 0.6s' }}
                            />
                            <img
                                src="/potluck/spinner.png"
                                alt=""
                                className="pl-spinner"
                                style={{ transform: `translateY(8.5%) rotate(${rotation}deg)` }}
                            />
                            <img src="/potluck/outer.png" alt="" className="pl-outer" />
                        </div>

                        {/* Messaging */}
                        <div className="pl-messaging">
                            {errorMsg ? (
                                <p className="pl-error">{errorMsg}</p>
                            ) : (
                                <>
                                    <p className="pl-headline">{headline}</p>
                                    <p className="pl-subline">{subline}</p>
                                </>
                            )}
                        </div>

                        {/* Slot reels */}
                        <div className="pl-reels-row">
                            <div className="pl-win-line" />
                            {slots.map((recipe, i) => (
                                <SlotReel
                                    key={i}
                                    index={i}
                                    recipe={recipe}
                                    isSpinning={isSpinning}
                                    isActiveReel={isSpinning && i === spinCount}
                                    onPress={() => recipe && window.open(`/r/${recipe.id}`, '_blank')}
                                />
                            ))}
                        </div>

                        {/* Spin CTA */}
                        <div className="pl-cta-row">
                            {isSoftCap ? (
                                <button className="pl-reset-btn" onClick={handleReset}>← Start over</button>
                            ) : (
                                <button
                                    className="pl-spin-btn"
                                    onClick={handleSpin}
                                    disabled={isSpinning}
                                    style={{ transform: `scale(${spinBtnScale})`, transition: 'transform 0.22s' }}
                                >
                                    <span className="pl-spin-label">{isSpinning ? 'The wheel decides…' : hasSpun ? 'Spin again' : 'Spin'}</span>
                                    <span className="pl-spin-sub">{isSpinning ? '' : hasSpun ? 'Get another random recipe' : 'Get a random community recipe'}</span>
                                </button>
                            )}
                        </div>

                        <p className="pl-powered">Powered by Savor</p>
                    </div>

                    {/* Pitch row — below wheel */}
                    <div className="pl-pitch-col">
                        <img src="/potluck/supper2.png" alt="Spin For Your Supper" className="pl-supper" />
                        <div className="pl-pitch-right">
                            <p className="pl-pitch-sub">
                                Can't choose what to cook? Spin the wheel. Potluck pulls a random recipe from the Savor community — no browsing, no scrolling, no decision fatigue.
                            </p>
                            <div className="pl-pitch-divider" />
                            <ul className="pl-perks">
                                <li>Free — no account needed</li>
                                <li>Real recipes from real cooks</li>
                                <li>Three spins, then pick one and cook</li>
                                <li>Tap any result for the full recipe</li>
                            </ul>
                        </div>
                        <a
                            href="https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck"
                            className="pl-store-btn"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src="/potluck/play2.png" alt="Get it on Google Play" className="pl-play-badge" />
                        </a>
                    </div>

                </div>
            </section>

            {/* ── How it works ─────────────────────────────────────── */}
            <section className="pl-how">
                <div className="container pl-how-inner">
                    <img src="/potluck/fate.png" alt="Accept Your Culinary Fate" className="pl-fate-img" />
                    <div className="pl-steps">
                        {[
                            { n: '1', title: 'Spin the wheel', sub: 'Hit spin and Potluck pulls a real recipe from the Savor community — no repeats.' },
                            { n: '2', title: 'Not feeling it?', sub: 'You get three spins. Each one fetches something new. Use them wisely.' },
                            { n: '3', title: 'Pick one and cook', sub: 'Tap any result to see the full recipe. Ingredients, steps, times — all of it.' },
                        ].map(s => (
                            <div className="pl-step" key={s.n}>
                                <div className="pl-step-num">{s.n}</div>
                                <h3 className="pl-step-title">{s.title}</h3>
                                <p className="pl-step-sub">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Savor pitch ──────────────────────────────────────── */}
            <section className="pl-savor-pitch">
                <div className="container pl-savor-inner">
                    <div className="pl-savor-text">
                        <p className="pl-section-overline">Want more?</p>
                        <h2 className="pl-savor-title">Potluck is just the beginning.</h2>
                        <p className="pl-savor-sub">
                            Potluck draws from Savor — a full recipe app where you can save anything from anywhere. Paste a URL, scan a cookbook page, or type in grandma's secret. Your whole kitchen, in one place.
                        </p>
                        <div className="pl-savor-features">
                            {['Save from any URL or cookbook page', 'No ads. No life stories. Just recipes.', '25 free recipes — unlimited with Pro', 'Community feed of real home cooks'].map(f => (
                                <div className="pl-savor-feature" key={f}>
                                    <span className="pl-feature-dot" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                        <a href="/" className="pl-savor-cta">Explore Savor →</a>
                    </div>

                    <div className="pl-savor-screenshots">
                        {SAVOR_SCREENSHOTS.map((s) => (
                            <img
                                key={s.file}
                                src={s.file}
                                alt={s.title}
                                className="pl-screenshot-phone"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ─────────────────────────────────────────── */}
            <section className="pl-final-cta">
                <div className="container pl-final-inner">
                    <h2 className="pl-final-title">Free. No strings. Just dinner.</h2>
                    <p className="pl-final-sub">Download Potluck and let the wheel sort it out.</p>
                    <a
                        href="https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck"
                        className="pl-store-btn pl-store-btn--large"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Get Potluck on Android — Free
                    </a>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────── */}
            <footer className="footer">
                <div className="container footer-inner">
                    <span className="footer-copy">
                        <a href="/studio" className="footer-csc-link">
                            calicoSquid<span className="footer-csc-code">Code</span>
                        </a>
                    </span>
                </div>
            </footer>

        </main>
    )
}