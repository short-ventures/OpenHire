from fastapi import FastAPI 
from livekit.agents import WorkerOptions
from livekit.agents.cli import cli
from dotenv import load_dotenv
import logging
import os

from agent import entrypoint, prewarm

app = FastAPI()

load_dotenv()


def run_livekit_agent():
  try:
    cli.run_app(
      WorkerOptions(
        entrypoint_fnc=entrypoint,
        prewarm_fnc=prewarm
      )
    )
  except Exception as e:
    print(f"Error in run_livekit_agent: {e}")

# Define a root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}

# Define a path parameter endpoint
@app.post("/create_agent")
async def create_agent():
  logging.info("receive api")
  run_livekit_agent