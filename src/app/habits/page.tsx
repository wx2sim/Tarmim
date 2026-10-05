"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/* ─── Premade habit templates ─── */
const CATEGORIES = [
  {
    id: 'sleep', emoji: '💤', name: 'Sleep', color: '#7c5cbf',
    options: [
      { id: 'sleep-hours', label: 'Sleep hours', unit: 'hours', defaultAmt: 8 },
      { id: 'sleep-early', label: 'Sleep before midnight', unit: '', defaultAmt: 0 },
      { id: 'sleep-nap', label: 'Power nap', unit: 'min', defaultAmt: 20 },
    ],
  },
  {
    id: 'sport', emoji: '🏋️', name: 'Sport', color: '#e06070',
    options: [
      { id: 'sport-gym', label: 'Gym', unit: 'min', defaultAmt: 60 },
      { id: 'sport-jogging', label: 'Jogging', unit: 'km', defaultAmt: 5 },
      { id: 'sport-swimming', label: 'Swimming', unit: 'min', defaultAmt: 45 },
      { id: 'sport-cycling', label: 'Cycling', unit: 'km', defaultAmt: 10 },
      { id: 'sport-yoga', label: 'Yoga', unit: 'min', defaultAmt: 30 },
    ],
  },
  {
    id: 'learn', emoji: '📚', name: 'Learn', color: '#4b9fc7',
    options: [
      { id: 'learn-language', label: 'Language', unit: 'min', defaultAmt: 30, hasName: true, namePlaceholder: 'e.g. Spanish, Arabic…' },
      { id: 'learn-topic', label: 'Topic / Course', unit: 'min', defaultAmt: 45, hasName: true, namePlaceholder: 'e.g. Machine Learning…' },
      { id: 'learn-reading', label: 'Reading', unit: 'pages', defaultAmt: 20 },
    ],
  },
  {
    id: 'hydration', emoji: '💧', name: 'Hydration', color: '#5bc0de',
    options: [
      { id: 'hydration-water', label: 'Drink water', unit: 'L', defaultAmt: 2 },
      { id: 'hydration-no-soda', label: 'No soda / juice', unit: '', defaultAmt: 0 },
    ],
  },
  {
    id: 'mindfulness', emoji: '🧘', name: 'Mindfulness', color: '#9b7dd4',
    options: [
      { id: 'mind-meditate', label: 'Meditation', unit: 'min', defaultAmt: 15 },
      { id: 'mind-journal', label: 'Journaling', unit: 'min', defaultAmt: 10 },
      { id: 'mind-breathing', label: 'Breathing exercise', unit: 'min', defaultAmt: 5 },
      { id: 'mind-gratitude', label: 'Gratitude list', unit: 'items', defaultAmt: 3 },
    ],
  },
  {
    id: 'nutrition', emoji: '🥗', name: 'Nutrition', color: '#6cc770',
    options: [
      { id: 'nutri-healthy', label: 'Healthy meal', unit: 'meals', defaultAmt: 3 },
      { id: 'nutri-nosugar', label: 'No sugar', unit: '', defaultAmt: 0 },
      { id: 'nutri-fasting', label: 'Intermittent fasting', unit: 'hours', defaultAmt: 16 },
      { id: 'nutri-fruits', label: 'Eat fruits', unit: 'servings', defaultAmt: 3 },
    ],
  },
  {
    id: 'movement', emoji: '🚶', name: 'Movement', color: '#e8a74e',
    options: [
      { id: 'move-steps', label: 'Daily steps', unit: 'steps', defaultAmt: 10000 },
      { id: 'move-walk', label: 'Walk outside', unit: 'min', defaultAmt: 30 },
      { id: 'move-stretch', label: 'Stretching', unit: 'min', defaultAmt: 15 },
    ],
  },
];

type Habit = {
  id: string;
  catId: string;
  emoji: string;
  catColor: string;
  label: string;
  customName?: string;
  unit: string;
  target: number;
  done: boolean;
  note: string;
  streak: number;
};

