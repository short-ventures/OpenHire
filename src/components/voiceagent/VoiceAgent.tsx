import { useEffect, useState } from 'react';
import { Room } from 'livekit-client';
import { RoomContext, RoomAudioRenderer, ControlBar } from '@livekit/components-react';
import '@livekit/components-styles';
import { ConnectionDetails } from '@/app/api/token/route';

type conditionProp = {
  conDetails: ConnectionDetails;
}

export default function VoiceAgent({ conDetails }: conditionProp) {
  const [roomInstance] = useState(() => new Room());

  useEffect(() => {
    let mounted = true;
    const connectLiveKit = async () => {
      try {
        await roomInstance.connect(conDetails.serverUrl, conDetails.participantToken);
        await roomInstance.localParticipant.setMicrophoneEnabled(true);
      } catch (err) {
        console.log(conDetails.serverUrl);
        console.log("server connection error", err);
      }
    };

    connectLiveKit();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [conDetails, roomInstance]);


  if (conDetails.participantToken === '') {
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