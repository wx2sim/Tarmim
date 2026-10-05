"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [dailyNote, setDailyNote] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  /* ─── Duolingo-style Streak & Gems State ─── */
  const [streakCount, setStreakCount] = useState(12);
  const [gems, setGems] = useState(450);
  const [streakFreezes, setStreakFreezes] = useState(2);
  const [isStreakBroken, setIsStreakBroken] = useState(false);

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

      const streakSaved = localStorage.getItem('tarmim_streak_data');
      if (streakSaved) {
        const sd = JSON.parse(streakSaved);
        if (sd.streakCount !== undefined) setStreakCount(sd.streakCount);
        if (sd.gems !== undefined) setGems(sd.gems);
        if (sd.streakFreezes !== undefined) setStreakFreezes(sd.streakFreezes);
      }
    } catch (e) { }
    setHabits(loaded);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const today = new Date().toDateString();
      try {
        localStorage.setItem('habits-v1', JSON.stringify({ day: today, habits }));
        localStorage.setItem('tarmim_streak_data', JSON.stringify({ streakCount, gems, streakFreezes }));
      } catch (e) { }
    }
  }, [habits, streakCount, gems, streakFreezes, mounted]);

  const toggleHabit = (id: number) => {
    const target = habits.find(h => h.id === id);
    const nowDone = !target?.done;

    if (nowDone) {
      setGems(prev => prev + 25);
      showToast('💎 +25 Gems earned for completing habit!');
    }

    setHabits(habits.map(h => (h.id === id ? { ...h, done: nowDone } : h)));
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShareProgress = () => {
    const text = `🔥 ${streakCount}-day streak on Tarmim! Completed ${d}/${n} habits today (${pct}%).`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast('📋 Progress summary copied to clipboard!');
  };

  const handleBuyFreeze = () => {
    if (gems < 200) {
      showToast('❌ Not enough Gems! You need 200 💎 to buy a Streak Freeze.');
      return;
    }
    setGems(prev => prev - 200);
    setStreakFreezes(prev => prev + 1);
    showToast('🛡️ Streak Freeze equipped! Your streak is protected.');
  };

  const handleRepairStreak = () => {
    if (gems < 100) {
      showToast('❌ Not enough Gems! You need 100 💎 for Streak Repair.');
      return;
    }
    setGems(prev => prev - 100);
    setIsStreakBroken(false);
    setStreakCount(14); // Restores streak
    showToast('🛠️ Streak Repaired! Flame restored 🔥');
  };

  if (!mounted) return null;

  const n = habits.length;
  const d = habits.filter(h => h.done).length;
  const pct = n ? Math.round((d / n) * 100) : 0;

  // Move checked habits to the bottom of the list
  const sortedHabits = [...habits].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  const h30 = hist.slice(0, 29).concat([d]);
  const avg = (h30.reduce((a, b) => a + b, 0) / 30).toFixed(1);

  const fullHist = [...hist, ...hist, ...hist, ...hist.slice(0, 8)].concat([d]);

  const C = 2 * Math.PI * 80;
  const half = C / 2;
  const counts = Object.keys(CATS).map(k => [k, habits.filter(h => h.cat === k).length] as [string, number]);
  let off = 0;
  const gaugeCircles = counts.map(([k, c]) => {
    const frac = n ? c / n : 0;
    const len = frac * half;
    const circle = (
      <circle
        key={k}
        cx="100" cy="100" r="80"
        fill="none"
        stroke={CATS[k]}
        strokeWidth="18"
        strokeDasharray={`${len} ${C - len}`}
        strokeDashoffset={-off}
        transform="rotate(-90 100 100)"
      />
    );
    off += len;
    return circle;
  });

  const now = new Date();
  const hr = now.getHours();
  const hello = (hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening') + ', Wass';

  const mon = new Date(now);
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const f = (date: Date) => date.toLocaleDateString('en', { day: 'numeric', month: 'short' });
  const range = '📅 ' + f(mon) + ' – ' + f(sun);

  /* Loss Aversion Dynamic Widget Message */
  const getStreakMessage = () => {
    if (isStreakBroken) {
      return {
        text: '💔 Oh no! Your streak was broken yesterday. Use Streak Repair to restore it!',
        type: 'broken'
      };
    }
    if (d > 0) {
      return {
        text: `🔥 Streak Active! You've protected your ${streakCount}-day streak today!`,
        type: 'protected'
      };
    }
    if (hr >= 18) {
      return {
        text: `⚠️ URGENT WARNING! 11:59 PM deadline approaching! Complete a habit now to save your ${streakCount}-day streak! 🔥`,
        type: 'urgent'
      };
    }
    return {
      text: `Complete at least 1 habit before midnight to keep your ${streakCount}-day flame burning! 💪`,
      type: 'normal'
    };
  };

  const streakStatus = getStreakMessage();

  return (
    <div className="app">
      <main>
        <div className="head">
          <div>
            <div className="crumb">Home › Dashboard</div>
            <h1>{hello}</h1>
          </div>
          <div className="acts">

            <button className="btn">{range}</button>
            <button className="btn g" onClick={() => setShowShopModal(true)}>
              💎 {gems} Gems & Shop
            </button>
          </div>
        </div>

        <div className="grid">
          <Link
            href="/habits"
            className="card prof prof-clickable"
            style={{ textDecoration: 'none' }}
            title="Click to manage & check off your habits!"
          >
            <div className="big">
              <div className="prof-photo" role="img" aria-label="Wassim profile photo" />
              <span className="prof-quick-badge">✅ Check Habits ({d}/{n})</span>
            </div>
            <div className={`tag ${d > 0 ? 'flame-active' : hr >= 18 ? 'flame-urgent' : ''}`}>
              {streakCount}-day streak {d > 0 ? '🔥' : streakFreezes > 0 ? '🛡️' : '🖤'}
            </div>
            <div className="who">
              <div>
                <b>Wass</b>
                <small>Level 4 · Consistent (Go to Habits →)</small>
              </div>
              <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.preventDefault()}>
                <button className="sq" aria-label="Notes" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowNoteModal(true); }} title="Add today's note">✎</button>
                <button className="sq" aria-label="Share" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShareProgress(); }} title="Share progress summary">⇪</button>
              </div>
            </div>
          </Link>

          {/* ── Daily Average + Activity Heatmap ── */}
          <div className="card stat-heatmap-card">
            <div className="stat-heatmap-header">
              <div className="stat-heatmap-left">
                <div className="ic">⏳</div>
                <div>
                  <div className="stat-heatmap-value">
                    <span className="num">{avg}</span>
                    <span className="chip">+0.5%</span>
                  </div>
                  <div className="mute">avg habits done / day</div>
                </div>
              </div>
              <div className="mute" style={{ fontSize: 11 }}>Last 30 days</div>
            </div>

            <div className="heatmap-calendar">
              {h30.map((v, i) => {
                const day = new Date();
                day.setDate(day.getDate() - 29 + i);
                const lvl = v > 0 ? Math.min(Math.ceil(v / 1.5), 4) : 0;
                return (
                  <div
                    key={i}
                    className={`heatmap-cell hl${lvl}`}
                    title={`${day.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}: ${v} habit${v !== 1 ? 's' : ''}`}
                  >
                    <span className="heatmap-day">{day.getDate()}</span>
                  </div>
                );
              })}
            </div>

            <div className="heatmap-legend">
              <span className="mute">Less</span>
              <div className="heatmap-cell hl0" />
              <div className="heatmap-cell hl1" />
              <div className="heatmap-cell hl2" />
              <div className="heatmap-cell hl3" />
              <div className="heatmap-cell hl4" />
              <span className="mute">More</span>
            </div>
          </div>

          {/* ── Today's Completion Ring ── */}
          <div className="card today-completion-card">
            <div className="today-completion-header">
              <div className="ic" style={{ background: 'var(--mint-s)' }}>✔</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Today&apos;s Progress</div>
                <div className="mute">{d} of {n} habits done</div>
              </div>
              <span className="chip" style={{ marginLeft: 'auto' }}>+2.6%</span>
            </div>

            <div className="today-ring-wrap">
              <svg viewBox="0 0 120 120" className="today-ring-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--grey)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="var(--teal)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 2 * Math.PI * 50} ${2 * Math.PI * 50}`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
              </svg>
              <div className="today-ring-label">
                <span className="today-ring-pct">{pct}%</span>
              </div>
            </div>

            <div className="today-habits-bar">
              {habits.map(h => (
                <div
                  key={h.id}
                  className={`today-habit-dot ${h.done ? 'done' : ''}`}
                  title={`${h.name} – ${h.done ? 'Done' : 'Pending'}`}
                />
              ))}
            </div>
            <div className="today-habits-bar-legend">
              <span className="mute"><span className="today-habit-dot done" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} /> Done</span>
              <span className="mute"><span className="today-habit-dot" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} /> Pending</span>
            </div>
          </div>



          <div className="card">
            <div className="mute">Average completion</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '4px 0 6px' }}>
              <b style={{ fontSize: 20, fontWeight: 600 }}>{pct}%</b>
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
                    <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="area-mint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--mint)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--mint)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="0" x2="400" y1="10" y2="10" />
                  <line x1="0" x2="400" y1="50" y2="50" />
                  <line x1="0" x2="400" y1="100" y2="100" />
                </g>

                <path d="M 10 70 C 40 70, 40 40, 73 30 C 100 20, 100 60, 136 60 C 170 60, 170 30, 200 40 C 230 50, 230 90, 263 80 C 290 70, 290 40, 326 50 C 360 60, 360 20, 390 10 L 390 100 L 10 100 Z" fill="url(#area-mint)" />
                <path d="M 10 70 C 40 70, 40 40, 73 30 C 100 20, 100 60, 136 60 C 170 60, 170 30, 200 40 C 230 50, 230 90, 263 80 C 290 70, 290 40, 326 50 C 360 60, 360 20, 390 10" fill="none" stroke="var(--mint)" strokeWidth="2.5" />

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
        </div>
        <div className="list">
          {sortedHabits.map(h => (
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

        {/* ─── Duolingo-style Loss Aversion Streak Card ─── */}
        <div className={`streak-card ${streakStatus.type}`}>
          <div className="streak-head">
            <span className={`streak-flame ${d > 0 ? 'flame-glowing' : streakStatus.type === 'urgent' ? 'flame-pulsing' : ''}`}>
              {d > 0 ? '🔥' : streakFreezes > 0 ? '🛡️' : '🖤'}
            </span>
            <div>
              <b className="streak-count">{streakCount}</b>
              <span className="streak-label">day streak</span>
            </div>
            <button className="streak-shop-btn" onClick={() => setShowShopModal(true)}>
              🛡️ {streakFreezes}
            </button>
          </div>

          <div className="streak-week">
            {(() => {
              const dayOfWeek = (now.getDay() + 6) % 7; // Mon=0
              const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
              return labels.map((label, i) => {
                const isPast = i < dayOfWeek;
                const isToday = i === dayOfWeek;
                const isFuture = i > dayOfWeek;
                const isActive = isPast || (isToday && d > 0);
                return (
                  <div key={i} className={`streak-day ${isActive ? 'active' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}>
                    <div className="streak-circle">
                      {isActive ? '🔥' : isFuture ? '' : (isToday ? '🔥' : streakFreezes > 0 ? '🛡️' : '🖤')}
                    </div>
                    <span>{label}</span>
                  </div>
                );
              });
            })()}
          </div>

          <div className="streak-msg-banner">
            {streakStatus.text}
          </div>

          <div className="streak-gems-row">
            <span>💎 <b>{gems}</b> Gems Balance</span>
            <button className="streak-shop-link" onClick={() => setShowShopModal(true)}>
              Streak Shop 🛍️
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Duolingo-style Streak & Gems Shop Modal ─── */}
      {showShopModal && (
        <div className="modal-backdrop" onClick={() => setShowShopModal(false)}>
          <div className="modal-content shop-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>🛍️ Streak Protection Shop</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--mute)' }}>
                  Protect your hard-earned streak and recover broken flames
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowShopModal(false)}>✕</button>
            </div>

            <div className="shop-balance-card">
              <div>
                <span className="shop-balance-label">Gems Balance</span>
                <div className="shop-balance-val">💎 {gems}</div>
              </div>
              <div className="shop-equipped-badge">
                🛡️ {streakFreezes} Freezes Equipped
              </div>
            </div>

            <div className="shop-items-grid">
              {/* Item 1: Streak Freeze */}
              <div className="shop-item-card">
                <div className="shop-item-icon">🛡️ ❄️</div>
                <div className="shop-item-info">
                  <h4>Streak Freeze</h4>
                  <p>Insurance to automatically protect your streak if you miss a day.</p>
                  <div className="shop-item-price">💎 200 Gems</div>
                </div>
                <button className="btn g" onClick={handleBuyFreeze}>
                  Buy Freeze
                </button>
              </div>

              {/* Item 2: Streak Repair */}
              <div className="shop-item-card">
                <div className="shop-item-icon">🛠️ 🔥</div>
                <div className="shop-item-info">
                  <h4>Streak Repair</h4>
                  <p>Restore a streak that was recently lost or broken.</p>
                  <div className="shop-item-price">💎 100 Gems</div>
                </div>
                <button className="btn" onClick={handleRepairStreak} disabled={!isStreakBroken}>
                  {isStreakBroken ? 'Repair Streak' : 'Streak Intact'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn" onClick={() => setShowShopModal(false)}>
                Close Shop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Fast Daily Check-In Modal ─── */}
      {showCheckInModal && (
        <div className="modal-backdrop" onClick={() => setShowCheckInModal(false)}>
          <div className="modal-content fast-checkin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>⚡ Fast Daily Check-In</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--mute)' }}>
                  Validate your habits in one click • {d}/{n} completed ({pct}%)
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowCheckInModal(false)}>✕</button>
            </div>

            <div style={{ margin: '14px 0 20px', background: 'var(--card)', padding: '12px 16px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                <span>Today's Progress</span>
                <span style={{ color: 'var(--mint)' }}>{pct}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--teal), var(--mint))', transition: 'width 0.3s ease' }} />
              </div>
            </div>

            <div className="fast-checkin-list">
              {sortedHabits.map(h => (
                <div
                  key={h.id}
                  className={`fast-checkin-row ${h.done ? 'done' : ''}`}
                  onClick={() => toggleHabit(h.id)}
                >
                  <div className="fast-checkin-info">
                    <span className="fast-checkin-emoji">{EMO[h.cat]}</span>
                    <div>
                      <div className="fast-checkin-title">{h.name}</div>
                      <span className="fast-checkin-cat">{h.cat}</span>
                    </div>
                  </div>

                  <button
                    className={`fast-checkin-btn ${h.done ? 'checked' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleHabit(h.id); }}
                  >
                    {h.done ? '✔ Done' : '○ Check'}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--mute)' }}>🔥 {streakCount}-day streak active</span>
              <button className="btn g" onClick={() => setShowCheckInModal(false)}>
                Done Checking In ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Today's Quick Note Modal ─── */}
      {showNoteModal && (
        <div className="modal-backdrop" onClick={() => setShowNoteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>📝 Today's Reflection & Note</h3>
              <button className="modal-close" onClick={() => setShowNoteModal(false)}>✕</button>
            </div>
            <div style={{ margin: '14px 0' }}>
              <textarea
                className="settings-input settings-textarea"
                rows={4}
                placeholder="Write a quick note about your day, wins, or reflections..."
                value={dailyNote}
                onChange={e => setDailyNote(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn" onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button
                className="btn g"
                onClick={() => {
                  setShowNoteModal(false);
                  showToast('📝 Note saved successfully!');
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="settings-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
