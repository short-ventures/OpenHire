import { useEffect } from "react";
import {
  AgentState,
  BarVisualizer,
  useVoiceAssistant,
} from "@livekit/components-react";

const SimpleVoiceAssistant = (props: { onStateChange: (state: AgentState) => void }) => {
  const { state, audioTrack } = useVoiceAssistant();
  useEffect(() => {
    props.onStateChange(state);
  }, [props, state]);
  return (
    <div className="h-[300px] max-w-[30vw] mx-auto">
      <BarVisualizer
        state={state}
        barCount={10}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

export default SimpleVoiceAssistant