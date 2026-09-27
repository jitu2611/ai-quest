"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { initialProgress, lessons, restoreProgress, STORAGE_KEY, trainingError, validationError } from "@/lib/curriculum";

export default function LearnPage() {
  const [progress, setProgress] = useState(initialProgress);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const [complexity, setComplexity] = useState(38);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setProgress(restoreProgress(localStorage.getItem(STORAGE_KEY))); }
      catch { setStorageError(true); }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch { const timer = window.setTimeout(() => setStorageError(true), 0); return () => clearTimeout(timer); }
  }, [loaded, progress]);

  const lesson = lessons[progress.active];
  const number = String(progress.active + 1).padStart(2, "0");
  const mastered = lesson.questions.filter(q => progress.checked[q.id] && progress.answers[q.id] === q.answer).length;
  const completed = progress.active < progress.completed;
  const percentage = Math.round(progress.completed / lessons.length * 100);
  function navigate(index: number) {
    if (index > progress.completed || index >= lessons.length) return;
    setProgress(p => ({ ...p, active: index })); setHints({});
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function restart() {
    const fresh = initialProgress();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); localStorage.removeItem("ai-quest-overfitting"); }
    catch { setStorageError(true); }
    setProgress(fresh); setHints({}); setComplexity(38); setResetting(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  if (!loaded) return <main className="lesson-main" aria-busy="true">Loading your chapter…</main>;

  return <div className="learn-shell">
    <header className="learn-header" inert={resetting}>
      <Link href="/" className="brand"><span className="brand-mark">✦</span><span>AI Quest</span></Link>
      <div className="chapter-progress"><span>CHAPTER 01</span><div className="progress-track" role="progressbar" aria-label="Chapter progress" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${percentage}%` }} /></div><b>{percentage}%</b></div>
      <button className="restart-button" onClick={() => setResetting(true)}>Start over</button>
    </header>
    {resetting && <div className="reset-panel" role="alertdialog" aria-modal="true" aria-labelledby="reset-title" onKeyDown={e => { if (e.key === "Escape") setResetting(false); if (e.key === "Tab") { const buttons = e.currentTarget.querySelectorAll("button"); const first = buttons[0], last = buttons[buttons.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } }}>
      <h2 id="reset-title">Restart Chapter 01?</h2><p>This clears all answers and milestones for this chapter on this browser.</p>
      <button autoFocus className="button" onClick={restart}>Reset chapter</button> <button className="restart-button" onClick={() => setResetting(false)}>Cancel</button>
    </div>}
    <div inert={resetting}>
    <aside className="curriculum" aria-label="Chapter lessons">
      <div className="curriculum-heading"><span>CHAPTER 01</span><strong>How machines learn</strong><small>{progress.completed} of 5 missions complete</small></div>
      <ol>{lessons.map((item, index) => <li key={item.title} className={index === progress.active ? "current" : index < progress.completed ? "complete" : "locked"}>
        <span className="lesson-state">{index < progress.completed ? "✓" : index === progress.active ? "✦" : "·"}</span>
        <button disabled={index > progress.completed} aria-current={index === progress.active ? "step" : undefined} onClick={() => navigate(index)}><small>MISSION {String(index + 1).padStart(2, "0")}</small><strong>{item.title}</strong></button>
      </li>)}</ol>
      <div className="save-status" role="status">{storageError ? "Storage unavailable — progress is temporary" : "● Progress saved in this browser"}</div>
    </aside>
    <main className="lesson-main">
      <div className="mobile-navigation"><label htmlFor="mission-select">Mission </label><select id="mission-select" value={progress.active} onChange={e => navigate(Number(e.target.value))}>{lessons.map((item, i) => <option key={item.title} value={i} disabled={i > progress.completed}>{i + 1}. {item.title}</option>)}</select><p>{progress.completed} of 5 complete · {storageError ? "Progress is temporary" : "Saved in this browser"}</p></div>
      <div className="lesson-breadcrumb"><Link href="/">AI QUEST</Link><span>/ CHAPTER 01 /</span><b>MISSION {number}</b></div>
      <div className="mission-heading"><div className="mission-number">{number}</div><div><p className="section-kicker">HOW MACHINES LEARN</p><h1>{lesson.title}</h1><p className="lesson-intro">{lesson.intro}</p></div></div>
      <section className="story-card"><div className="story-icon">↗</div><div><p className="section-kicker">A FAMILIAR SCENARIO</p><h2>{lesson.scenario}</h2><p>{lesson.example}</p></div></section>
      <section className="concept-section"><div className="section-title"><span>01</span><div><p className="section-kicker">THE IDEA</p><h2>{lesson.concept}</h2></div></div><div className="concept-copy">{lesson.paragraphs.map(p => <p key={p}>{p}</p>)}</div><div className="analogy"><div className="analogy-label">REAL-LIFE ANALOGY</div><p>{lesson.analogy}</p></div></section>
      {progress.active === 3 && <section className="experiment-section">
        <div className="section-title"><span>02</span><div><p className="section-kicker">TRY IT</p><h2>Give the model more freedom.</h2><p>Illustrative error curves, not a trained model. Use validation—not the final test set—to choose complexity.</p></div></div>
        <div className="lab-card"><div className="lab-top">ILLUSTRATIVE MODEL LAB</div><div className="chart-area">
          <svg viewBox="0 0 700 245" role="img" aria-label="Illustrative training and validation errors versus model complexity">
            <line x1="52" y1="18" x2="52" y2="205" className="axis" /><line x1="52" y1="205" x2="676" y2="205" className="axis" />
            {[trainingError, validationError].map((fn, i) => <path key={i} className={i === 0 ? "train-line" : "test-line"} d={Array.from({ length: 101 }, (_, x) => `${x ? "L" : "M"} ${52 + x * 6.24} ${205 - fn(x) * 7}`).join(" ")} />)}
            <line x1={52 + complexity * 6.24} x2={52 + complexity * 6.24} y1="18" y2="205" className="cursor-line" />
            {[trainingError, validationError].map((fn, i) => <circle key={i} cx={52 + complexity * 6.24} cy={205 - fn(complexity) * 7} r="5" fill={i ? "#f07159" : "#5aac8b"} />)}
            <text x="55" y="226">simple</text><text x="605" y="226">complex</text>
          </svg>
          <div className="legend"><span><i className="legend-train" />Training error <b>{trainingError(complexity).toFixed(1)}%</b></span><span><i className="legend-test" />Validation error <b>{validationError(complexity).toFixed(1)}%</b></span></div>
        </div><div className="slider-row"><label htmlFor="complexity">MODEL COMPLEXITY</label><input aria-label="Model complexity" id="complexity" type="range" min="0" max="100" value={complexity} onChange={e => setComplexity(Number(e.target.value))} /><span>{complexity}/100</span></div>
        <div className="lab-verdict" role="status">{complexity < 20 ? "Underfitting region: both errors are high. The model may be too simple." : complexity > 55 ? "Overfitting region: training error falls while validation error rises." : "Near the best validation region: balance fit with generalization."}</div></div>
      </section>}
      <section className="challenge-section"><div className="section-title"><span>{progress.active === 3 ? "03" : "02"}</span><div><p className="section-kicker">CHECKPOINT</p><h2>Put your understanding to the test.</h2><p>Master all three questions. Mistakes cost nothing.</p></div></div>
        <div className="questions">{lesson.questions.map((question, index) => {
          const selected = progress.answers[question.id], checked = progress.checked[question.id], correct = checked && selected === question.answer;
          return <article className={`question-card ${checked ? correct ? "correct" : "incorrect" : ""}`} key={question.id}>
            <div className="question-top"><span>QUESTION {index + 1}</span>{correct && <b>✓ MASTERED</b>}</div><h3>{question.prompt}</h3>
            <div className="options" role="group" aria-label={question.prompt}>{question.options.map((option, i) => <button key={option} disabled={checked} aria-pressed={selected === i} className={selected === i ? "selected" : ""} onClick={() => setProgress(p => ({ ...p, answers: { ...p.answers, [question.id]: i } }))}><i aria-hidden="true">{String.fromCharCode(65 + i)}</i>{option}</button>)}</div>
            {!checked ? <div className="question-actions"><button className="hint-button" aria-expanded={!!hints[question.id]} onClick={() => setHints(h => ({ ...h, [question.id]: !h[question.id] }))}>{hints[question.id] ? "Hide hint" : "Need a hint?"}</button><button className="check-button" disabled={selected === undefined} onClick={() => setProgress(p => ({ ...p, checked: { ...p.checked, [question.id]: true } }))}>Check answer →</button></div> : <div className="feedback" role="status"><p>{correct ? question.explanation : `Not quite. ${question.hint}`}</p>{!correct && <button onClick={() => setProgress(p => { const answers = { ...p.answers }; delete answers[question.id]; return { ...p, answers, checked: { ...p.checked, [question.id]: false } }; })}>Try again</button>}</div>}
            {!checked && hints[question.id] && <p className="hint">{question.hint}</p>}
          </article>;
        })}</div>
        <div className="unlock-card"><div><span>{mastered}/3</span><div><p className="section-kicker">{completed ? "MISSION COMPLETE" : "MASTERY CHECK"}</p><h3>{completed ? progress.completed === 5 && progress.active === 4 ? "Chapter complete!" : "Ready for the next mission." : "Get every core question right."}</h3><p>{progress.completed === 5 && progress.active === 4 ? "You learned the fundamentals. Review any mission, or start over for a fresh attempt." : "Unlimited attempts. Your milestones stay earned."}</p></div></div>
          {!completed ? <button className="button" disabled={mastered !== lesson.questions.length} onClick={() => { if (mastered === lesson.questions.length) setProgress(p => ({ ...p, completed: Math.max(p.completed, p.active + 1) })); }}>{progress.active === 4 ? "Complete chapter" : "Complete mission"} →</button> : progress.active < 4 ? <button className="button" onClick={() => navigate(progress.active + 1)}>Continue to Mission {String(progress.active + 2).padStart(2, "0")} →</button> : <Link className="button" href="/">Back to home →</Link>}
        </div>
      </section>
    </main></div>
  </div>;
}
