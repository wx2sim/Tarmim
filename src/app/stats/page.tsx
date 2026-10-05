"use client";

import React, { useState } from 'react';

/* ─── Simulated data ─── */
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CATEGORIES = [
  { id: 'sport', emoji: '🏋️', name: 'Sport', color: '#e06070', done: 42, total: 60 },
  { id: 'hydration', emoji: '💧', name: 'Hydration', color: '#5bc0de', done: 55, total: 60 },
  { id: 'learn', emoji: '📚', name: 'Learn', color: '#4b9fc7', done: 38, total: 60 },
  { id: 'sleep', emoji: '💤', name: 'Sleep', color: '#7c5cbf', done: 50, total: 60 },
  { id: 'mindfulness', emoji: '🧘', name: 'Mindfulness', color: '#9b7dd4', done: 28, total: 60 },
  { id: 'nutrition', emoji: '🥗', name: 'Nutrition', color: '#6cc770', done: 45, total: 60 },
  { id: 'movement', emoji: '🚶', name: 'Movement', color: '#e8a74e', done: 35, total: 60 },
];

const weeklyData = [
  { day: 'Mon', done: 5, total: 6 },
  { day: 'Tue', done: 4, total: 6 },
  { day: 'Wed', done: 6, total: 6 },
  { day: 'Thu', done: 3, total: 6 },
  { day: 'Fri', done: 5, total: 6 },
  { day: 'Sat', done: 2, total: 6 },
  { day: 'Sun', done: 4, total: 6 },
];

const monthlyTrend = [72, 68, 75, 80, 78, 85, 82, 88, 90, 86, 91, 88];

const bestHabits = [
  { name: 'Drink water', emoji: '💧', rate: 92, streak: 24 },
  { name: 'Sleep 8h', emoji: '💤', rate: 83, streak: 18 },
  { name: 'Gym', emoji: '🏋️', rate: 70, streak: 12 },
  { name: 'Meditation', emoji: '🧘', rate: 47, streak: 5 },
  { name: 'Read 20 pages', emoji: '📖', rate: 63, streak: 8 },
];

const streakHistory = [3, 5, 2, 7, 12, 4, 8, 15, 10, 6, 18, 24];

