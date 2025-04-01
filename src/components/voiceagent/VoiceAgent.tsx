import { useEffect, useState, useCallback } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import {
  AgentState,
  BarVisualizer,
  DisconnectButton,
  VoiceAssistantControlBar,
  RoomContext,
  RoomAudioRenderer,
  useVoiceAssistant
} from '@livekit/components-react';
import { useKrispNoiseFilter } from "@livekit/components-react/krisp";
import { AnimatePresence, motion } from "framer-motion";
import '@livekit/components-styles';
import { ConnectionDetails } from '@/app/api/token/route';

type conditionProp = {
  conDetails: ConnectionDetails;
}

const VoiceAgent = ({ conDetails }: conditionProp) => {
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [roomInstance] = useState(() => new Room());
  const onConnectButtonClicked = useCallback(async () => {

    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/token",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await roomInstance.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await roomInstance.localParticipant.setMicrophoneEnabled(true);
  }, [roomInstance]);

  useEffect(() => {
    roomInstance.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      roomInstance.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [roomInstance]);

  return (
    <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      <RoomContext.Provider value={roomInstance}>
        <div className="lk-room-container grid grid-rows-[2fr_1fr] items-center">
          <SimpleVoiceAssistant onStateChange={setAgentState} />
          <ControlBar onConnectButtonClicked={onConnectButtonClicked} agentState={agentState} />
          <RoomAudioRenderer />
          {/* <NoAgentNotification state={agentState} /> */}
        </div>
      </RoomContext.Provider>
    </main>
  );
}

export default VoiceAgent;

const SimpleVoiceAssistant = (props: { onStateChange: (state: AgentState) => void }) => {
  const { state, audioTrack } = useVoiceAssistant();
  useEffect(() => {
    props.onStateChange(state);
  }, [props, state]);
  return (
    <div className="h-[300px] max-w-[90vw] mx-auto">
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

const ControlBar = (props: { onConnectButtonClicked: () => void; agentState: AgentState }) => {
  const krisp = useKrispNoiseFilter();
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true);
  }, []);

  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {props.agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {props.agentState !== "disconnected" && props.agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


const onDeviceFailure = (error: Error) => {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}