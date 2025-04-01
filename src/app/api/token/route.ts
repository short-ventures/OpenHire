import { NextResponse, NextRequest } from "next/server";
import { AccessToken } from 'livekit-server-sdk';

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;
    const livekitUrl = process.env.LIVEKIT_API_URL!;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Missing LiveKit credentials' },
        { status: 400 }
      );
    }

    const roomName = 'room-' + Math.random().toString(36).slice(2);
    const participantName = 'user-' + Math.random().toString(36).slice(2);

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });

    at.addGrant({ room: roomName, canPublish: true, canSubscribe: true });

    const participantToken = await at.toJwt();

    const data: ConnectionDetails = {
      serverUrl: livekitUrl,
      roomName,
      participantToken,
      participantName
    };
    console.log(data);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof Error) {

      console.error("error", e);
      return new NextResponse(e.message, { status: 500 });
    }
  }

}