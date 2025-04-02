import { NextRequest } from "next/server";

const AGENT_SERVER = process.env.AGENT_SERVER!;

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${AGENT_SERVER}/create_agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response);
    return response;
  } catch (err) {
    console.error('[request agent]', err);
    return new Response("Server error", { status: 500 });
  }
}