type Period = 'week' | 'month' | 'year';

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>('month');

  const totalDone = CATEGORIES.reduce((a, c) => a + c.done, 0);
  const totalAll = CATEGORIES.reduce((a, c) => a + c.total, 0);
  const overallRate = Math.round((totalDone / totalAll) * 100);

  /* ─── Build smooth path helper ─── */
  const buildSmooth = (pts: [number, number][]) => {
    if (pts.length < 2) return '';
    let p = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp = (pts[i + 1][0] - pts[i][0]) / 2.5;
      p += ` C ${pts[i][0] + cp} ${pts[i][1]}, ${pts[i + 1][0] - cp} ${pts[i + 1][1]}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
    }
    return p;
  };

  return (
    <div className="app" style={{ gridTemplateColumns: '1fr' }}>
      <main>
        <div className="head">
          <div>
            <div className="crumb">Home › Stats</div>
            <h1>Statistics</h1>
          </div>
          <div className="acts">
            <button className={`pill ${period === 'week' ? 'on' : ''}`} onClick={() => setPeriod('week')}>Week</button>
            <button className={`pill ${period === 'month' ? 'on' : ''}`} onClick={() => setPeriod('month')}>Month</button>
            <button className={`pill ${period === 'year' ? 'on' : ''}`} onClick={() => setPeriod('year')}>Year</button>
          </div>
        </div>

        {/* ─── Top stat cards ─── */}
        <div className="stats-top">
          <div className="stat-big-card purple">
            <div className="stat-big-icon">📊</div>
            <div className="stat-big-num">{overallRate}%</div>
            <div className="stat-big-label">Overall completion</div>
            <div className="stat-big-sub">{totalDone} of {totalAll} habits done</div>
          </div>
          <div className="stat-big-card">
            <div className="stat-big-icon">🔥</div>
            <div className="stat-big-num">24</div>
            <div className="stat-big-label">Current streak</div>
            <div className="stat-big-sub">Your longest: 24 days</div>
          </div>
          <div className="stat-big-card">
            <div className="stat-big-icon">⚡</div>
            <div className="stat-big-num">{totalDone}</div>
            <div className="stat-big-label">Habits completed</div>
            <div className="stat-big-sub">This {period}</div>
          </div>
          <div className="stat-big-card">
            <div className="stat-big-icon">🏆</div>
            <div className="stat-big-num">7</div>
            <div className="stat-big-label">Perfect days</div>
            <div className="stat-big-sub">100% completion</div>
          </div>
        </div>

        {/* ─── Charts row ─── */}
        <div className="stats-row">
          {/* Weekly bar chart */}
          <div className="card">
            <div className="mute">Performance</div>
            <h3>Weekly Overview</h3>
            <div className="stat-bars">
              {weeklyData.map((d, i) => {
                const pct = (d.done / d.total) * 100;
                return (
                  <div key={i} className="stat-bar-col">
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ height: `${pct}%` }}></div>
                    </div>
                    <span className="stat-bar-label">{d.day}</span>
                    <span className="stat-bar-val">{d.done}/{d.total}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly trend line */}
          <div className="card">
            <div className="mute">Trend</div>
            <h3>Monthly Completion Rate</h3>
            <div style={{ height: 180, position: 'relative' }}>
              {(() => {
                const W = 500, H = 150, pad = 10;
                const pts: [number, number][] = monthlyTrend.map((v, i) => [
                  pad + (i / (monthlyTrend.length - 1)) * (W - pad * 2),
                  H - pad - ((v - 50) / 50) * (H - pad * 2),
                ]);
                const line = buildSmooth(pts);
                const area = line + ` L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
                return (
                  <svg viewBox={`0 0 ${W} ${H + 22}`} width="100%" height="100%" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--mint)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--mint)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <g stroke="var(--grey)" strokeWidth="1" strokeDasharray="4 4">
                      <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} />
                      <line x1={pad} x2={W - pad} y1={H / 2} y2={H / 2} />
                      <line x1={pad} x2={W - pad} y1={pad} y2={pad} />
                    </g>
                    <path d={area} fill="url(#trend-fill)" />
                    <path d={line} fill="none" stroke="var(--mint)" strokeWidth="3" />
                    <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="5" fill="var(--panel)" stroke="var(--mint)" strokeWidth="2.5" />
                    <g fill="var(--mute)" fontSize="10" textAnchor="middle">
                      {MONTHS_SHORT.map((m, i) => {
                        const x = pad + (i / (monthlyTrend.length - 1)) * (W - pad * 2);
                        return <text key={m} x={x} y={H + 18}>{m}</text>;
                      })}
                    </g>
                  </svg>
                );
              })()}
            </div>
          </div>
        </div>

        {/* ─── Category breakdown + Best habits ─── */}
        <div className="stats-row">
          {/* Category breakdown */}
          <div className="card">
            <div className="mute">Breakdown</div>
            <h3>By Category</h3>
            <div className="stat-cat-list">
              {CATEGORIES.map(cat => {
                const pct = Math.round((cat.done / cat.total) * 100);
                return (
                  <div key={cat.id} className="stat-cat-row">
                    <span className="stat-cat-emoji">{cat.emoji}</span>
                    <span className="stat-cat-name">{cat.name}</span>
                    <div className="stat-cat-bar">
                      <div className="stat-cat-fill" style={{ width: `${pct}%`, background: cat.color }}></div>
                    </div>
                    <span className="stat-cat-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best habits */}
          <div className="card">
            <div className="mute">Leaderboard</div>
            <h3>Best Habits</h3>
            <div className="stat-best-list">
              {bestHabits.map((h, i) => (
                <div key={i} className="stat-best-row">
                  <span className="stat-rank">{i + 1}</span>
                  <span className="stat-best-emoji">{h.emoji}</span>
                  <div className="stat-best-info">
                    <span className="stat-best-name">{h.name}</span>
                    <span className="mute" style={{ fontSize: 11 }}>🔥 {h.streak} day streak</span>
                  </div>
                  <div className="stat-best-rate">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="var(--grey)" strokeWidth="4" />
                      <circle cx="20" cy="20" r="16" fill="none" stroke="var(--mint)" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={`${(h.rate / 100) * 100.5} 100.5`}
                        transform="rotate(-90 20 20)" />
                    </svg>
                    <span className="stat-best-pct">{h.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Streak history + Donut ─── */}
        <div className="stats-row">
          {/* Streak history */}
          <div className="card">
            <div className="mute">History</div>
            <h3>Streak Over Time</h3>
            <div style={{ height: 160, position: 'relative' }}>
              {(() => {
                const W = 500, H = 130, pad = 10;
                const maxV = Math.max(...streakHistory);
                const pts: [number, number][] = streakHistory.map((v, i) => [
                  pad + (i / (streakHistory.length - 1)) * (W - pad * 2),
                  H - pad - (v / maxV) * (H - pad * 2),
                ]);
                const line = buildSmooth(pts);
                const area = line + ` L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
                return (
                  <svg viewBox={`0 0 ${W} ${H + 22}`} width="100%" height="100%" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="streak-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <g stroke="var(--grey)" strokeWidth="1" strokeDasharray="4 4">
                      <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} />
                      <line x1={pad} x2={W - pad} y1={H / 2} y2={H / 2} />
                      <line x1={pad} x2={W - pad} y1={pad} y2={pad} />
                    </g>
                    <path d={area} fill="url(#streak-fill)" />
                    <path d={line} fill="none" stroke="var(--teal)" strokeWidth="3" />
                    {pts.map((p, i) => (
                      <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--panel)" stroke="var(--teal)" strokeWidth="2" />
                    ))}
                    <g fill="var(--mute)" fontSize="10" textAnchor="middle">
                      {MONTHS_SHORT.map((m, i) => {
                        const x = pad + (i / (streakHistory.length - 1)) * (W - pad * 2);
                        return <text key={m} x={x} y={H + 18}>{m}</text>;
                      })}
                    </g>
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* Category donut */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ alignSelf: 'stretch' }}>
              <div className="mute">Distribution</div>
              <h3>Habit Mix</h3>
            </div>
            <div className="stat-donut-wrap">
              <svg viewBox="0 0 200 200" width="180" height="180">
                {(() => {
                  const R = 80, C = 2 * Math.PI * R;
                  let offset = 0;
                  return CATEGORIES.map(cat => {
                    const frac = cat.done / totalDone;
                    const len = frac * C;
                    const el = (
                      <circle key={cat.id} cx="100" cy="100" r={R} fill="none"
                        stroke={cat.color} strokeWidth="22"
                        strokeDasharray={`${Math.max(len - 4, 0)} ${C}`}
                        strokeDashoffset={-offset}
                        transform="rotate(-90 100 100)" />
                    );
                    offset += len;
                    return el;
                  });
                })()}
              </svg>
              <div className="stat-donut-center">
                <b>{totalDone}</b>
                <span>total</span>
              </div>
            </div>
            <div className="stat-donut-legend">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="stat-donut-item">
                  <span className="stat-donut-dot" style={{ background: cat.color }}></span>
                  <span>{cat.emoji} {cat.name}</span>
                  <b>{cat.done}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
