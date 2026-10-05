"use client";

import React, { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Simulated habit data per day (day-of-month → completion count out of 6)
function getSimData(year: number, month: number): Record<number, number> {
  const data: Record<number, number> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date > today) continue;
    // Deterministic pseudo-random based on date
    const seed = (year * 366 + month * 31 + d) * 2654435761;
    data[d] = ((seed >>> 0) % 7); // 0-6
  }
  return data;
}

const sampleHabits = [
  { name: 'Drink 2L water', cat: 'Health', emoji: '💧' },
  { name: 'Morning walk', cat: 'Health', emoji: '🚶' },
  { name: 'Read 20 pages', cat: 'Mind', emoji: '📖' },
  { name: 'Deep work 90 min', cat: 'Focus', emoji: '🎯' },
  { name: 'Meditate', cat: 'Mind', emoji: '🧘' },
  { name: 'Plan tomorrow', cat: 'Focus', emoji: '📝' },
];

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Mon=0
  const simData = getSimData(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
    setSelectedDay(null);
  };

  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isFuture = (d: number) =>
    new Date(viewYear, viewMonth, d) > today;

  // Get intensity level 0-4
  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  };

  // Build selected day's habits
  const selectedCount = selectedDay ? (simData[selectedDay] ?? 0) : 0;
  const selectedHabits = sampleHabits.map((h, i) => ({
    ...h,
    done: selectedDay ? i < selectedCount : false,
  }));
  const selectedDate = selectedDay
    ? new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="app">
      <main>
        <div className="head">
          <div>
            <div className="crumb">Home › Calendar</div>
            <h1>Calendar</h1>
          </div>
          <div className="acts">
            <button className="btn" onClick={goToday}>Today</button>
            <button className="btn g">＋ Add event</button>
          </div>
        </div>

        <div className="cal-container compact">
          {/* Month navigation */}
          <div className="cal-header">
            <button className="btn" onClick={prevMonth} aria-label="Previous month">←</button>
            <h2 className="cal-title">{MONTHS[viewMonth]} {viewYear}</h2>
            <button className="btn" onClick={nextMonth} aria-label="Next month">→</button>
          </div>

          {/* Day headers */}
          <div className="cal-grid">
            {DAYS.map(d => (
              <div key={d} className="cal-day-label">{d}</div>
            ))}

            {/* Empty cells before month starts */}
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`e${i}`} className="cal-cell empty"></div>
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1;
              const count = simData[d] ?? 0;
              const level = getLevel(count);
              const future = isFuture(d);
              const todayClass = isToday(d) ? 'is-today' : '';
              const selectedClass = selectedDay === d ? 'selected' : '';
              const futureClass = future ? 'future' : '';

              return (
                <button
                  key={d}
                  className={`cal-cell lv-bg-${future ? 0 : level} ${todayClass} ${selectedClass} ${futureClass}`}
                  onClick={() => !future && setSelectedDay(d)}
                  disabled={future}
                >
                  <span className="cal-num">{d}</span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="cal-legend">
            <span className="mute">Less</span>
            <span className="cal-dot-lg lv0"></span>
            <span className="cal-dot-lg lv1"></span>
            <span className="cal-dot-lg lv2"></span>
            <span className="cal-dot-lg lv3"></span>
            <span className="cal-dot-lg lv4"></span>
            <span className="mute">More</span>
          </div>
        </div>

        {/* Accomplishment Chart */}
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <div className="mute">Daily performance</div>
              <h3 style={{ margin: '4px 0 0' }}>Accomplishment this month</h3>
            </div>
            <div className="mute" style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }}></span> Habits done
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: 'var(--grey)' }}></span> Average
              </span>
            </div>
          </div>

          <div style={{ position: 'relative', height: 160, width: '100%' }}>
            {(() => {
              const activeDays = Object.keys(simData).length;
              const totalDone = Object.values(simData).reduce((a, b) => a + b, 0);
              const avgVal = activeDays > 0 ? totalDone / activeDays : 0;
              const W = 800;
              const H = 130;
              const pad = 10;

              // Build data points
              const points: [number, number][] = [];
              for (let d = 1; d <= daysInMonth; d++) {
                const x = pad + ((d - 1) / (daysInMonth - 1)) * (W - pad * 2);
                const count = simData[d] ?? 0;
                const y = H - pad - (count / 6) * (H - pad * 2);
                points.push([x, y]);
              }

              // Smooth curve using cubic bezier
              const buildSmoothPath = (pts: [number, number][]) => {
                if (pts.length < 2) return '';
                let path = `M ${pts[0][0]} ${pts[0][1]}`;
                for (let i = 0; i < pts.length - 1; i++) {
                  const cp = (pts[i + 1][0] - pts[i][0]) / 2.5;
                  path += ` C ${pts[i][0] + cp} ${pts[i][1]}, ${pts[i + 1][0] - cp} ${pts[i + 1][1]}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
                }
                return path;
              };

              const linePath = buildSmoothPath(points);
              const areaPath = linePath + ` L ${points[points.length - 1][0]} ${H} L ${points[0][0]} ${H} Z`;

              // Average line
              const avgY = H - pad - (avgVal / 6) * (H - pad * 2);

              // X-axis labels (every 5 days)
              const xLabels = [1, 5, 10, 15, 20, 25, daysInMonth].filter((v, i, a) => a.indexOf(v) === i);

              return (
                <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <g stroke="var(--grey)" strokeWidth="1" strokeDasharray="4 4">
                    <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} />
                    <line x1={pad} x2={W - pad} y1={(H - pad * 2) * 0.5 + pad} y2={(H - pad * 2) * 0.5 + pad} />
                    <line x1={pad} x2={W - pad} y1={pad} y2={pad} />
                  </g>

                  {/* Average line */}
                  <line x1={pad} x2={W - pad} y1={avgY} y2={avgY} stroke="var(--grey)" strokeWidth="2" strokeDasharray="6 4" />

                  {/* Area fill */}
                  <path d={areaPath} fill="url(#chart-fill)" />

                  {/* Line */}
                  <path d={linePath} fill="none" stroke="var(--teal)" strokeWidth="3" />

                  {/* Selected day dot */}
                  {selectedDay && simData[selectedDay] !== undefined && (() => {
                    const sx = pad + ((selectedDay - 1) / (daysInMonth - 1)) * (W - pad * 2);
                    const sy = H - pad - ((simData[selectedDay] ?? 0) / 6) * (H - pad * 2);
                    const val = simData[selectedDay] ?? 0;
                    return (
                      <>
                        <line x1={sx} x2={sx} y1={sy} y2={H - pad} stroke="var(--mint)" strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle cx={sx} cy={sy} r="6" fill="var(--panel)" stroke="var(--mint)" strokeWidth="3" />
                        <rect x={sx - 22} y={sy - 24} width="44" height="18" rx="9" fill="var(--ink)" />
                        <text x={sx} y={sy - 12} fill="var(--bg)" fontSize="11" textAnchor="middle" fontWeight="bold">{val}/6</text>
                      </>
                    );
                  })()}

                  {/* X-axis labels */}
                  <g fill="var(--mute)" fontSize="11" textAnchor="middle" fontWeight="500">
                    {xLabels.map(d => {
                      const x = pad + ((d - 1) / (daysInMonth - 1)) * (W - pad * 2);
                      return <text key={d} x={x} y={H + 16}>{d}</text>;
                    })}
                  </g>

                  {/* Y-axis labels */}
                  <g fill="var(--mute)" fontSize="10" textAnchor="end">
                    <text x={pad - 2} y={H - pad + 4}>0</text>
                    <text x={pad - 2} y={(H - pad * 2) * 0.5 + pad + 4}>3</text>
                    <text x={pad - 2} y={pad + 4}>6</text>
                  </g>
                </svg>
              );
            })()}
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="side">


        {selectedDay ? (
          <>
            <div>
              <div className="mute">{selectedDate}</div>
              <h2>{isToday(selectedDay) ? "Today's progress" : `Day ${selectedDay} recap`}</h2>
            </div>

            {/* Progress ring */}
            <div className="cal-progress">
              <svg viewBox="0 0 120 120" width="100" height="100">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--grey)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="var(--mint)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(selectedCount / 6) * 314} 314`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="cal-progress-text">
                <b>{selectedCount}</b>
                <span>/6</span>
              </div>
            </div>

            <div className="list">
              {selectedHabits.map((h, i) => (
                <div key={i} className={`row ${h.done ? 'done' : ''}`}>
                  <span className="ic">{h.emoji}</span>
                  <span>
                    <p>{h.name}</p>
                    <small>{h.cat}</small>
                  </span>
                  <span className="st">{h.done ? 'Done' : 'Missed'}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
              <h2>Select a day</h2>
              <p className="mute">Click on any day to see your habit history</p>
            </div>
          </div>
        )}

        {/* Monthly stats */}
        <div className="streak-card" style={{ marginTop: 'auto' }}>
          <div className="streak-head">
            <span className="streak-flame">📊</span>
            <div>
              <b className="streak-count">{MONTHS[viewMonth]}</b>
              <span className="streak-label">monthly overview</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="cal-stat-box">
              <b>{Object.values(simData).reduce((a, b) => a + b, 0)}</b>
              <span>habits done</span>
            </div>
            <div className="cal-stat-box">
              <b>{Object.keys(simData).length}</b>
              <span>active days</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
