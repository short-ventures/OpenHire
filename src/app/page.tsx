'use client'

import { useEffect, useState } from 'react';
import VoiceAgent from '@/components/voiceagent/VoiceAgent';

export default function Home() {
  const [token, setToken] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(`/api/livekit?room=interview-room&participant=user123`);
      const data = await res.json();
      setToken(data.token);
      setUrl(data.url);
    };
    fetchToken();
  }, []);

  return (
    <div>
      <h1>AI Interview Voice Agent</h1>
      {token && url ? <VoiceAgent token={token} url={url} /> : 'Loading agent...'}
    </div>
  );
}