'use client'

import { useEffect, useState } from 'react';
import VoiceAgent from '@/components/voiceagent/VoiceAgent';
import { ConnectionDetails } from './api/token/route';

export default function Home() {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(`/api/token`);
      const data = await res.json();
      setConnectionDetails(data);
    };
    fetchToken();
  }, []);

  return (
    <div>
      <h1>AI Interview Voice Agent</h1>
      {connectionDetails ? <VoiceAgent conDetails={connectionDetails} /> : 'Loading agent...'}
    </div>
  );
}