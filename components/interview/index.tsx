"use client";

import {
  AgentState,
  RoomAudioRenderer,
  RoomContext,
} from "@livekit/components-react";
import { Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import { NoAgentNotification } from "@/components/interview/NoAgentNotification";
import type { ConnectionDetails } from "@/app/api/token/route";
import SimpleVoiceAssistant from "./VoiceAssistant";
import ControlBar from "./ControlBar";
import {
  alertNoDevice,
} from "./constant";

const Interview = () => {
  const [agentState, setAgentState] = useState<AgentState>("disconnected");

  const [room] = useState(new Room());

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/token",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await room.localParticipant.setMicrophoneEnabled(true);
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  const onDeviceFailure = (error: Error) => {
    console.error(error);
    alert(alertNoDevice);
  }


  return (
    <div data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      <RoomContext.Provider value={room}>
        <div className="lk-room-container grid grid-rows-[2fr_1fr] items-center">
          <SimpleVoiceAssistant onStateChange={setAgentState} />
          <ControlBar onConnectButtonClicked={onConnectButtonClicked} agentState={agentState} />
          <RoomAudioRenderer />
          <NoAgentNotification state={agentState} />
        </div>
      </RoomContext.Provider>
    </div>
  );
}

export default Interview