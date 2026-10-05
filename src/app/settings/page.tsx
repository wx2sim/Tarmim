"use client";

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Wassim Mahdjoubi',
    email: 'wassim@example.com',
    bio: 'Building better daily habits one day at a time 🚀',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    primaryColor: '#8b5cf6',
    secondaryColor: '#6c4fb0',
    palettePreset: 'default',
    firstDayOfWeek: 'monday',
    soundEffects: true,
    dailyReminders: true,
    reminderTime: '20:00',
    weeklySummary: true,
  });

  const [savedToast, setSavedToast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const PALETTES = [
    { id: 'default', name: 'Royal Purple', primary: '#8b5cf6', secondary: '#6c4fb0' },
    { id: 'emerald', name: 'Emerald Breeze', primary: '#10b981', secondary: '#059669' },
    { id: 'ocean', name: 'Oceanic Blue', primary: '#3b82f6', secondary: '#1d4ed8' },
    { id: 'rose', name: 'Sunset Rose', primary: '#f43f5e', secondary: '#be123c' },
    { id: 'amber', name: 'Golden Amber', primary: '#f59e0b', secondary: '#d97706' },
    { id: 'cyan', name: 'Neon Cyan', primary: '#06b6d4', secondary: '#0891b2' },
    { id: 'midnight', name: 'Cyber Neon', primary: '#a855f7', secondary: '#ec4899' },
  ];

  const updateRootColors = (primary: string, secondary: string) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--mint', primary);
      root.style.setProperty('--mint-s', primary + '22');
      root.style.setProperty('--teal', secondary);
      root.style.setProperty('--teal-d', secondary);
    }
  };

  useEffect(() => {
    const savedProf = localStorage.getItem('tarmim_profile');
    if (savedProf) {
      try { setProfile(JSON.parse(savedProf)); } catch (e) {}
    }
    const savedPref = localStorage.getItem('tarmim_preferences');
    if (savedPref) {
      try {
        const parsed = JSON.parse(savedPref);
        setPreferences(parsed);
        if (parsed.primaryColor && parsed.secondaryColor) {
          updateRootColors(parsed.primaryColor, parsed.secondaryColor);
        }
      } catch (e) {}
    }
  }, []);

  const handleApplyPalette = (primary: string, secondary: string, presetId: string = 'custom') => {
    const updated = {
      ...preferences,
      primaryColor: primary,
      secondaryColor: secondary,
      palettePreset: presetId,
    };
    setPreferences(updated);
    updateRootColors(primary, secondary);
    localStorage.setItem('tarmim_preferences', JSON.stringify(updated));
  };

  const handleThemeChange = (theme: string) => {
    const updated = { ...preferences, theme };
    setPreferences(updated);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('tarmim_preferences', JSON.stringify(updated));
  };

  const handleSave = () => {
    localStorage.setItem('tarmim_profile', JSON.stringify(profile));
    localStorage.setItem('tarmim_preferences', JSON.stringify(preferences));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetData = () => {
    localStorage.clear();
    setShowResetModal(false);
    alert('All local app data has been reset.');
    window.location.reload();
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ profile, preferences, timestamp: new Date() }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tarmim_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="app" style={{ gridTemplateColumns: '1fr' }}>
      <main>
        <div className="head">
          <div>
            <div className="crumb">Home › Settings</div>
            <h1>Settings</h1>
          </div>
          <div className="acts">
            <button className="btn g" onClick={handleSave}>
              💾 Save Settings
            </button>
          </div>
        </div>

        {savedToast && (
          <div className="settings-toast">
            ✨ Settings saved successfully!
          </div>
        )}

        <div className="settings-grid">
          {/* Profile Card */}
          <section className="card settings-card">
            <div className="settings-section-header">
              <h3>👤 Profile & Account</h3>
              <p>Manage your personal info and avatar</p>
            </div>

            <div className="profile-edit-layout">
              <div className="avatar-wrapper">
                <img src={profile.avatar} alt="Profile Avatar" className="profile-avatar-img" />
                <button
                  className="btn"
                  style={{ padding: '4px 10px', fontSize: '0.78rem', marginTop: '6px' }}
                  onClick={() => {
                    const url = prompt("Enter image URL for avatar:", profile.avatar);
                    if (url) setProfile({ ...profile, avatar: url });
                  }}
                >
                  📷 Change Avatar
                </button>
              </div>

              <div className="profile-fields">
                <div className="form-group">
                  <label className="field-label">Display Name</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    className="settings-input"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Bio / Headline</label>
                  <textarea
                    className="settings-input settings-textarea"
                    rows={2}
                    value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Preferences & Appearance */}
          <section className="card settings-card">
            <div className="settings-section-header">
              <h3>🎨 Appearance & Preferences</h3>
              <p>Customize the look and feel of Tarmim</p>
            </div>

            <div className="settings-list">
              {/* Theme Mode */}
              <div className="setting-row">
                <div>
                  <div className="setting-title">Theme Mode</div>
                  <div className="setting-subtitle">Choose your preferred visual mode</div>
                </div>
                <div className="theme-pills">
                  <button
                    className={`pill ${preferences.theme === 'dark' ? 'on' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    🌙 Dark
                  </button>
                  <button
                    className={`pill ${preferences.theme === 'light' ? 'on' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    ☀️ Light
                  </button>
                </div>
              </div>

              {/* Preset Color Palettes */}
              <div className="setting-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div className="setting-title">Color Palette Presets</div>
                  <div className="setting-subtitle">Select paired primary & secondary brand colors</div>
                </div>
                <div className="palette-grid">
                  {PALETTES.map(p => {
                    const isSelected = preferences.primaryColor === p.primary && preferences.secondaryColor === p.secondary;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`palette-preset-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleApplyPalette(p.primary, p.secondary, p.id)}
                      >
                        <div className="palette-swatch-duo">
                          <span className="swatch-half" style={{ backgroundColor: p.primary }} />
                          <span className="swatch-half" style={{ backgroundColor: p.secondary }} />
                        </div>
                        <span className="palette-name">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="setting-row">
                <div>
                  <div className="setting-title">Custom Theme Colors</div>
                  <div className="setting-subtitle">Pick exact Primary & Secondary hex colors</div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div className="custom-color-picker-item">
                    <span style={{ fontSize: '0.8rem', color: 'var(--mute)', fontWeight: 600 }}>Primary</span>
                    <div className="color-picker-input-wrapper">
                      <input
                        type="color"
                        value={preferences.primaryColor}
                        onChange={e => handleApplyPalette(e.target.value, preferences.secondaryColor, 'custom')}
                        className="color-picker-dot"
                      />
                      <span className="color-hex-text">{preferences.primaryColor}</span>
                    </div>
                  </div>
                  <div className="custom-color-picker-item">
                    <span style={{ fontSize: '0.8rem', color: 'var(--mute)', fontWeight: 600 }}>Secondary</span>
                    <div className="color-picker-input-wrapper">
                      <input
                        type="color"
                        value={preferences.secondaryColor}
                        onChange={e => handleApplyPalette(preferences.primaryColor, e.target.value, 'custom')}
                        className="color-picker-dot"
                      />
                      <span className="color-hex-text">{preferences.secondaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="setting-row">
                <div>
                  <div className="setting-title">First Day of Week</div>
                  <div className="setting-subtitle">Calendar and weekly overview start day</div>
                </div>
                <select
                  className="settings-select"
                  value={preferences.firstDayOfWeek}
                  onChange={e => setPreferences({ ...preferences, firstDayOfWeek: e.target.value })}
                >
                  <option value="monday">Monday</option>
                  <option value="sunday">Sunday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications & Reminders */}
          <section className="card settings-card">
            <div className="settings-section-header">
              <h3>🔔 Notifications & Reminders</h3>
              <p>Configure alerts to keep your streaks alive</p>
            </div>

            <div className="settings-list">
              <div className="setting-row">
                <div>
                  <div className="setting-title">Daily Habit Reminder</div>
                  <div className="setting-subtitle">Get a daily push notification to check off habits</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.dailyReminders}
                    onChange={e => setPreferences({ ...preferences, dailyReminders: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {preferences.dailyReminders && (
                <div className="setting-row sub-row">
                  <div>
                    <div className="setting-title">Reminder Time</div>
                    <div className="setting-subtitle">Time of day to send the alert</div>
                  </div>
                  <input
                    type="time"
                    className="settings-input time-input"
                    value={preferences.reminderTime}
                    onChange={e => setPreferences({ ...preferences, reminderTime: e.target.value })}
                  />
                </div>
              )}

              <div className="setting-row">
                <div>
                  <div className="setting-title">Sound Effects</div>
                  <div className="setting-subtitle">Play subtle audio feedback when marking habits done</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.soundEffects}
                    onChange={e => setPreferences({ ...preferences, soundEffects: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div>
                  <div className="setting-title">Weekly Summary Email</div>
                  <div className="setting-subtitle">Receive weekly progress reports and insights</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.weeklySummary}
                    onChange={e => setPreferences({ ...preferences, weeklySummary: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Data & Privacy / Danger Zone */}
          <section className="card settings-card danger-card">
            <div className="settings-section-header">
              <h3 style={{ color: '#f87171' }}>⚠️ Data Management & Danger Zone</h3>
              <p>Export your app data or reset local storage</p>
            </div>

            <div className="settings-list">
              <div className="setting-row">
                <div>
                  <div className="setting-title">Export Habit Data</div>
                  <div className="setting-subtitle">Download all habit history, notes, and settings as JSON</div>
                </div>
                <button className="btn" onClick={handleExportData}>
                  📥 Export JSON
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <div className="setting-title" style={{ color: '#f87171' }}>Reset All App Data</div>
                  <div className="setting-subtitle">Permanently delete local storage data and start fresh</div>
                </div>
                <button className="btn-danger" onClick={() => setShowResetModal(true)}>
                  🗑️ Reset Data
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="modal-backdrop" onClick={() => setShowResetModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
              <div className="modal-header">
                <h3>Confirm Data Reset</h3>
                <button className="modal-close" onClick={() => setShowResetModal(false)}>✕</button>
              </div>
              <div style={{ margin: '16px 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: '1.5' }}>
                Are you sure you want to reset all data? This action will erase all habits, custom stats, and local preferences. This cannot be undone.
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button className="btn" onClick={() => setShowResetModal(false)}>Cancel</button>
                <button className="btn-danger" onClick={handleResetData}>Yes, Reset Everything</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
