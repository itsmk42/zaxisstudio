"use client";
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabaseClient';

export const metadata = { title: 'Account Confirmed — Zaxis Studio' };

export default function AccountConfirmed() {
  const [message, setMessage] = useState('Verifying your account…');
  const [profileStatus, setProfileStatus] = useState('');

  useEffect(() => {
    async function run() {
      try {
        const { data: { user }, error } = await supabaseBrowser.auth.getUser();
        if (error) throw error;
        if (user) {
          setMessage(`Welcome, ${user.email}. Your email is verified.`);
          // Attempt to upsert a profile record if the table exists.
          const { error: upsertErr } = await supabaseBrowser
            .from('profiles')
            .upsert({ id: user.id, email: user.email }, { onConflict: 'id' });
          if (upsertErr) {
            setProfileStatus('Profile table not configured yet. You can add a profiles table or ignore this message.');
          } else {
            setProfileStatus('Profile saved.');
          }
        } else {
          setMessage('Please log in.');
        }
      } catch (err) {
        setMessage('Confirmed. If you are not signed in, please login.');
      }
    }
    run();
  }, []);

  return (
    <section className="center-page">
      <div className="hero-card auth-card" style={{ padding: 20 }}>
        <h1 className="page-title">Account Confirmed</h1>
        <p>{message}</p>
        {profileStatus && <p className="status">{profileStatus}</p>}
        <div className="actions centered">
          <a className="btn primary" href="/">Go to Home</a>
        </div>
      </div>
    </section>
  );
}
