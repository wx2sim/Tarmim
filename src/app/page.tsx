"use client";

import React, { useState, useEffect } from 'react';

import Nav from './components/Nav';

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
        <Nav />
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
                  <span className="mute" style={{ color: '#ddd0f0' }}>Done this week</span>
                </div>
              </div>
              <div className="box">
                <div className="r">
                  <span className="ic">✖</span>
                  <span className="chip" style={{ background: '#f5d9f7', color: '#8b3a8e' }}>-1.2%</span>
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
            <svg viewBox="0 0 220 120" width="100%" role="img" aria-label="Weekly completion trend" style={{ marginTop: '8px' }}>
              <g stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3">
                <line x1="10" x2="10" y1="20" y2="90" />
                <line x1="43" x2="43" y1="20" y2="90" />
                <line x1="76" x2="76" y1="20" y2="90" />
                <line x1="110" x2="110" y1="20" y2="90" />
                <line x1="143" x2="143" y1="20" y2="90" />
                <line x1="176" x2="176" y1="20" y2="90" />
                <line x1="210" x2="210" y1="20" y2="90" />
              </g>
              <g stroke="var(--grey)" strokeWidth="1">
                <line x1="0" x2="220" y1="20" y2="20" />
                <line x1="0" x2="220" y1="55" y2="55" />
                <line x1="0" x2="220" y1="90" y2="90" />
              </g>
              <polyline fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinejoin="round" points="10,70 43,55 76,62 110,40 143,48 176,30 210,38" />
              <circle cx="110" cy="40" r="5" fill="var(--panel)" stroke="var(--teal)" strokeWidth="2.5" />
              <rect x="88" y="4" width="44" height="18" rx="9" fill="var(--ink)" />
              <text x="110" y="17" fill="var(--bg)" fontSize="10" textAnchor="middle" fontWeight="bold">Thu 83%</text>
              <g fill="var(--mute)" fontSize="10" textAnchor="middle" fontWeight="600">
                <text x="10" y="110">M</text>
                <text x="43" y="110">T</text>
                <text x="76" y="110">W</text>
                <text x="110" y="110">T</text>
                <text x="143" y="110">F</text>
                <text x="176" y="110">S</text>
                <text x="210" y="110">S</text>
              </g>
            </svg>
          </div>
          <div className="card span2">
            <div className="mute">Performance</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
              <div>
                <h3>Consistency Tracking</h3>
              </div>
              <div className="mute" style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teal)' }}></span> Today's Consistency
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--mint)' }}></span> Monthly Consistency
                </span>
              </div>
            </div>
            
            <div style={{ position: 'relative', height: '140px', width: '100%' }}>
              <svg viewBox="0 0 400 120" width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area-teal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="var(--teal)" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="area-mint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--mint)" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="var(--mint)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <g stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="10" x2="10" y1="0" y2="100" />
                  <line x1="73" x2="73" y1="0" y2="100" />
                  <line x1="136" x2="136" y1="0" y2="100" />
                  <line x1="200" x2="200" y1="0" y2="100" />
                  <line x1="263" x2="263" y1="0" y2="100" />
                  <line x1="326" x2="326" y1="0" y2="100" />
                  <line x1="390" x2="390" y1="0" y2="100" />
                </g>
                <g stroke="var(--grey)" strokeWidth="1">
                  <line x1="0" x2="400" y1="50" y2="50" />
                  <line x1="0" x2="400" y1="100" y2="100" />
                </g>
                
                {/* Monthly Consistency Area & Curve */}
                <path d="M 10 70 C 40 70, 40 40, 73 30 C 100 20, 100 60, 136 60 C 170 60, 170 30, 200 40 C 230 50, 230 90, 263 80 C 290 70, 290 40, 326 50 C 360 60, 360 20, 390 10 L 390 100 L 10 100 Z" fill="url(#area-mint)" />
                <path d="M 10 70 C 40 70, 40 40, 73 30 C 100 20, 100 60, 136 60 C 170 60, 170 30, 200 40 C 230 50, 230 90, 263 80 C 290 70, 290 40, 326 50 C 360 60, 360 20, 390 10" fill="none" stroke="var(--mint)" strokeWidth="2.5" />
                
                {/* Today's Consistency Area & Curve */}
                <path d="M 10 40 C 40 40, 40 10, 73 20 C 100 30, 100 70, 136 80 C 170 90, 170 30, 200 20 C 230 10, 230 50, 263 60 C 290 70, 290 90, 326 80 C 360 70, 360 30, 390 20 L 390 100 L 10 100 Z" fill="url(#area-teal)" />
                <path d="M 10 40 C 40 40, 40 10, 73 20 C 100 30, 100 70, 136 80 C 170 90, 170 30, 200 20 C 230 10, 230 50, 263 60 C 290 70, 290 90, 326 80 C 360 70, 360 30, 390 20" fill="none" stroke="var(--teal)" strokeWidth="3" />
                
                <circle cx="390" cy="20" r="5" fill="var(--panel)" stroke="var(--teal)" strokeWidth="2.5" />
                <circle cx="390" cy="10" r="4" fill="var(--panel)" stroke="var(--mint)" strokeWidth="2" />
                
                <g fill="var(--mute)" fontSize="11" textAnchor="middle" fontWeight="500">
                  <text x="10" y="118">W1</text>
                  <text x="136" y="118">W2</text>
                  <text x="263" y="118">W3</text>
                  <text x="390" y="118">W4</text>
                </g>
              </svg>
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
        <div className="streak-card">
          <div className="streak-head">
            <span className="streak-flame">🔥</span>
            <div>
              <b className="streak-count">12</b>
              <span className="streak-label">day streak</span>
            </div>
          </div>
          <div className="streak-week">
            {(() => {
              const today = new Date();
              const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0
              const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
              return labels.map((label, i) => {
                const isPast = i < dayOfWeek;
                const isToday = i === dayOfWeek;
                const isFuture = i > dayOfWeek;
                const isActive = isPast || (isToday && d > 0);
                return (
                  <div key={i} className={`streak-day ${isActive ? 'active' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}>
                    <div className="streak-circle">
                      {isActive ? '🔥' : isFuture ? '' : (isToday ? '🔥' : '❄️')}
                    </div>
                    <span>{label}</span>
                  </div>
                );
              });
            })()}
          </div>
          <div className="streak-msg">
            {d > 0 ? 'Great job today! Keep it going 💪' : 'Complete a habit to keep your streak! 🏃'}
          </div>
        </div>
      </aside>
    </div>
  );
}
