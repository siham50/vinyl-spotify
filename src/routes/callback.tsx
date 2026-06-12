import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../lib/spotifyAuth';
import { usePlayer } from '../store/playerStore';

export default function Callback() {
  const navigate = useNavigate();
  const { setAccessToken } = usePlayer();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(`Spotify error: ${errorParam}`);
      return;
    }

    if (!code) {
      setError('No authorization code found in URL.');
      return;
    }

    async function processAuth() {
      try {
        const data = await exchangeCodeForToken(code as string);
        if (data.error) {
          throw new Error(data.error_description || data.error);
        }
        setAccessToken(data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('spotify_refresh_token', data.refresh_token);
        }
        navigate('/', { replace: true });
      } catch (err: any) {
        setError(err.message || 'Failed to authenticate');
        console.error('Auth error:', err);
      }
    }

    processAuth();
  }, [navigate, setAccessToken]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center p-8" style={{ background: 'var(--bg)' }}>
        <div className="space-y-4">
          <h1 className="text-xl font-bold" style={{ color: 'var(--fg)' }}>Authentication Failed</h1>
          <p style={{ color: 'var(--fg-muted)' }}>{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ background: 'var(--surface)', color: 'var(--fg)', border: '1px solid var(--border)' }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--fg-muted)', borderTopColor: 'transparent' }} />
        <p style={{ color: 'var(--fg-muted)' }}>Connecting to Spotify...</p>
      </div>
    </div>
  );
}
