"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type SubCommunity = {
  id: string;
  name: string;
  sub: string;
  icon: string;
  members: string;
  desc: string;
  banner: string;
  rules: string[];
};

const SUB_COMMUNITIES: Record<string, SubCommunity> = {
  smoking: {
    id: 'smoking', name: 'Smoking Quitters', sub: 'r/QuitSmoking', icon: '🚭', members: '12.4k',
    desc: 'A supportive community for people quitting smoking. Share your journey, celebrate milestones, and support each other through the toughest cravings.',
    banner: 'linear-gradient(135deg, #1a3a2a, #0f2a1e, #1a3a2a)',
    rules: ['Be supportive and encouraging', 'No shaming for relapses', 'Share your streak proudly', 'No promotion of nicotine products'],
  },
  nofap: {
    id: 'nofap', name: 'No Fap & Reboot', sub: 'r/NoFap', icon: '🛡️', members: '18.9k',
    desc: 'Self-mastery and discipline community. Track your reboot journey, share strategies, and stay accountable with thousands of brothers.',
    banner: 'linear-gradient(135deg, #2a1a3a, #1e0f2a, #2a1a3a)',
    rules: ['Keep discussions respectful', 'Share progress, not excuses', 'Support your brothers', 'No triggering content'],
  },
  morning: {
    id: 'morning', name: 'Morning Rituals', sub: 'r/MorningRoutine', icon: '🌅', members: '9.2k',
    desc: '5 AM club, morning walks, hydration, and starting the day with purpose. Build a morning routine that transforms your life.',
    banner: 'linear-gradient(135deg, #3a2a1a, #2a1e0f, #3a2a1a)',
    rules: ['Post your morning wins', 'Share routines that work', 'Early risers support each other'],
  },
  prayers: {
    id: 'prayers', name: 'Prayers & Quran', sub: 'r/PrayersQuran', icon: '📖', members: '15.6k',
    desc: 'Fajr check-ins, daily Salah tracking, and Quran recitation goals. A community of believers striving for consistency in worship.',
    banner: 'linear-gradient(135deg, #1a2a3a, #0f1e2a, #1a2a3a)',
    rules: ['Be respectful of all levels', 'Encourage consistency', 'Share Islamic knowledge with kindness', 'Fajr check-ins are welcome!'],
  },
  sports: {
    id: 'sports', name: 'Sports & Gym', sub: 'r/Fitness', icon: '🏋️', members: '24.1k',
    desc: 'Workout check-ins, gym PRs, jogging streaks, and yoga sessions. Push your limits and celebrate fitness milestones together.',
    banner: 'linear-gradient(135deg, #2a1a1a, #1e0f0f, #2a1a1a)',
    rules: ['Post PRs and milestones', 'Form check requests welcome', 'Be supportive of all fitness levels', 'No unsafe advice'],
  },
  learning: {
    id: 'learning', name: 'Learning & Growth', sub: 'r/ContinuousLearning', icon: '📚', members: '11.8k',
    desc: 'Languages, coding, reading, and skill building. Share what you learned today and inspire others to keep growing.',
    banner: 'linear-gradient(135deg, #1a1a3a, #0f0f2a, #1a1a3a)',
    rules: ['Share resources generously', 'Celebrate learning milestones', 'Ask questions freely', 'Recommend books and courses'],
  },
};

type Post = {
  id: number;
  userId: string;
  user: string;
  avatar: string;
  streak: number;
  action: string;
  time: string;
  likes: number;
  liked: boolean;
  comment: string;
  comments: { user: string; avatar: string; text: string; time: string }[];
};

