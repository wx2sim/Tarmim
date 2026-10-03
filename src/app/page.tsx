"use client";

import React, { useState, useEffect } from 'react';

const CATS: Record<string, string> = { Health: 'var(--mint)', Mind: 'var(--teal)', Focus: 'var(--grey)' };
const EMO: Record<string, string> = { Health: '💧', Mind: '🧘', Focus: '🎯' };
const hist = [3, 4, 5, 4, 6, 5, 3, 4, 4, 5, 6, 5, 4, 3, 5, 6, 6, 4, 5, 5, 3, 4, 5, 6, 5, 4, 5, 6, 5, 0];

type Habit = {
  id: number;
  name: string;
  cat: string;
  done: boolean;
};

const initialHabits: Habit[] = [
  { id: 1, name: 'Drink 2L water', cat: 'Health', done: true },
  { id: 2, name: 'Morning walk', cat: 'Health', done: true },
  { id: 3, name: 'Read 20 pages', cat: 'Mind', done: false },
  { id: 4, name: 'Deep work 90 min', cat: 'Focus', done: false },
  { id: 5, name: 'Meditate', cat: 'Mind', done: false },
  { id: 6, name: 'Plan tomorrow', cat: 'Focus', done: false }
];

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    const today = new Date().toDateString();
    let loaded = initialHabits;
    try {
      const s = JSON.parse(localStorage.getItem('habits-v1') || 'null');
      if (s && s.day === today) {
        loaded = s.habits;
      } else if (s) {
        loaded = s.habits.map((h: Habit) => ({ ...h, done: false }));
      }
    } catch (e) {}
    setHabits(loaded);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const today = new Date().toDateString();
      try {
        localStorage.setItem('habits-v1', JSON.stringify({ day: today, habits }));
      } catch (e) {}
    }
  }, [habits, mounted]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => (h.id === id ? { ...h, done: !h.done } : h)));
  };

  const addHabit = () => {
    const v = newHabit.trim();
    if (!v) return;
    const cats = Object.keys(CATS);
    const newH: Habit = {
      id: Date.now(),
      name: v,
      cat: cats[habits.length % 3],
      done: false
    };
    setHabits([...habits, newH]);
    setNewHabit('');
  };

  const toggleTheme = () => {
    const r = document.documentElement;
    const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
    r.dataset.theme = dark ? 'light' : 'dark';
  };

  if (!mounted) return null;

  const n = habits.length;
  const d = habits.filter(h => h.done).length;
  const pct = n ? Math.round((d / n) * 100) : 0;
  
  const h30 = hist.slice(0, 29).concat([d]);
  const avg = (h30.reduce((a, b) => a + b, 0) / 30).toFixed(1);

  // Generate around 14 weeks (98 days) to fill the github graph beautifully.
  // Using the hist array and duplicating it to simulate past data.
  const fullHist = [...hist, ...hist, ...hist, ...hist.slice(0, 8)].concat([d]);

  const C = 2 * Math.PI * 80;
  const half = C / 2;
  const counts = Object.keys(CATS).map(k => [k, habits.filter(h => h.cat === k).length] as [string, number]);
  let off = 0;
  const gaugeCircles = counts.map(([k, c]) => {
    const l = n ? (c / n) * half : 0;
    const s = (
      <circle
        key={k}
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke={CATS[k]}
        strokeWidth="26"
        strokeDasharray={`${Math.max(l - 3, 0)} ${C}`}
        strokeDashoffset={-off}
      />
    );
    off += l;
    return s;
  });

  const on = Math.round((pct / 100) * 24);
  const bars = Array.from({ length: 24 }, (_, i) => (
    <i key={i} className={i < on ? '' : 'x'}></i>
  ));

  const w = Math.round(((hist.slice(23, 29).reduce((a, b) => a + b, 0) + d) / (7 * Math.max(n, 1))) * 100);

  const now = new Date();
  const hr = now.getHours();
  const hello = (hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening') + ', Wass';

  const mon = new Date(now);
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const f = (date: Date) => date.toLocaleDateString('en', { day: 'numeric', month: 'short' });
  const range = '📅 ' + f(mon) + ' – ' + f(sun);

  return (
    <div className="app">
      <main>
        <nav>
          <div className="logo">✿</div>
          <button className="pill on">Dashboard</button>
          <button className="pill">Calendar</button>
          <button className="pill">Habits</button>
          <button className="pill">Stats</button>
          <button className="pill">Settings</button>
        </nav>
        <div className="head">
          <div>
            <div className="crumb">Home › Dashboard</div>
            <h1>{hello}</h1>
          </div>
          <div className="acts">
            <button className="btn" onClick={() => { setIsAdding(!isAdding); }}>＋ Add habit</button>
            <button className="btn">{range}</button>
            <button className="btn g">Weekly report</button>
          </div>
        </div>
        <div className="grid">
          <div className="card prof">
            <div className="big">W</div>
            <div className="tag">12-day streak 🔥</div>
            <div className="who">
              <div><b>Wass</b><small>Level 4 · Consistent</small></div>
              <div>
                <button className="sq" aria-label="Notes">✎</button>
                <button className="sq" aria-label="Share">⇪</button>
              </div>
            </div>
          </div>
          <div className="card span2 stat">
            <div>
              <div className="ic">⏳</div>
              <div style={{ marginTop: 8 }}>
                <span className="num">{avg}</span> <span className="chip">+0.5%</span>
              </div>
              <div className="mute">avg habits done / day</div>
              <div className="github-graph">
                {fullHist.map((v, i) => (
                  <i key={i} className={`l${v > 0 ? Math.min(Math.ceil(v / 1.5), 4) : 0}`}></i>
                ))}
              </div>
              <div className="mute">1 habit &nbsp;■■■■&nbsp; 6 habits · last 30 days</div>
            </div>
            <div className="teal">
              <div>
                <div className="r">
                  <span className="ic" style={{ background: '#ffffff33' }}>✔</span>
                  <span className="chip">+2.6%</span>
                </div>
                <div className="r" style={{ marginTop: 8 }}>
                  <b>{w}%</b>
                  <span className="mute" style={{ color: '#d7e6ee' }}>Done this week</span>
                </div>
              </div>
              <div className="box">
                <div className="r">
                  <span className="ic">✖</span>
                  <span className="chip" style={{ background: '#fbd9d7' }}>-1.2%</span>
                </div>
                <div className="r" style={{ marginTop: 8 }}>
                  <b>{100 - w}%</b>
                  <span className="mute">Missed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="mute">Average completion</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '4px 0 6px' }}>
              <b style={{ fontSize: 20, fontWeight: 600 }}>{w}%</b>
              <span className="chip">+0.5%</span>
            </div>
            <svg viewBox="0 0 220 110" width="100%" role="img" aria-label="Weekly completion trend">
              <g stroke="var(--grey)" strokeWidth="1">
                <line x1="0" x2="220" y1="20" y2="20" />
                <line x1="0" x2="220" y1="55" y2="55" />
                <line x1="0" x2="220" y1="90" y2="90" />
              </g>
              <polyline fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinejoin="round" points="5,70 40,55 75,62 110,40 145,48 180,30 215,38" />
              <circle cx="110" cy="40" r="6" fill="var(--panel)" stroke="var(--teal)" strokeWidth="2.5" />
              <rect x="88" y="52" width="44" height="18" rx="9" fill="#0c1418" />
              <text x="110" y="65" fill="#fff" fontSize="10" textAnchor="middle">Thu 83%</text>
            </svg>
            <div className="mute">Mon · Tue · Wed · Thu · Fri · Sat · Sun</div>
          </div>
          <div className="card">
            <div className="mute">Total habits</div>
            <h3>Track your habits</h3>
            <div className="gauge">
              <svg viewBox="0 0 200 108" width="100%" role="img" aria-label="Habits by category">
                <g transform="rotate(-180 100 100)">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="var(--grey)" strokeWidth="26" strokeDasharray={`${half} ${C}`} />
                  {gaugeCircles}
                </g>
              </svg>
              <div className="c">
                <span>{n}</span>
                <small>Total habits</small>
              </div>
            </div>
            <div className="legend" style={{ marginTop: 12 }}>
              {counts.map(([k, c]) => (
                <div key={k}>
                  <span className="d" style={{ background: CATS[k] }}></span>
                  {k}<b>{c}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="mute">This week</div>
            <h3>Consistency</h3>
            <div className="bars">{bars}</div>
            <div className="mute" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>■ Done</span>
              <span>■ Not done</span>
            </div>
          </div>
        </div>
      </main>
      <aside className="side">
        <div className="top">
          <div className="search">🔍 Search…</div>
          <button className="pill" onClick={toggleTheme} aria-label="Toggle theme">◐</button>
          <div className="av">W</div>
        </div>
        <div>
          <div className="mute">Daily check-in</div>
          <h2>Today's habits</h2>
        </div>
        <div className={`add ${isAdding ? 'on' : ''}`}>
          <input 
            placeholder="New habit name" 
            maxLength={40} 
            aria-label="New habit name"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          />
          <button className="btn g" onClick={addHabit}>Add</button>
        </div>
        <div className="list">
          {habits.map(h => (
            <button 
              key={h.id} 
              className={`row ${h.done ? 'done' : ''}`} 
              onClick={() => toggleHabit(h.id)} 
              aria-pressed={h.done}
            >
              <span className="ic">{EMO[h.cat]}</span>
              <span>
                <p>{h.name}</p>
                <small>{h.cat}</small>
              </span>
              <span className="st">{h.done ? 'Done' : 'Pending'}</span>
            </button>
          ))}
        </div>
        <div className="score">
          <div className="opt w">
            <span>Done</span>
            <span>{d}</span>
          </div>
          <div className="opt">
            <span>Left</span>
            <span>{n - d}</span>
          </div>
          <div className="opt">
            <span>Streak</span>
            <span>12 days</span>
          </div>
          <div className="big">
            <span className="mute" style={{ color: '#d7e6ee' }}>Today's score</span>
            <b>{pct}%</b>
          </div>
        </div>
      </aside>
    </div>
  );
}
