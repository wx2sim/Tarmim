"use client";

import React, { useState } from 'react';
import Link from 'next/link';

type SubCommunity = {
  id: string;
  name: string;
  sub: string;
  icon: string;
  members: string;
  desc: string;
};

const SUB_COMMUNITIES: SubCommunity[] = [
  { id: 'all', name: 'All Feed', sub: 'r/All', icon: '🌐', members: '48.5k', desc: 'All habit posts and community milestones' },
  { id: 'smoking', name: 'Smoking Quitters', sub: 'r/QuitSmoking', icon: '🚭', members: '12.4k', desc: 'Support & streak counters for quitting smoking' },
  { id: 'nofap', name: 'No Fap & Reboot', sub: 'r/NoFap', icon: '🛡️', members: '18.9k', desc: 'Self-mastery & daily reset counters' },
  { id: 'morning', name: 'Morning Rituals', sub: 'r/MorningRoutine', icon: '🌅', members: '9.2k', desc: '5 AM club, morning walks & hydration' },
  { id: 'prayers', name: 'Prayers & Quran', sub: 'r/PrayersQuran', icon: '📖', members: '15.6k', desc: 'Fajr, Daily Salah & Quran recitation goals' },
  { id: 'sports', name: 'Sports & Gym', sub: 'r/Fitness', icon: '🏋️', members: '24.1k', desc: 'Workout check-ins, gym, jogging & yoga' },
  { id: 'learning', name: 'Learning & Growth', sub: 'r/ContinuousLearning', icon: '📚', members: '11.8k', desc: 'Languages, coding, reading & skill building' },
];

type HelpContent = {
  title: string;
  icon: string;
  intro: string;
  strategies: { emoji: string; title: string; desc: string }[];
  affirmation: string;
  hotline?: string;
};

