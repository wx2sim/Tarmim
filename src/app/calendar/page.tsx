"use client";

import React, { useState } from 'react';
import Nav from '../components/Nav';

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
        <Nav />
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

        <div className="cal-container">
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
                  className={`cal-cell ${todayClass} ${selectedClass} ${futureClass}`}
                  onClick={() => !future && setSelectedDay(d)}
                  disabled={future}
                >
                  <span className="cal-num">{d}</span>
                  {!future && count > 0 && (
                    <div className="cal-dots-row">
                      {Array.from({ length: Math.min(count, 6) }, (_, j) => (
                        <span key={j} className={`cal-dot lv${Math.min(Math.ceil((j + 1) / 1.5), 4)}`}></span>
                      ))}
                    </div>
                  )}
                  {!future && count > 0 && (
                    <span className={`cal-badge lv${level}`}>{count}/6</span>
                  )}
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
      </main>

      {/* Sidebar */}
      <aside className="side">
        <div className="top">
          <div className="search">🔍 Search…</div>
          <div className="av">W</div>
        </div>

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
