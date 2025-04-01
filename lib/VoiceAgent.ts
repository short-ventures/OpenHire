import {
  type JobContext,
  type JobProcess,
  WorkerOptions,
  cli,
  defineAgent,
  pipeline
} from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import * as silero from '@livekit/agents-plugin-silero';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as cartesia from '@livekit/agents-plugin-cartesia';
import { fileURLToPath } from 'node:url';

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData["vad"] = silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    await ctx.connect();
    console.log('waiting for participant');
    const participant = await ctx.waitForParticipant();
    console.log(`starting assistant example agent for ${participant.identity}`);


    const vad = await silero.VAD.load();
    const agent = new pipeline.VoicePipelineAgent(
      vad,
      new deepgram.STT({ model: 'nova-2-general' }),
      new openai.LLM({ model: 'gpt-4o', temperature: 0.8 }),
      new cartesia.TTS({ model: 'sonic-2', speed: 0.8, emotion: ["curiosity:highest", "positivity:high"] }),
    )

    agent.start(ctx.room, participant);
    await agent.say("Hey, how can i help you today?", true);
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));