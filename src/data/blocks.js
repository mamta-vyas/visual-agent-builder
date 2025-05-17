// src/data/blocks.js
export const agentBlocks = [
  {
    id: "llm-1",
    type: "LLM",
    label: "OpenAI GPT-4",
    config: {
      temperature: 0.7,
      maxTokens: 2000,
    },
  },
  {
    id: "memory-1",
    type: "Memory",
    label: "Short-Term Memory",
    config: {
      retention: "5 minutes",
    },
  },
  {
    id: "tool-1",
    type: "Tool",
    label: "Search Tool",
    config: {
      source: "Google",
    },
  },
  {
    id: "input-1",
    type: "Input",
    label: "User Query",
    config: {},
  },
  {
    id: "output-1",
    type: "Output",
    label: "Agent Response",
    config: {},
  },
]
