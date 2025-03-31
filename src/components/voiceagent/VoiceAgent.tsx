import { useEffect, useRef } from 'react';
import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication } from 'livekit-client';
import '@livekit/components-styles';

export default function VoiceAgent({ token, url }: { token: string; url: string }) {
  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    const room = new Room();
    roomRef.current = room;

    const connectLiveKit = async () => {
      await room.connect(url, token);
      await room.localParticipant.setMicrophoneEnabled(true);

      room.on(RoomEvent.TrackSubscribed, async (track: RemoteTrack, pub: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === 'audio') {
          const audioElement = track.attach();
          audioElement.play().catch(console.error);
        }
      });
    };

    connectLiveKit();

    return () => {
      room.disconnect();
    };
  }, [token, url]);

  return <div>🎙️ Voice Agent Connected. Start speaking!</div>;
}