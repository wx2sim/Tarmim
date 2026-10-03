import React from 'react';
import Link from 'next/link';

export default function Signup() {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="logo" style={{ margin: '0 auto 16px', width: 48, height: 48, fontSize: 24 }}>✿</div>
        <h1>Create an account</h1>
        <p className="subtitle">Start tracking your habits today</p>

        <form className="auth-form">
          <div>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Wass" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="wass@example.com" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          
          <button type="submit" className="btn g">Sign Up</button>
        </form>

        <div className="auth-links">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
