"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/habits', label: 'Habits', icon: '✅' },
  { href: '/stats', label: 'Stats', icon: '📊' },
  { href: '/community', label: 'Community', icon: '👥' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

type Notification = {
  id: string;
  avatar: string;
  user: string;
  text: string;
  time: string;
  read: boolean;
  type: 'like' | 'streak' | 'reward' | 'freeze';
};

const initialNotifications: Notification[] = [
  {
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    user: 'Sarah M.',
    text: 'liked your 🏋️ Gym habit check-in',
    time: '5m ago',
    read: false,
    type: 'like',
  },
  {
    id: '2',
    avatar: '🏆',
    user: 'Tarmim',
    text: 'You reached Level 4 · Consistent status!',
    time: '2h ago',
    read: false,
    type: 'streak',
  },
  {
    id: '3',
    avatar: '💎',
    user: 'Streak Rewards',
    text: 'Claimed +25 Gems bonus for daily check-in',
    time: '5h ago',
    read: false,
    type: 'reward',
  },
  {
    id: '4',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    user: 'Karim B.',
    text: 'started following your habit streak!',
    time: '1d ago',
    read: true,
    type: 'like',
  },
  {
    id: '5',
    avatar: '🛡️',
    user: 'Streak Insurance',
    text: 'Streak Freeze automatically saved your flame',
    time: '2d ago',
    read: true,
    type: 'freeze',
  },
];

export default function Nav() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState({ name: 'Wassim Mahdjoubi', initial: 'W', email: 'wassim@example.com' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* Notification Menu state */
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setMounted(true);
    try {
      const savedProf = localStorage.getItem('tarmim_profile');
      if (savedProf) {
        const p = JSON.parse(savedProf);
        if (p.name) {
          setUserProfile({
            name: p.name,
            initial: p.name.charAt(0).toUpperCase(),
            email: p.email || 'wassim@example.com'
          });
        }
      }
      const savedPref = localStorage.getItem('tarmim_preferences');
      if (savedPref) {
        const pref = JSON.parse(savedPref);
        const root = document.documentElement;
        if (pref.primaryColor) {
          root.style.setProperty('--mint', pref.primaryColor);
          root.style.setProperty('--mint-s', pref.primaryColor + '22');
        }
        if (pref.secondaryColor) {
          root.style.setProperty('--teal', pref.secondaryColor);
          root.style.setProperty('--teal-d', pref.secondaryColor);
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('drawer-is-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('drawer-is-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('drawer-is-open');
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const toggleTheme = () => {
    const r = document.documentElement;
    const isDark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
    const nextTheme = isDark ? 'light' : 'dark';
    r.dataset.theme = nextTheme;
    try {
      const savedPref = JSON.parse(localStorage.getItem('tarmim_preferences') || '{}');
      savedPref.theme = nextTheme;
      localStorage.setItem('tarmim_preferences', JSON.stringify(savedPref));
    } catch (e) {}
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markSingleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <>
      <nav className="nav-bar-content">
        <div className="nav-left">
          <Link href="/" className="logo" style={{ textDecoration: 'none' }}>✿</Link>
          <div className="desktop-links">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`pill ${pathname === l.href ? 'on' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="nav-right">
          <div className={`search-box ${mobileSearchOpen ? 'mobile-search-expanded' : ''}`}>
            <span className="search-icon" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Notification Bell Dropdown */}
          <div className="notif-wrapper" ref={notifRef}>
            <button
              className={`pill notif-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label="Notifications"
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {/* Instagram-style Notification Menu */}
            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="notif-read-all" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="notif-list">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => markSingleRead(n.id)}
                    >
                      <div className="notif-avatar-wrap">
                        {n.avatar.startsWith('http') ? (
                          <img src={n.avatar} alt={n.user} className="notif-avatar-img" />
                        ) : (
                          <span className="notif-avatar-icon">{n.avatar}</span>
                        )}
                        {!n.read && <span className="notif-dot" />}
                      </div>

                      <div className="notif-body">
                        <div className="notif-text">
                          <b>{n.user}</b> {n.text}
                        </div>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="notif-footer">
                  <Link href="/community" onClick={() => setNotifOpen(false)} style={{ textDecoration: 'none', color: 'var(--mint)', fontWeight: 600 }}>
                    View Community Activity →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button className="pill theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            ◐
          </button>

          <Link href="/settings" className="av nav-avatar desktop-only" style={{ textDecoration: 'none' }}>
            {userProfile.initial}
          </Link>

          {/* Hamburger Menu Toggle for Mobile */}
          <button
            className="hamburger-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open mobile menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay Portaled directly to body */}
      {mounted && isDrawerOpen && createPortal(
        <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <aside className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-user-info">
                <div className="av drawer-av">{userProfile.initial}</div>
                <div>
                  <div className="drawer-user-name">{userProfile.name}</div>
                  <div className="drawer-user-email">{userProfile.email}</div>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsDrawerOpen(false)} aria-label="Close menu">
                ✕
              </button>
            </div>

            <div className="drawer-nav-links">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`drawer-link ${pathname === l.href ? 'active' : ''}`}
                  onClick={() => setIsDrawerOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <span className="drawer-link-icon">{l.icon}</span>
                  <span className="drawer-link-label">{l.label}</span>
                  {pathname === l.href && <span className="drawer-active-dot" />}
                </Link>
              ))}
            </div>

            <div className="drawer-footer">
              <button className="drawer-theme-btn" onClick={toggleTheme}>
                <span>◐ Switch Theme</span>
              </button>
              <div className="drawer-brand">Tarmim Tracker v1.0 ✿</div>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