const DEMO_HABITS: Habit[] = [
  { id: 'sport-gym-1', catId: 'sport', emoji: '🏋️', catColor: '#e06070', label: 'Gym', unit: 'min', target: 60, done: true, note: 'Leg day 💪', streak: 5 },
  { id: 'hydration-water-1', catId: 'hydration', emoji: '💧', catColor: '#5bc0de', label: 'Drink water', unit: 'L', target: 2, done: false, note: '', streak: 12 },
  { id: 'learn-language-1', catId: 'learn', emoji: '📚', catColor: '#4b9fc7', label: 'Language', customName: 'Arabic', unit: 'min', target: 30, done: false, note: '', streak: 8 },
  { id: 'sleep-hours-1', catId: 'sleep', emoji: '💤', catColor: '#7c5cbf', label: 'Sleep hours', unit: 'hours', target: 8, done: true, note: 'Slept well', streak: 3 },
  { id: 'mind-meditate-1', catId: 'mindfulness', emoji: '🧘', catColor: '#9b7dd4', label: 'Meditation', unit: 'min', target: 15, done: false, note: '', streak: 20 },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'category' | 'option' | 'configure'>('category');
  const [selCat, setSelCat] = useState<typeof CATEGORIES[0] | null>(null);
  const [selOpt, setSelOpt] = useState<typeof CATEGORIES[0]['options'][0] | null>(null);
  const [cfgAmt, setCfgAmt] = useState('');
  const [cfgName, setCfgName] = useState('');
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    try {
      const s = localStorage.getItem('habits-page-v1');
      if (s) setHabits(JSON.parse(s));
      else setHabits(DEMO_HABITS);
    } catch { setHabits(DEMO_HABITS); }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem('habits-page-v1', JSON.stringify(habits)); } catch {}
    }
  }, [habits, mounted]);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  const toggleDone = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const updateNote = (id: string, note: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, note } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const openModal = () => {
    setModalOpen(true);
    setModalStep('category');
    setSelCat(null);
    setSelOpt(null);
    setCfgAmt('');
    setCfgName('');
  };

  const pickCategory = (cat: typeof CATEGORIES[0]) => {
    setSelCat(cat);
    setModalStep('option');
  };

  const pickOption = (opt: typeof CATEGORIES[0]['options'][0]) => {
    setSelOpt(opt);
    setCfgAmt(String(opt.defaultAmt));
    setCfgName('');
    setModalStep('configure');
  };

  const confirmAdd = () => {
    if (!selCat || !selOpt) return;
    const newH: Habit = {
      id: `${selOpt.id}-${Date.now()}`,
      catId: selCat.id,
      emoji: selCat.emoji,
      catColor: selCat.color,
      label: selOpt.label,
      customName: cfgName || undefined,
      unit: selOpt.unit,
      target: Number(cfgAmt) || selOpt.defaultAmt,
      done: false,
      note: '',
      streak: 0,
    };
    setHabits([...habits, newH]);
    setModalOpen(false);
  };

  if (!mounted) return null;

  const filtered = filter === 'all' ? habits
    : filter === 'done' ? habits.filter(h => h.done)
    : filter === 'pending' ? habits.filter(h => !h.done)
    : habits.filter(h => h.catId === filter);

  // Move checked habits to the bottom of the list
  const sortedHabits = [...filtered].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  const doneCount = habits.filter(h => h.done).length;
  const totalCount = habits.length;

  const uniqueCats = [...new Set(habits.map(h => h.catId))];

  return (
    <div className="app" style={{ gridTemplateColumns: '1fr' }}>
      <main>
        <div className="head">
          <div>
            <div className="crumb">Home › Habits</div>
            <h1>My Habits</h1>
          </div>
          <div className="acts">
            <button className="btn">{doneCount}/{totalCount} completed</button>
            <button className="btn g" onClick={openModal}>＋ Add habit</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          <button className={`pill ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`pill ${filter === 'done' ? 'on' : ''}`} onClick={() => setFilter('done')}>✓ Done</button>
          <button className={`pill ${filter === 'pending' ? 'on' : ''}`} onClick={() => setFilter('pending')}>○ Pending</button>
          {uniqueCats.map(cid => {
            const cat = CATEGORIES.find(c => c.id === cid);
            return cat ? (
              <button key={cid} className={`pill ${filter === cid ? 'on' : ''}`} onClick={() => setFilter(cid)}>
                {cat.emoji} {cat.name}
              </button>
            ) : null;
          })}
        </div>

        {/* Habit cards grid */}
        <div className="habits-grid">
          {sortedHabits.map(h => (
            <div key={h.id} className={`habit-card ${h.done ? 'done' : ''}`}>
              <div className="habit-top">
                <button className={`habit-check ${h.done ? 'checked' : ''}`} onClick={() => toggleDone(h.id)} aria-label="Toggle done">
                  {h.done ? '✓' : ''}
                </button>
                <div className="habit-info">
                  <div className="habit-name">
                    <span className="habit-emoji">{h.emoji}</span>
                    {h.customName ? `${h.label}: ${h.customName}` : h.label}
                  </div>
                  <div className="mute" style={{ fontSize: 12 }}>
                    {h.target > 0 && <span>Target: {h.target} {h.unit}</span>}
                    {h.streak > 0 && <span style={{ marginLeft: 8 }}>🔥 {h.streak} days</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="habit-action" onClick={() => setExpandedNote(expandedNote === h.id ? null : h.id)} title="Add note">
                    📝
                  </button>
                  <button className="habit-action" onClick={() => deleteHabit(h.id)} title="Delete">
                    🗑️
                  </button>
                </div>
              </div>

              {/* Category tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span className="habit-cat-tag" style={{ background: h.catColor + '22', color: h.catColor }}>
                  {CATEGORIES.find(c => c.id === h.catId)?.name}
                </span>
                {h.done && <span className="chip" style={{ fontSize: 10 }}>Completed</span>}
              </div>

              {/* Expandable note */}
              {expandedNote === h.id && (
                <div className="habit-note-area">
                  <textarea
                    placeholder="Add a note about today…"
                    value={h.note}
                    onChange={e => updateNote(h.id, e.target.value)}
                    rows={2}
                    maxLength={200}
                  />
                </div>
              )}
              {h.note && expandedNote !== h.id && (
                <div className="habit-note-preview" onClick={() => setExpandedNote(h.id)}>
                  💬 {h.note}
                </div>
              )}
            </div>
          ))}

          {/* Empty add card */}
          <button className="habit-card add-card" onClick={openModal}>
            <span style={{ fontSize: 32, opacity: 0.4 }}>＋</span>
            <span className="mute">Add new habit</span>
          </button>
        </div>
      </main>

      {/* ─── Modal ─── */}
      {modalOpen && createPortal(
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-habit-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="add-habit-modal-title">
                {modalStep === 'category' && 'Choose a category'}
                {modalStep === 'option' && selCat?.emoji + ' ' + selCat?.name}
                {modalStep === 'configure' && 'Configure habit'}
              </h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            {/* Step 1: Pick category */}
            {modalStep === 'category' && (
              <div className="modal-cats">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} className="modal-cat-btn" onClick={() => pickCategory(cat)}>
                    <span className="modal-cat-icon" style={{ background: cat.color + '22', color: cat.color }}>{cat.emoji}</span>
                    <span className="modal-cat-label">{cat.name}</span>
                    <span className="mute" style={{ fontSize: 11 }}>{cat.options.length} options</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Pick option */}
            {modalStep === 'option' && selCat && (
              <div className="modal-opts">
                <button className="modal-back" onClick={() => setModalStep('category')}>← Back</button>
                <div className="modal-opt-list">
                  {selCat.options.map(opt => (
                    <button key={opt.id} className="modal-opt-btn" onClick={() => pickOption(opt)}>
                      <span className="modal-opt-label">{opt.label}</span>
                      {opt.unit && <span className="mute">{opt.defaultAmt} {opt.unit}</span>}
                    </button>
                  ))}
                </div>
                </div>
            )}

            {/* Step 3: Configure */}
            {modalStep === 'configure' && selOpt && selCat && (
              <div className="modal-config">
                <button className="modal-back" onClick={() => setModalStep('option')}>← Back</button>

                <div className="modal-preview">
                  <span style={{ fontSize: 36 }}>{selCat.emoji}</span>
                  <div>
                    <b>{selOpt.label}</b>
                    <div className="mute">{selCat.name}</div>
                  </div>
                </div>

                {(selOpt as any).hasName && (
                  <div className="modal-field">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder={(selOpt as any).namePlaceholder || 'Enter name…'}
                      value={cfgName}
                      onChange={e => setCfgName(e.target.value)}
                      maxLength={40}
                    />
                  </div>
                )}

                {selOpt.unit && (
                  <div className="modal-field">
                    <label>Target ({selOpt.unit})</label>
                    <input
                      type="number"
                      min="0"
                      value={cfgAmt}
                      onChange={e => setCfgAmt(e.target.value)}
                    />
                  </div>
                )}

                <button className="btn g" style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 16 }} onClick={confirmAdd}>
                  Add habit
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
