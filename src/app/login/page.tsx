import React from 'react';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="logo" style={{ margin: '0 auto 16px', width: 48, height: 48, fontSize: 24 }}>✿</div>
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to your Habit Tracker</p>

        <form className="auth-form">
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="wass@example.com" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          
          <button type="submit" className="btn g">Sign In</button>
        </form>

        <div className="auth-links">
          Don't have an account? <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
