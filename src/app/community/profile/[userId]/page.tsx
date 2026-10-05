"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

/* ── Mock user database ── */
const USERS: Record<string, {
  name: string;
  avatar: string;
  bio: string;
  level: number;
  title: string;
  streak: number;
  longestStreak: number;
  joinedDate: string;
  gems: number;
  points: number;
  habits: { emoji: string; name: string; streak: number; done: boolean }[];
  badges: { icon: string; label: string }[];
  posts: { id: number; subId: string; subName: string; text: string; time: string; likes: number }[];
  communities: string[];
}> = {
  'youssef-al-mansoor': {
    name: 'Youssef Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: '90 days smoke-free and counting 🚭 | Gym 5x/week | Building better habits daily',
    level: 12,
    title: 'Habit Master',
    streak: 90,
    longestStreak: 90,
    joinedDate: 'Jan 2026',
    gems: 2450,
    points: 2150,
    habits: [
      { emoji: '🚭', name: 'No Smoking', streak: 90, done: true },
      { emoji: '🏋️', name: 'Gym Session', streak: 45, done: true },
      { emoji: '📖', name: 'Read Quran', streak: 30, done: false },
      { emoji: '💧', name: 'Drink 3L Water', streak: 60, done: true },
    ],
    badges: [
      { icon: '🏆', label: '90-Day Champion' },
      { icon: '🔥', label: 'Unstoppable' },
      { icon: '🌟', label: 'Top Contributor' },
      { icon: '💎', label: 'Gem Collector' },
      { icon: '🎯', label: 'Consistency King' },
      { icon: '🛡️', label: 'Streak Guardian' },
    ],
    posts: [
      { id: 1, subId: 'smoking', subName: 'r/QuitSmoking', text: '90 days clean today! No more nicotine cravings, my lungs feel incredible and I have so much more energy. If I can do it, so can you! 🚭💪', time: '18m ago', likes: 42 },
      { id: 2, subId: 'sports', subName: 'r/Fitness', text: 'New bench press PR: 100kg! Consistency is everything 🏋️', time: '2d ago', likes: 31 },
      { id: 3, subId: 'smoking', subName: 'r/QuitSmoking', text: 'Week 12 check-in: Saved over $800 since quitting. That money is going toward my gym membership and healthy meals.', time: '5d ago', likes: 58 },
    ],
    communities: ['smoking', 'sports', 'prayers'],
  },
  'tariq-hilal': {
    name: 'Tariq Hilal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Fajr warrior 🕌 | Quran memorizer | Striving for consistency in worship',
    level: 8,
    title: 'Devoted Learner',
    streak: 30,
    longestStreak: 67,
    joinedDate: 'Mar 2026',
    gems: 1100,
    points: 1380,
    habits: [
      { emoji: '📖', name: 'Read Quran', streak: 30, done: true },
      { emoji: '🕌', name: 'Fajr in Jamaah', streak: 25, done: true },
      { emoji: '🤲', name: '5 Daily Prayers', streak: 30, done: true },
      { emoji: '📚', name: 'Islamic Studies', streak: 12, done: false },
    ],
    badges: [
      { icon: '📖', label: 'Quran Devotee' },
      { icon: '🕌', label: 'Fajr Warrior' },
      { icon: '🌙', label: '30-Day Streak' },
    ],
    posts: [
      { id: 1, subId: 'prayers', subName: 'r/PrayersQuran', text: 'Woke up for Fajr at the mosque and completed my daily Quran portion. Starting Friday with peace and barakah. 🤲✨', time: '45m ago', likes: 38 },
      { id: 2, subId: 'prayers', subName: 'r/PrayersQuran', text: 'Finished memorizing Surah Ar-Rahman! The feeling is indescribable 🤲📖', time: '3d ago', likes: 67 },
    ],
    communities: ['prayers', 'learning'],
  },
  'malik-vance': {
    name: 'Malik Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Day 45 reboot ⚡ | Self-mastery journey | Discipline > Motivation',
    level: 6,
    title: 'Rising Warrior',
    streak: 45,
    longestStreak: 45,
    joinedDate: 'Jun 2026',
    gems: 780,
    points: 920,
    habits: [
      { emoji: '🛡️', name: 'NoFap Reboot', streak: 45, done: true },
      { emoji: '🧘', name: 'Cold Shower', streak: 30, done: true },
      { emoji: '📓', name: 'Journaling', streak: 20, done: false },
    ],
    badges: [
      { icon: '🛡️', label: 'Shield Bearer' },
      { icon: '⚡', label: '45-Day Reboot' },
    ],
    posts: [
      { id: 1, subId: 'nofap', subName: 'r/NoFap', text: 'Halfway to 90 days! Mental clarity is at an all-time high, confidence is sky-rocketing, and brain fog is gone. Stay disciplined brothers! 🛡️', time: '2h ago', likes: 56 },
    ],
    communities: ['nofap', 'sports'],
  },
  'sarah-miller': {
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Fitness enthusiast 🏋️ | Running addict | PR every week',
    level: 7,
    title: 'Fitness Warrior',
    streak: 28,
    longestStreak: 42,
    joinedDate: 'Apr 2026',
    gems: 950,
    points: 1120,
    habits: [
      { emoji: '🏋️', name: 'Gym Session', streak: 28, done: true },
      { emoji: '🏃', name: 'Morning Jog', streak: 15, done: true },
      { emoji: '🥗', name: 'Clean Eating', streak: 22, done: false },
    ],
    badges: [
      { icon: '🏋️', label: 'Iron Lifter' },
      { icon: '💪', label: 'PR Crusher' },
      { icon: '🏃', label: 'Runner' },
    ],
    posts: [
      { id: 1, subId: 'sports', subName: 'r/Fitness', text: 'Hit a new PR on deadlifts today! Consistency beats motivation every single time 💪', time: '3h ago', likes: 19 },
    ],
    communities: ['sports', 'morning'],
  },
  'karim-benali': {
    name: 'Karim Benali',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'ML Engineer 🧠 | Lifelong learner | 42-day reading streak',
    level: 9,
    title: 'Knowledge Seeker',
    streak: 42,
    longestStreak: 55,
    joinedDate: 'Feb 2026',
    gems: 1320,
    points: 1450,
    habits: [
      { emoji: '📚', name: 'Read 20 Pages', streak: 42, done: true },
      { emoji: '💻', name: 'Code 1 Hour', streak: 38, done: true },
      { emoji: '🧠', name: 'ML Course', streak: 25, done: false },
    ],
    badges: [
      { icon: '📚', label: 'Bookworm' },
      { icon: '🧠', label: 'Brain Power' },
      { icon: '💻', label: 'Code Ninja' },
    ],
    posts: [
      { id: 1, subId: 'learning', subName: 'r/ContinuousLearning', text: 'Finished chapter 4 on neural network architectures 🧠✨', time: '5h ago', likes: 24 },
      { id: 2, subId: 'learning', subName: 'r/ContinuousLearning', text: 'Started Andrew Ng\'s new deep learning course. Already blown away by the content 📚', time: '1d ago', likes: 35 },
    ],
    communities: ['learning', 'sports'],
  },
};

