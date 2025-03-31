import { NextApiRequest, NextApiResponse } from 'next';
import { RoomServiceClient, AccessToken } from 'livekit-server-sdk';
import { pipeline, llm } from '@livekit/agents';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as openai from '@livekit/agents-plugin-openai';
import * as silero from '@livekit/agents-plugin-silero';
import * as cartesia from '@livekit/agents-plugin-cartesia';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { room, participant } = req.query as { room: string; participant: string };

  if (!room || !participant) {
    return res.status(400).json({ error: 'Missing room or participant parameters' });
  }

  const at = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: participant,
  });
  at.addGrant({ room, canPublish: true, canSubscribe: true });


  const livekitHost = process.env.LIVEKIT_API_URL!;
  const svc = new RoomServiceClient(livekitHost, process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!);

  // Create room if necessary
  await svc.createRoom({ name: room }).then(room => { console.log(room) }).catch(e => { console.log(e) });

  // Generate LiveKit access token for frontend

  // Setup voice agent
  const vad = await silero.VAD.load();
  const voiceAgent = new pipeline.VoicePipelineAgent(
    vad,
    new deepgram.STT({ apiKey: process.env.DEEPGRAM_API_KEY!, model: 'nova-2-general' }),
    new openai.LLM({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }),
    new cartesia.TTS({ apiKey: process.env.CARTESIA_API_KEY, model: 'sonic-2', speed: 0.8, emotion: ["curiosity:highest", "positivity:high"] }),
    {
      chatCtx: new llm.ChatContext().append({
        role: llm.ChatRole.SYSTEM,
        text: 'You are an AI interviewer. Ask professional interview questions clearly.',
      }),
      allowInterruptions: true,
      interruptSpeechDuration: 500,
      interruptMinWords: 0,
      minEndpointingDelay: 500,
    },
  );


  // Start agent in the room
  voiceAgent.start(room, participant);

  // Return token to frontend
  res.status(200).json({ token: at.toJwt(), url: livekitHost });
}