const HELP_CONTENT: Record<string, HelpContent> = {
  all: {
    title: 'General Support',
    icon: '💚',
    intro: 'You\'re not alone on this journey. Every habit you build is a step toward the person you want to become.',
    strategies: [
      { emoji: '🎯', title: 'Set Micro-Goals', desc: 'Break your habits into the smallest possible actions. Instead of "work out 1 hour," start with "put on gym shoes." Small wins build momentum.' },
      { emoji: '📊', title: 'Track Everything', desc: 'What gets measured gets managed. Use your streak counter daily — seeing your progress visually rewires your brain for consistency.' },
      { emoji: '🤝', title: 'Find Your People', desc: 'Join a sub-community here. Accountability partners make you 65% more likely to achieve your goals.' },
      { emoji: '🧘', title: 'Practice Self-Compassion', desc: 'If you break a streak, don\'t spiral. One missed day doesn\'t erase your progress. Reset and keep going — that\'s the real strength.' },
    ],
    affirmation: 'You are stronger than your urges. Every day you show up is proof that you\'re becoming who you were meant to be. 💪',
  },
  smoking: {
    title: 'Quit Smoking Support',
    icon: '🚭',
    intro: 'Quitting smoking is one of the hardest things you\'ll ever do — and one of the most rewarding. Your body starts healing within 20 minutes of your last cigarette.',
    strategies: [
      { emoji: '⏱️', title: 'The 5-Minute Rule', desc: 'Cravings only last 3-5 minutes. When one hits, set a timer, do 20 push-ups, drink cold water, or chew gum. The wave will pass.' },
      { emoji: '🧠', title: 'Rewire Your Triggers', desc: 'Identify when you crave most (after meals, with coffee, stress). Replace the cigarette with a new ritual — deep breaths, a walk, or mints.' },
      { emoji: '💰', title: 'Count Your Savings', desc: 'At $10/pack, quitting saves you $3,650/year. Put that money in a jar and watch it grow. Reward yourself at milestones.' },
      { emoji: '🫁', title: 'Track Your Health Gains', desc: '24h: CO levels normalize. 48h: Taste & smell return. 2 weeks: Circulation improves. 1 month: Lung function increases 30%. 1 year: Heart disease risk drops 50%.' },
      { emoji: '🛡️', title: 'Use Nicotine Replacement', desc: 'Patches, gums, or lozenges can double your success rate. Consult a doctor for the right approach for you.' },
    ],
    affirmation: 'Every smoke-free hour is your lungs healing, your blood cleaning, your life extending. You are literally choosing life right now. 🌱',
    hotline: 'Quitline: 1-800-QUIT-NOW',
  },
  nofap: {
    title: 'Reboot & Self-Mastery',
    icon: '🛡️',
    intro: 'This journey is about reclaiming control over your mind and body. The discomfort you feel is your brain rewiring — it\'s a sign of healing.',
    strategies: [
      { emoji: '🚿', title: 'Cold Showers', desc: 'When urges hit, take a cold shower immediately. It shocks your nervous system, kills the urge, and builds mental toughness. Start with 30 seconds.' },
      { emoji: '🏋️', title: 'Channel the Energy', desc: 'Redirect that energy into intense exercise. Your body is producing extra testosterone — use it to build muscle, run faster, push harder.' },
      { emoji: '📵', title: 'Digital Boundaries', desc: 'Install content blockers. Unfollow triggering accounts. Keep your phone out of the bedroom. The environment matters more than willpower.' },
      { emoji: '📓', title: 'Journal Your Triggers', desc: 'Write down exactly what triggered each urge: boredom? loneliness? stress? Once you name it, you can address the root cause instead.' },
      { emoji: '🧠', title: 'Understand the Flatline', desc: 'Days 7-30 often feel like a flatline — low energy, low motivation. This is normal. Your dopamine receptors are healing. Push through.' },
    ],
    affirmation: 'You are not your urges. You are the one who observes them and chooses differently. That choice is your power. ⚡',
  },
  morning: {
    title: 'Morning Routine Mastery',
    icon: '🌅',
    intro: 'How you start your morning determines how you live your day. Build a routine that energizes you and sets the tone for everything that follows.',
    strategies: [
      { emoji: '⏰', title: 'Sleep Earlier, Not Just Wake Earlier', desc: 'Move your bedtime back 15 minutes each week. A 5 AM wake-up only works if you slept at 9-10 PM. Quality sleep is non-negotiable.' },
      { emoji: '💧', title: 'Hydrate First', desc: 'Drink 500ml of water within 5 minutes of waking. Your body is dehydrated after 8 hours — water kickstarts your metabolism and clears brain fog.' },
      { emoji: '📱', title: 'No Phone for 30 Minutes', desc: 'Don\'t check your phone first thing. Your morning belongs to you, not to notifications, news, or social media.' },
      { emoji: '☀️', title: 'Get Sunlight Immediately', desc: '10 minutes of morning sunlight resets your circadian rhythm, boosts cortisol (the good kind), and improves mood for the entire day.' },
    ],
    affirmation: 'While others sleep, you\'re building. Every early morning is compound interest on your future self. 🌅',
  },
  prayers: {
    title: 'Prayer & Quran Consistency',
    icon: '📖',
    intro: 'Consistency in worship is more beloved than bursts of devotion. The Prophet ﷺ said: "The most beloved deed to Allah is the most regular one even if it were little."',
    strategies: [
      { emoji: '🕌', title: 'Start with Fajr', desc: 'If you can conquer Fajr, you can conquer anything. Set 2 alarms, do wudu before sleeping, and place your alarm across the room.' },
      { emoji: '📖', title: 'Just One Page', desc: 'On hard days, open the Quran and read just one page. Consistency matters more than quantity. One page daily = finished Quran in 600 days.' },
      { emoji: '🤲', title: 'Pray On Time', desc: 'Set prayer alerts. When the adhan sounds, stop everything. Treat it like a meeting with the King of kings — because it is.' },
      { emoji: '💚', title: 'Find a Prayer Buddy', desc: 'Pray in jamaah whenever possible. Having someone to text "Fajr?" at 4:30 AM makes all the difference.' },
    ],
    affirmation: 'Every sajdah is a conversation with your Creator. He is closer to you than your jugular vein. Keep turning to Him. 🤲',
  },
  sports: {
    title: 'Fitness & Training Support',
    icon: '🏋️',
    intro: 'Your body is capable of far more than your mind tells you. Show up consistently and the results will follow.',
    strategies: [
      { emoji: '📋', title: 'Follow a Program', desc: 'Stop random workouts. Pick a proven program (Starting Strength, PPL, 5/3/1) and stick with it for 12 weeks minimum. Structure beats motivation.' },
      { emoji: '🍽️', title: 'Nutrition is 80%', desc: 'You can\'t out-train a bad diet. Track protein (1g per lb bodyweight), eat whole foods, and stay hydrated. Abs are built in the kitchen.' },
      { emoji: '😴', title: 'Prioritize Recovery', desc: '7-9 hours of sleep. Rest days are growth days. Your muscles don\'t grow in the gym — they grow while you recover.' },
      { emoji: '📈', title: 'Progressive Overload', desc: 'Add a little more each week: 2.5kg on the bar, one more rep, 5 seconds less rest. Small increments create massive transformations.' },
    ],
    affirmation: 'The pain of discipline weighs ounces. The pain of regret weighs tons. Keep showing up — future you is watching. 💪',
  },
  learning: {
    title: 'Learning & Growth Support',
    icon: '📚',
    intro: 'The brain is a muscle. The more you learn, the easier learning becomes. Consistency compounds — 20 minutes daily beats 3 hours once a week.',
    strategies: [
      { emoji: '🍅', title: 'Pomodoro Technique', desc: '25 minutes of focused work, 5-minute break. After 4 rounds, take a longer break. This trains your attention span over time.' },
      { emoji: '✍️', title: 'Teach What You Learn', desc: 'The best way to learn is to explain it to someone else. Write posts here about what you studied — it forces deep understanding.' },
      { emoji: '📱', title: 'Block Distractions', desc: 'Use apps like Forest or Cold Turkey. Put your phone in another room. 30 minutes of deep focus beats 3 hours of distracted "studying."' },
      { emoji: '🔁', title: 'Spaced Repetition', desc: 'Review material at increasing intervals (1 day, 3 days, 7 days, 30 days). Apps like Anki automate this. You\'ll remember forever.' },
    ],
    affirmation: 'Every page you read, every concept you grasp, is a brick in the cathedral of your mind. Keep building. 🧠',
  },
};

