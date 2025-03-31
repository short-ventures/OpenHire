export type InterviewStage = {
  name: string;
  prompt: string;
};

export const defaultStages: InterviewStage[] = [
  { name: "Background & Experience", prompt: "Introduce yourself and your professional background." },
  { name: "Technical Knowledge", prompt: "Let's discuss technical aspects relevant to this role." },
  { name: "Technical Quiz", prompt: "Now, let's start a quick quiz to assess your technical know-how." },
  { name: "Scenario Roleplay", prompt: "Roleplay a scenario relevant to your potential role." },
  { name: "Soft Skills", prompt: "Tell me about situations demonstrating your soft skills." },
  { name: "Teamwork", prompt: "Describe an experience with effective teamwork." },
];