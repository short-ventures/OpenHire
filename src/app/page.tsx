'use client'

import { useEffect, useState } from 'react';
import VoiceAgent from '@/components/voiceagent/VoiceAgent';

export default function Home() {
  const [token, setToken] = useState<string | null>('');
  const [url, setUrl] = useState<string | null>('');

  useEffect(() => {
    const fetchToken = async () => {
      console.log("`~~~~~~~~~~~~~");
      const res = await fetch(`/api/token`);
      console.log(res)
      const data = await res.json();
      setToken(data.participantToken);
      setUrl(data.serverUrl);
    };
    console.log("hello")
    fetchToken();
  }, []);

  return (
    <div>
      <h1>AI Interview Voice Agent</h1>
      {token && url ? <VoiceAgent token={token} url={url} /> : 'Loading agent...'}
    </div>
  );
}