type FeedPost = {
  id: number;
  subId: string;
  subName: string;
  userId: string;
  user: string;
  avatar: string;
  streak: number;
  action: string;
  time: string;
  likes: number;
  liked: boolean;
  comment: string;
  comments: { userId: string; user: string; avatar: string; text: string; time: string }[];
  cheers: number;
  cheered: boolean;
};

const COMMUNITY_POSTS: FeedPost[] = [
  {
    id: 1,
    subId: 'smoking',
    subName: 'r/QuitSmoking',
    userId: 'youssef-al-mansoor',
    user: 'Youssef Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    streak: 90,
    action: 'celebrated 90 Smoke-Free Days 🎉',
    time: '18m ago',
    likes: 42,
    liked: false,
    comment: '90 days clean today! No more nicotine cravings, my lungs feel incredible and I have so much more energy. If I can do it, so can you! 🚭💪',
    comments: [
      { userId: 'sarah-miller', user: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80', text: 'Incredible achievement! So proud of you 🙌', time: '12m ago' },
      { userId: 'karim-benali', user: 'Karim Benali', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80', text: 'You\'re an inspiration to all of us!', time: '8m ago' },
      { userId: 'tariq-hilal', user: 'Tariq Hilal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80', text: 'MashAllah brother, keep going! 💪', time: '5m ago' },
    ],
    cheers: 15,
    cheered: false,
  },
  {
    id: 2,
    subId: 'prayers',
    subName: 'r/PrayersQuran',
    userId: 'tariq-hilal',
    user: 'Tariq Hilal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    streak: 30,
    action: 'completed 📖 Surah Al-Kahf & Fajr in Jamaah',
    time: '45m ago',
    likes: 38,
    liked: true,
    comment: 'Woke up for Fajr at the mosque and completed my daily Quran portion. Starting Friday with peace and barakah. 🤲✨',
    comments: [
      { userId: 'youssef-al-mansoor', user: 'Youssef Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80', text: 'Barakallahu feek akhi!', time: '30m ago' },
    ],
    cheers: 8,
    cheered: true,
  },
  {
    id: 3,
    subId: 'nofap',
    subName: 'r/NoFap',
    userId: 'malik-vance',
    user: 'Malik Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    streak: 45,
    action: 'reached 45-Day Reboot Milestone',
    time: '2h ago',
    likes: 56,
    liked: false,
    comment: 'Halfway to 90 days! Mental clarity is at an all-time high, confidence is sky-rocketing, and brain fog is gone. Stay disciplined brothers! 🛡️',
    comments: [
      { userId: 'youssef-al-mansoor', user: 'Youssef Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80', text: 'Keep pushing! The best is yet to come 💪', time: '1h ago' },
    ],
    cheers: 22,
    cheered: false,
  },
  {
    id: 4,
    subId: 'sports',
    subName: 'r/Fitness',
    userId: 'sarah-miller',
    user: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    streak: 28,
    action: 'completed 🏋️ Gym - Heavy Leg Day (60 min)',
    time: '3h ago',
    likes: 19,
    liked: false,
    comment: 'Hit a new PR on deadlifts today! Consistency beats motivation every single time 💪',
    comments: [
      { userId: 'karim-benali', user: 'Karim Benali', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80', text: 'Beast mode! 🔥', time: '2h ago' },
    ],
    cheers: 6,
    cheered: false,
  },
  {
    id: 5,
    subId: 'learning',
    subName: 'r/ContinuousLearning',
    userId: 'karim-benali',
    user: 'Karim Benali',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    streak: 42,
    action: 'completed 📚 Read 20 pages (Machine Learning)',
    time: '5h ago',
    likes: 24,
    liked: true,
    comment: 'Finished chapter 4 on neural network architectures. The math behind backpropagation finally clicked today! 🧠✨',
    comments: [],
    cheers: 10,
    cheered: false,
  },
  {
    id: 7,
    subId: 'morning',
    subName: 'r/MorningRoutine',
    userId: 'sarah-miller',
    user: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    streak: 28,
    action: 'completed 🌅 Morning Jog (30 min)',
    time: '7h ago',
    likes: 14,
    liked: false,
    comment: 'Watched the sunrise while running. There\'s no better way to start the day. 5:30 AM club 🌅🏃‍♀️',
    comments: [],
    cheers: 4,
    cheered: false,
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Youssef Al-Mansoor', userId: 'youssef-al-mansoor', streak: 90, points: 2150, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Karim Benali', userId: 'karim-benali', streak: 42, points: 1450, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Wassim Mahdjoubi', userId: '', streak: 12, points: 1280, avatar: 'W', isUser: true },
  { rank: 4, name: 'Sarah Miller', userId: 'sarah-miller', streak: 28, points: 1120, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Tariq Hilal', userId: 'tariq-hilal', streak: 30, points: 980, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
];

export default function CommunityPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [newPost, setNewPost] = useState('');
  const [joinedSubs, setJoinedSubs] = useState<Record<string, boolean>>({ smoking: true, prayers: true, sports: true });
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [helpOpen, setHelpOpen] = useState(false);

  const helpContent = HELP_CONTENT[activeSub] || HELP_CONTENT.all;

  const currentSub = SUB_COMMUNITIES.find(s => s.id === activeSub) || SUB_COMMUNITIES[0];

  const filteredPosts = activeSub === 'all'
    ? posts
    : posts.filter(p => p.subId === activeSub);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'top') return b.likes - a.likes;
    if (sortBy === 'new') return b.id - a.id;
    return (b.likes + b.cheers * 2) - (a.likes + a.cheers * 2); // hot = likes + weighted cheers
  });

  const toggleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      return p;
    }));
  };

  const toggleCheer = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) return { ...p, cheered: !p.cheered, cheers: p.cheered ? p.cheers - 1 : p.cheers + 1 };
      return p;
    }));
  };

  const toggleJoinSub = (subId: string) => {
    setJoinedSubs(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, {
            userId: 'wassim', user: 'Wassim Mahdjoubi', avatar: 'W', text, time: 'Just now',
          }],
        };
      }
      return p;
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    const post: FeedPost = {
      id: Date.now(),
      subId: activeSub === 'all' ? 'sports' : activeSub,
      subName: currentSub.sub,
      userId: 'wassim',
      user: 'Wassim Mahdjoubi',
      avatar: 'W',
      streak: 12,
      action: 'shared an update',
      time: 'Just now',
      likes: 0,
      liked: false,
      comment: newPost,
      comments: [],
      cheers: 0,
      cheered: false,
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="app">
      <main>
        <div className="head">
          <div>
            <div className="crumb">Home › Community › {currentSub.sub}</div>
            <h1>Community Feed</h1>
          </div>
          <div className="acts">
            <button className="btn g">🔥 12-Day Streak Active</button>
          </div>
        </div>

        {/* ─── Reddit-Style Sub-Communities Horizontal Scroll Bar ─── */}
        <div className="sub-communities-wrapper">
          <div className="sub-communities-scroll">
            {SUB_COMMUNITIES.map(sub => (
              <button
                key={sub.id}
                className={`sub-community-pill ${activeSub === sub.id ? 'active' : ''}`}
                onClick={() => setActiveSub(sub.id)}
              >
                <span className="sub-pill-icon">{sub.icon}</span>
                <div className="sub-pill-text">
                  <div className="sub-pill-name">{sub.name}</div>
                  <span className="sub-pill-count">{sub.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Sub Banner Info – clicking opens the sub page */}
        {activeSub !== 'all' && (
          <Link href={`/community/sub/${activeSub}`} className="active-sub-banner card" style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '32px' }}>{currentSub.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 2px', fontSize: '1.05rem' }}>{currentSub.name} <span style={{ fontSize: '0.8rem', color: 'var(--mint)' }}>{currentSub.sub}</span></h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--mute)' }}>{currentSub.desc} • <b>{currentSub.members}</b> members</p>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--mint)', fontWeight: 600 }}>View →</span>
            </div>
          </Link>
        )}

        {/* Sort Tabs */}
        <div className="feed-sort-tabs">
          <button className={`feed-sort-tab ${sortBy === 'hot' ? 'active' : ''}`} onClick={() => setSortBy('hot')}>🔥 Hot</button>
          <button className={`feed-sort-tab ${sortBy === 'new' ? 'active' : ''}`} onClick={() => setSortBy('new')}>🆕 New</button>
          <button className={`feed-sort-tab ${sortBy === 'top' ? 'active' : ''}`} onClick={() => setSortBy('top')}>⭐ Top</button>
        </div>

        {/* Create Post Box */}
        <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="av" style={{ width: '40px', height: '40px' }}>W</div>
            <input
              type="text"
              className="settings-input"
              placeholder={`Share your progress in ${currentSub.sub}...`}
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreatePost()}
              style={{ flex: 1 }}
            />
            <button className="btn g" onClick={handleCreatePost}>Post ✨</button>
          </div>
        </div>

        {/* ─── Feed Posts ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedPosts.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--mute)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{currentSub.icon}</div>
              <h3 style={{ margin: '0 0 6px' }}>No posts yet</h3>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>Be the first to share your progress!</p>
            </div>
          ) : (
            sortedPosts.map(p => {
              const isAnonymous = p.subId === 'nofap';
              const displayName = isAnonymous ? 'Anonymous Member' : p.user;
              const displayAvatar = isAnonymous ? '🛡️' : p.avatar;

              return (
                <div key={p.id} className="feed-post-card card" style={{ padding: '0' }}>
                  {/* Post Header */}
                  <div className="feed-post-header">
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {isAnonymous ? (
                          <span className="feed-username" style={{ cursor: 'default', color: 'var(--ink)' }}>
                            {displayName} <span style={{ fontSize: '0.72rem', background: 'rgba(139,108,199,0.15)', color: 'var(--mint)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>🔒 Anonymous</span>
                          </span>
                        ) : (
                          <Link href={`/community/profile/${p.userId}`} className="feed-username">{p.user}</Link>
                        )}
                        <Link href={`/community/sub/${p.subId}`} className="feed-sub-link">
                          {p.subName}
                        </Link>
                        <span className="feed-streak-badge">🔥 {p.streak}d</span>
                      </div>
                      <small style={{ color: 'var(--mute)', fontSize: '0.8rem' }}>{p.action} • {p.time}</small>
                    </div>
                  </div>

                  {/* Post Body */}
                  <div className="feed-post-body">
                    <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.6 }}>
                      {p.comment}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="feed-actions-bar">
                    <button
                      className={`feed-action-btn ${p.liked ? 'liked' : ''}`}
                      onClick={() => toggleLike(p.id)}
                    >
                      {p.liked ? '❤️' : '🤍'} {p.likes}
                    </button>
                    <button
                      className={`feed-action-btn ${expandedComments[p.id] ? 'active' : ''}`}
                      onClick={() => toggleComments(p.id)}
                    >
                      💬 {p.comments.length}
                    </button>
                    <button
                      className={`feed-action-btn ${p.cheered ? 'cheered' : ''}`}
                      onClick={() => toggleCheer(p.id)}
                    >
                      👏 {p.cheers}
                    </button>
                    <button className="feed-action-btn" style={{ marginLeft: 'auto' }}>
                      🔗
                    </button>
                  </div>

                  {/* Comments Section (expandable) */}
                  {expandedComments[p.id] && (
                    <div className="feed-comments-section">
                      {p.comments.map((c, i) => {
                        const isCommentAnon = isAnonymous || c.userId === 'anonymous';
                        const cName = isCommentAnon ? 'Anonymous Member' : c.user;
                        const cAvatar = isCommentAnon ? '🛡️' : c.avatar;
                        return (
                          <div key={i} className="feed-comment-row">
                            {isCommentAnon ? (
                              <div className="av" style={{ width: '28px', height: '28px', fontSize: '0.8rem', background: 'rgba(139, 108, 199, 0.2)' }}>
                                {cAvatar}
                              </div>
                            ) : (
                              <Link href={`/community/profile/${c.userId}`} className="feed-avatar-link">
                                {c.avatar.startsWith('http') ? (
                                  <img src={c.avatar} alt={c.user} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <div className="av" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>{c.avatar}</div>
                                )}
                              </Link>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {isCommentAnon ? (
                                <b className="feed-comment-username" style={{ cursor: 'default', color: 'var(--ink)' }}>{cName}</b>
                              ) : (
                                <Link href={`/community/profile/${c.userId}`} className="feed-comment-username">{c.user}</Link>
                              )}
                              <span style={{ fontSize: '0.84rem', color: 'var(--ink)' }}> {c.text}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--mute)', marginLeft: '8px' }}>{c.time}</span>
                            </div>
                          </div>
                        );
                      })}
                      {/* Add Comment Input */}
                      <div className="feed-comment-input-row">
                        <div className="av" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>W</div>
                        <input
                          type="text"
                          className="feed-comment-input"
                          placeholder="Write a comment..."
                          value={commentInputs[p.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && handleAddComment(p.id)}
                        />
                        <button
                          className="feed-comment-send"
                          onClick={() => handleAddComment(p.id)}
                        >
                          →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ─── Sidebar ─── */}
      <aside className="side">
        {/* ── Get Help CTA ── */}
        <button className="get-help-card" onClick={() => setHelpOpen(true)}>
          <div className="get-help-glow" />
          <span className="get-help-icon">{helpContent.icon}</span>
          <div className="get-help-text">
            <span className="get-help-title">Get Help</span>
            <span className="get-help-sub">{activeSub !== 'all' ? helpContent.title : 'Strategies & Support'}</span>
          </div>
          <span className="get-help-arrow">→</span>
        </button>

        <div>
          <div className="mute">Explore Communities</div>
          <h2>r/Sub-Communities</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', marginBottom: '24px' }}>
          {SUB_COMMUNITIES.slice(1).map(sub => (
            <Link
              key={sub.id}
              href={`/community/sub/${sub.id}`}
              className="card feed-sidebar-sub"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: activeSub === sub.id ? 'var(--mint-s)' : undefined,
                border: activeSub === sub.id ? '1px solid var(--mint)' : undefined
              }}
            >
              <span style={{ fontSize: '20px' }}>{sub.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{sub.name}</div>
                <small style={{ color: 'var(--mute)', fontSize: '0.75rem' }}>{sub.sub} • {sub.members}</small>
              </div>
              <button
                className={`btn ${joinedSubs[sub.id] ? '' : 'g'}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleJoinSub(sub.id); }}
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
              >
                {joinedSubs[sub.id] ? '✓' : '＋'}
              </button>
            </Link>
          ))}
        </div>

        <div>
          <div className="mute">Weekly Rankings</div>
          <h2>🏆 Top Performers</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
          {LEADERBOARD.map(u => (
            <Link
              key={u.rank}
              href={u.userId ? `/community/profile/${u.userId}` : '#'}
              className="card feed-sidebar-user"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: u.isUser ? 'var(--mint-s)' : undefined,
                border: u.isUser ? '1px solid var(--mint)' : undefined,
                cursor: u.userId ? 'pointer' : 'default',
              }}
            >
              <span className="stat-rank" style={{ background: u.rank === 1 ? '#eab308' : u.rank === 2 ? 'var(--mint)' : 'var(--grey)' }}>
                {u.rank}
              </span>

              {u.avatar.startsWith('http') ? (
                <img src={u.avatar} alt={u.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div className="av" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>{u.avatar}</div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '600', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name} {u.isUser && '(You)'}
                </div>
                <small style={{ color: 'var(--mute)', fontSize: '0.75rem' }}>🔥 {u.streak}d streak</small>
              </div>

              <b style={{ fontSize: '0.85rem', color: 'var(--mint)' }}>{u.points} pts</b>
            </Link>
          ))}
        </div>
      </aside>
      {/* ─── Help Modal ─── */}
      {helpOpen && (
        <div className="modal-overlay" onClick={() => setHelpOpen(false)}>
          <div className="modal-box help-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{helpContent.icon}</span>
                {helpContent.title}
              </h2>
              <button className="modal-close" onClick={() => setHelpOpen(false)}>✕</button>
            </div>

            {/* Intro */}
            <div className="help-intro-card">
              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
                {helpContent.intro}
              </p>
            </div>

            {/* Strategies */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🗺️ Strategies That Work
              </h3>
              <div className="help-strategies-list">
                {helpContent.strategies.map((s, i) => (
                  <div key={i} className="help-strategy-card">
                    <span className="help-strategy-emoji">{s.emoji}</span>
                    <div>
                      <div className="help-strategy-title">{s.title}</div>
                      <p className="help-strategy-desc">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Affirmation */}
            <div className="help-affirmation-card">
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>✨</div>
              <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.6 }}>
                {helpContent.affirmation}
              </p>
            </div>

            {/* Hotline */}
            {helpContent.hotline && (
              <div className="help-hotline">
                📞 {helpContent.hotline}
              </div>
            )}

            <button className="btn g" onClick={() => setHelpOpen(false)} style={{ width: '100%', padding: '14px', marginTop: '16px', fontSize: '0.95rem' }}>
              I Got This 💪
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
