import { useEffect, useState } from 'react';
import { Room } from 'livekit-client';
import { RoomContext, RoomAudioRenderer, ControlBar } from '@livekit/components-react';
import '@livekit/components-styles';

export default function VoiceAgent({ token, url }: { token: string; url: string }) {

  const [roomInstance] = useState(() => new Room());

  useEffect(() => {
    let mounted = true;
    const connectLiveKit = async () => {
      await roomInstance.connect(url, token);
      await roomInstance.localParticipant.setMicrophoneEnabled(true);
    };

    connectLiveKit();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [token, url, roomInstance]);


  if (token === '') {
    return <div>Getting token...</div>
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" className='h-[100dvh]'>
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}