const ALL_POSTS: Record<string, Post[]> = {
  smoking: [
    {
      id: 1, userId: 'youssef-al-mansoor', user: 'Youssef Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      streak: 90, action: 'celebrated 90 Smoke-Free Days 🎉', time: '18m ago', likes: 42, liked: false,
      comment: '90 days clean today! No more nicotine cravings, my lungs feel incredible and I have so much more energy. If I can do it, so can you! 🚭💪',
      comments: [
        { user: 'Sarah Miller', avatar: 'S', text: 'Incredible achievement! So proud of you 🙌', time: '12m ago' },
        { user: 'Karim Benali', avatar: 'K', text: 'You\'re an inspiration to all of us!', time: '8m ago' },
      ],
    },
    {
      id: 6, userId: 'youssef-al-mansoor', user: 'Youssef Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      streak: 84, action: 'shared a tip 💡', time: '3d ago', likes: 28, liked: false,
      comment: 'Pro tip: When cravings hit, do 20 push-ups immediately. The blood flow and endorphins kill the urge every time. Saved me dozens of times!',
      comments: [],
    },
  ],
  nofap: [
    {
      id: 3, userId: 'malik-vance', user: 'Malik Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      streak: 45, action: 'reached 45-Day Reboot Milestone', time: '2h ago', likes: 56, liked: false,
      comment: 'Halfway to 90 days! Mental clarity is at an all-time high, confidence is sky-rocketing, and brain fog is gone. Stay disciplined brothers! 🛡️',
      comments: [
        { user: 'Youssef Al-Mansoor', avatar: 'Y', text: 'Keep pushing! The best is yet to come 💪', time: '1h ago' },
      ],
    },
  ],
  prayers: [
    {
      id: 2, userId: 'tariq-hilal', user: 'Tariq Hilal',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      streak: 30, action: 'completed 📖 Surah Al-Kahf & Fajr in Jamaah', time: '45m ago', likes: 38, liked: true,
      comment: 'Woke up for Fajr at the mosque and completed my daily Quran portion. Starting Friday with peace and barakah. 🤲✨',
      comments: [],
    },
  ],
  sports: [
    {
      id: 4, userId: 'sarah-miller', user: 'Sarah Miller',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      streak: 28, action: 'completed 🏋️ Gym - Heavy Leg Day (60 min)', time: '3h ago', likes: 19, liked: false,
      comment: 'Hit a new PR on deadlifts today! Consistency beats motivation every single time 💪',
      comments: [
        { user: 'Karim Benali', avatar: 'K', text: 'Beast mode! 🔥', time: '2h ago' },
      ],
    },
  ],
  learning: [
    {
      id: 5, userId: 'karim-benali', user: 'Karim Benali',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      streak: 42, action: 'completed 📚 Read 20 pages (Machine Learning)', time: '5h ago', likes: 24, liked: true,
      comment: 'Finished chapter 4 on neural network architectures 🧠✨',
      comments: [],
    },
  ],
  morning: [],
};

/* ── Helpers ── */
const MEMBER_PREVIEWS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
];