const SUB_COMMUNITIES: Record<string, { name: string; icon: string; sub: string }> = {
  smoking: { name: 'Smoking Quitters', icon: '🚭', sub: 'r/QuitSmoking' },
  nofap: { name: 'No Fap & Reboot', icon: '🛡️', sub: 'r/NoFap' },
  morning: { name: 'Morning Rituals', icon: '🌅', sub: 'r/MorningRoutine' },
  prayers: { name: 'Prayers & Quran', icon: '📖', sub: 'r/PrayersQuran' },
  sports: { name: 'Sports & Gym', icon: '🏋️', sub: 'r/Fitness' },
  learning: { name: 'Learning & Growth', icon: '📚', sub: 'r/ContinuousLearning' },
};

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const user = USERS[userId];
  const [activeTab, setActiveTab] = useState<'posts' | 'habits' | 'badges'>('posts');
  const [following, setFollowing] = useState(false);

  if (!user) {
    return (
      <div className="app">
        <main style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>👤</div>
          <h1 style={{ fontSize: '1.5rem' }}>User not found</h1>
          <p style={{ color: 'var(--mute)', marginBottom: '20px' }}>This profile doesn't exist or has been removed.</p>
          <Link href="/community" className="btn g" style={{ textDecoration: 'none' }}>← Back to Community</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main>
        <div className="crumb" style={{ marginBottom: '16px' }}>
          <Link href="/community" style={{ color: 'var(--mute)', textDecoration: 'none' }}>Community</Link>
          {' › '}
          <span style={{ color: 'var(--ink)' }}>{user.name}</span>
        </div>

        {/* ── Profile Header ── */}
        <div className="profile-hero">
          <div className="profile-hero-bg" />
          <div className="profile-hero-content">
            <div className="profile-hero-avatar-wrap">
              <img src={user.avatar} alt={user.name} className="profile-hero-avatar" />
              <div className="profile-hero-level">{user.level}</div>
            </div>
            <div className="profile-hero-info">
              <h1 style={{ margin: '0 0 2px', fontSize: '1.6rem' }}>{user.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="profile-hero-title">{user.title}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--mute)' }}>• Joined {user.joinedDate}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--mute)', lineHeight: 1.5, maxWidth: '500px' }}>{user.bio}</p>
            </div>
            <div className="profile-hero-actions">
              <button
                className={`btn ${following ? '' : 'g'}`}
                onClick={() => setFollowing(!following)}
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                {following ? '✓ Following' : '＋ Follow'}
              </button>
              <button className="btn" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>💬 Message</button>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="profile-stats-row">
          <div className="profile-stat-item">
            <span className="profile-stat-num">{user.streak}</span>
            <span className="profile-stat-label">🔥 Current Streak</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-num">{user.longestStreak}</span>
            <span className="profile-stat-label">🏆 Longest Streak</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-num">{user.points.toLocaleString()}</span>
            <span className="profile-stat-label">⭐ Total Points</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-num">{user.gems.toLocaleString()}</span>
            <span className="profile-stat-label">💎 Gems Earned</span>
          </div>
        </div>

        {/* ── Communities joined ── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '20px 0' }}>
          {user.communities.map(cId => {
            const c = SUB_COMMUNITIES[cId];
            return c ? (
              <Link
                key={cId}
                href={`/community/sub/${cId}`}
                className="profile-community-tag"
                style={{ textDecoration: 'none' }}
              >
                <span>{c.icon}</span> {c.name}
              </Link>
            ) : null;
          })}
        </div>

        {/* ── Tab Navigation ── */}
        <div className="profile-tabs">
          <button className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            📝 Posts ({user.posts.length})
          </button>
          <button className={`profile-tab ${activeTab === 'habits' ? 'active' : ''}`} onClick={() => setActiveTab('habits')}>
            🎯 Habits ({user.habits.length})
          </button>
          <button className={`profile-tab ${activeTab === 'badges' ? 'active' : ''}`} onClick={() => setActiveTab('badges')}>
            🏅 Badges ({user.badges.length})
          </button>
        </div>

        {/* ── Posts Tab ── */}
        {activeTab === 'posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {user.posts.map(post => (
              <div key={post.id} className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img src={user.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <b style={{ fontSize: '0.9rem' }}>{user.name}</b>
                    <Link
                      href={`/community/sub/${post.subId}`}
                      className="feed-sub-link"
                      style={{ marginLeft: '8px' }}
                      onClick={e => e.stopPropagation()}
                    >
                      {post.subName}
                    </Link>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--mute)' }}>{post.time}</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '0.92rem', lineHeight: 1.5 }}>{post.text}</p>
                <div style={{ display: 'flex', gap: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--mute)' }}>❤️ {post.likes} likes</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--mute)' }}>💬 Comment</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Habits Tab ── */}
        {activeTab === 'habits' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
            {user.habits.map((h, i) => (
              <div key={i} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: `3px solid ${h.done ? 'var(--mint)' : 'var(--grey)'}` }}>
                <span style={{ fontSize: '28px' }}>{h.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{h.name}</div>
                  <small style={{ color: 'var(--mute)' }}>🔥 {h.streak}-day streak</small>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '99px',
                  background: h.done ? 'rgba(139, 108, 199, 0.2)' : 'rgba(255,255,255,0.06)',
                  color: h.done ? 'var(--mint)' : 'var(--mute)',
                }}>
                  {h.done ? '✓ Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Badges Tab ── */}
        {activeTab === 'badges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {user.badges.map((b, i) => (
              <div key={i} className="profile-badge-card">
                <span className="profile-badge-icon">{b.icon}</span>
                <span className="profile-badge-label">{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
