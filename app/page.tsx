import Link from "next/link";

const milestones = [
  ["01", "AI, ML & deep learning", "Learn the language"],
  ["02", "Learning from examples", "See data become predictions"],
  ["03", "Training & testing", "Measure what matters"],
  ["04", "Generalization", "Spot overfitting"],
  ["05", "Model judgment", "Make better decisions"],
];

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/" className="brand" aria-label="AI Quest home">
          <span className="brand-mark">✦</span>
          <span>AI Quest</span>
        </Link>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#path">The path</a>
          <Link href="/learn" className="button button-small">Start learning <span>→</span></Link>
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="pulse-dot" /> A hands-on AI curriculum for developers</div>
        <h1>Learn AI by <em>making it click.</em></h1>
        <p className="hero-copy">
          Short lessons, live experiments, and thoughtful challenges—built to turn AI concepts into practical intuition.
        </p>
        <div className="hero-actions">
          <Link href="/learn" className="button">Begin Chapter 01 <span>→</span></Link>
          <a href="#how-it-works" className="text-link">See how it works <span>↓</span></a>
        </div>
        <p className="save-note">No account needed. Your progress stays in this browser.</p>
      </section>

      <section className="constellation" aria-label="Learning route preview">
        <div className="constellation-label">CHAPTER 01 · HOW MACHINES LEARN</div>
        <div className="route-line" />
        {milestones.map(([number, title, note], index) => (
          <div className={`route-stop route-stop-${index + 1}`} key={number}>
            <div className={`route-orb ${index === 0 ? "active" : ""}`}>{index === 0 ? "✦" : number}</div>
            <div className="route-copy"><strong>{title}</strong><span>{note}</span></div>
          </div>
        ))}
      </section>

      <section className="how-section" id="how-it-works">
        <div>
          <p className="section-kicker">THE LEARNING LOOP</p>
          <h2>Read less.<br />Understand more.</h2>
        </div>
        <div className="loop-grid">
          <article><span>01</span><h3>Get the idea</h3><p>Plain-English explanations without hand-wavy shortcuts.</p></article>
          <article><span>02</span><h3>Try it yourself</h3><p>Change inputs, make predictions, and see the result unfold.</p></article>
          <article><span>03</span><h3>Prove it</h3><p>Master challenges before the next concept opens up.</p></article>
        </div>
      </section>

      <section className="path-section" id="path">
        <div className="path-card">
          <div><p className="section-kicker">YOUR FIRST QUEST</p><h2>How machines learn</h2><p>Five focused missions on data, predictions, training, and the biggest beginner trap: overfitting.</p></div>
          <Link href="/learn" className="button button-light">Explore Chapter 01 <span>→</span></Link>
        </div>
      </section>

      <footer><span>AI Quest <i>✦</i></span><span>Made for curious developers.</span></footer>
    </main>
  );
}