export default function SubCommunityPage() {
  const params = useParams();
  const subId = params.subId as string;
  const community = SUB_COMMUNITIES[subId];
  const [joined, setJoined] = useState(true);
  const [posts, setPosts] = useState<Post[]>(ALL_POSTS[subId] || []);
  const [newPost, setNewPost] = useState('');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');

  if (!community) {
    return (
      <div className="app">
        <main style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <h1 style={{ fontSize: '1.5rem' }}>Community not found</h1>
          <p style={{ color: 'var(--mute)', marginBottom: '20px' }}>This sub-community doesn't exist.</p>
          <Link href="/community" className="btn g" style={{ textDecoration: 'none' }}>← Back to Community</Link>
        </main>
      </div>
    );
  }

  const toggleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      return p;
    }));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now(), userId: 'wassim-mahdjoubi', user: 'Wassim Mahdjoubi', avatar: 'W',
      streak: 12, action: 'posted an update', time: 'Just now',
      likes: 0, liked: false, comment: newPost, comments: [],
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="app">
      <main>
        <div className="crumb" style={{ marginBottom: '16px' }}>
          <Link href="/community" style={{ color: 'var(--mute)', textDecoration: 'none' }}>Community</Link>
          {' › '}
          <span style={{ color: 'var(--ink)' }}>{community.sub}</span>
        </div>

        {/* ── Community Banner ── */}
        <div className="sub-hero" style={{ background: community.banner }}>
          <div className="sub-hero-content">
            <span className="sub-hero-icon">{community.icon}</span>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: '1.8rem', color: '#fff' }}>{community.name}</h1>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{community.sub} • {community.members} members</div>
            </div>
            <button
              className={`btn ${joined ? '' : 'g'}`}
              onClick={() => setJoined(!joined)}
              style={{ marginLeft: 'auto', padding: '10px 24px', fontSize: '0.9rem' }}
            >
              {joined ? '✓ Joined' : '＋ Join'}
            </button>
          </div>
          <p style={{ margin: '14px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5, maxWidth: '600px' }}>
            {community.desc}
          </p>
          {/* Member preview stack */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px' }}>
            <div style={{ display: 'flex' }}>
              {MEMBER_PREVIEWS.map((av, i) => (
                <img key={i} src={av} alt="" style={{
                  width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover',
                  border: '2px solid #111', marginLeft: i > 0 ? '-8px' : 0, position: 'relative', zIndex: 4 - i,
                }} />
              ))}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>and {community.members} others</span>
          </div>
        </div>

        {/* ── Sort Tabs ── */}
        <div className="feed-sort-tabs">
          <button className={`feed-sort-tab ${sortBy === 'hot' ? 'active' : ''}`} onClick={() => setSortBy('hot')}>🔥 Hot</button>
          <button className={`feed-sort-tab ${sortBy === 'new' ? 'active' : ''}`} onClick={() => setSortBy('new')}>🆕 New</button>
          <button className={`feed-sort-tab ${sortBy === 'top' ? 'active' : ''}`} onClick={() => setSortBy('top')}>⭐ Top</button>
        </div>

        {/* ── Create Post ── */}
        <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="av" style={{ width: '40px', height: '40px' }}>W</div>
            <input
              type="text"
              className="settings-input"
              placeholder={`Share your progress in ${community.sub}...`}
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePost()}
              style={{ flex: 1 }}
            />
            <button className="btn g" onClick={handlePost}>Post ✨</button>
          </div>
        </div>

        {/* ── Feed ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--mute)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{community.icon}</div>
              <h3 style={{ margin: '0 0 6px' }}>No posts yet</h3>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>Be the first to share your progress in {community.name}!</p>
            </div>
          ) : (
            posts.map(p => {
              const isAnonymous = subId === 'nofap';
              const displayName = isAnonymous ? 'Anonymous Member' : p.user;
              const displayAvatar = isAnonymous ? '🛡️' : p.avatar;

              return (
                <div key={p.id} className="feed-post-card card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {isAnonymous ? (
                      <div className="av" style={{ width: '44px', height: '44px', fontSize: '1.2rem', background: 'rgba(139, 108, 199, 0.2)', border: '1px solid rgba(139, 108, 199, 0.4)' }}>
                        {displayAvatar}
                      </div>
                    ) : (
                      <Link href={`/community/profile/${p.userId}`} className="feed-avatar-link">
                        {p.avatar.startsWith('http') ? (
                          <img src={p.avatar} alt={p.user} className="feed-avatar-img" />
                        ) : (
                          <div className="av" style={{ width: '44px', height: '44px', fontSize: '1.1rem' }}>{p.avatar}</div>
                        )}
                      </Link>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {isAnonymous ? (
                          <span className="feed-username" style={{ cursor: 'default', color: 'var(--ink)' }}>
                            {displayName} <span style={{ fontSize: '0.72rem', background: 'rgba(139,108,199,0.15)', color: 'var(--mint)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>🔒 Anonymous</span>
                          </span>
                        ) : (
                          <Link href={`/community/profile/${p.userId}`} className="feed-username">{p.user}</Link>
                        )}
                        <span className="feed-streak-badge">🔥 {p.streak}d</span>
                      </div>
                      <small style={{ color: 'var(--mute)', fontSize: '0.8rem' }}>{p.action} • {p.time}</small>
                    </div>
                  </div>

                  <p style={{ margin: '0 0 14px', fontSize: '0.92rem', lineHeight: 1.5 }}>{p.comment}</p>

                  <div className="feed-actions-bar">
                    <button
                      className={`feed-action-btn ${p.liked ? 'liked' : ''}`}
                      onClick={() => toggleLike(p.id)}
                    >
                      {p.liked ? '❤️' : '🤍'} {p.likes}
                    </button>
                    <button className="feed-action-btn">💬 {p.comments.length}</button>
                    <button className="feed-action-btn" style={{ marginLeft: 'auto' }}>🔗 Share</button>
                  </div>

                  {/* Comment preview */}
                  {p.comments.length > 0 && (
                    <div className="feed-comments-preview">
                      {p.comments.slice(0, 2).map((c, i) => {
                        const isCommentAnon = isAnonymous;
                        return (
                          <div key={i} className="feed-comment-row">
                            <div className="av" style={{ width: '26px', height: '26px', fontSize: '0.7rem', background: isCommentAnon ? 'rgba(139, 108, 199, 0.2)' : undefined }}>
                              {isCommentAnon ? '🛡️' : c.avatar}
                            </div>
                            <div>
                              <b style={{ fontSize: '0.8rem', cursor: isCommentAnon ? 'default' : 'pointer' }}>{isCommentAnon ? 'Anonymous Member' : c.user}</b>
                              <span style={{ fontSize: '0.82rem', color: 'var(--ink)', marginLeft: '6px' }}>{c.text}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--mute)', marginLeft: '8px' }}>{c.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Community Rules ── */}
        <div className="card" style={{ marginTop: '24px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>📋 Community Rules</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {community.rules.map((rule, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', background: 'var(--mint)',
                  color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0
                }}>{i + 1}</span>
                {rule}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
