import asyncio
import json
import os
import requests

from livekit import rtc
from livekit.agents import JobContext, WorkerOptions, cli, JobProcess
from livekit.agents.llm import (
    ChatContext,
    ChatMessage,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.agents.log import logger
from livekit.plugins import deepgram, silero, cartesia, openai
from dotenv import load_dotenv

from prompt import BACKGROUND_PROMPT, TECHNICAL_PROMPT, PERSONALITY_PROMPT, TECHNICAL_CHECK_PROMPT

load_dotenv()


def prewarm(proc: JobProcess):
    # preload models when process starts to speed up first interaction
    proc.userdata["vad"] = silero.VAD.load()

async def entrypoint(ctx: JobContext):
  
  interview_stages = [
    ("Background & experience", BACKGROUND_PROMPT),
    ("Technical Knowledge", TECHNICAL_PROMPT),
    ("Personality Assessment", PERSONALITY_PROMPT)
  ]
  
  stage_index = 0
  
  initial_ctx = ChatContext(
      messages=[
          ChatMessage(
              role="system",
              content=TECHNICAL_CHECK_PROMPT,
          )
      ]
    )
  
  agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(language='en-US'),
        llm=openai.LLM(model="gpt-4o"),
        tts=cartesia.TTS(model='sonic-2'),
        chat_ctx=initial_ctx,
  )
  
  # def setup_agent(prompt):
  #   initial_ctx = ChatContext(
  #       messages=[
  #           ChatMessage(
  #               role="system",
  #               content=prompt,
  #           )
  #       ]
  #   )
  #   return VoicePipelineAgent(
  #       vad=ctx.proc.userdata["vad"],
  #       stt=deepgram.STT(language='en-US'),
  #       llm=openai.LLM(model="gpt-4o"),
  #       tts=cartesia.TTS(model='sonic-2'),
  #       chat_ctx=initial_ctx,
  #   )
  
  # async def run_stage(stage_name, prompt, ctx: JobContext, participant):
  #   agent = setup_agent(prompt)
    
  #   logger.info(f"Starting stage: {stage_name}")
  #   agent.start(ctx.room, participant)
  #   await agent.say(f"Welcom to the {stage_name} interview. Let's begin!")
    
    # is_stage_complete = False
    
    # while not is_stage_complete:
    #   score = int(agent._chat_ctx._metadata.get("score", 7))
    #   if(score >= 7):
    #     is_stage_complete = True
    #     await agent.say(f"Great! You have completed the {stage_name} stage.")
    
    # await agent.aclose()
    # logger.info(f"finished the current interview")
    
  @agent.on("agent_speech_committed")
  def agent_speech_comitted(s):
    logger.info(f"comitTTTTTTTTTTTTTTTTTTTTTTTTT: {s.content}")
    
    
  logger.info(f"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~connecting to room {ctx.room.name}")
  await ctx.connect()

  participant = await ctx.wait_for_participant()
  logger.info(f"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$starting voice assistant for participant {participant.identity}")
  
  # while stage_index < len(interview_stages):
  #   stage_name, prompt = interview_stages[stage_index]
  #   await run_stage(stage_name, prompt, ctx, participant)
  #   stage_index += 1

  agent.start(ctx.room, participant)
  await agent.say("Hi there, how are you doing today? what is Reactjs?", allow_interruptions=True)


if __name__ == "__main__":
  cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
