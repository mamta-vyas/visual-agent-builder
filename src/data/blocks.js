// src/data/blocks.js
import { FaDatabase, FaFilter, FaCogs } from "react-icons/fa";

export const agentBlocks = [
  {
    id: "llm-1",
    type: "LLM",
    label: "OpenAI GPT-4",
    config: { temperature: 0.7, maxTokens: 2000 },
  },
  {
    id: "memory-1",
    type: "Memory",
    label: "Short-Term Memory",
    config: { retention: "5 minutes" },
  },
  {
    id: "tool-1",
    type: "Tool",
    label: "Search Tool",
    config: { source: "Google" },
  },
  {
    id: "input-1",
    type: "Input",
    label: "User Query",
    config: { prompt: "What is your query?" }, // ✅ add something here
  },
  {
    id: "output-1",
    type: "Output",
    label: "Agent Response",
    config: { responseType: "text" }, // ✅ add something here too
  },
];



export const nodeTypes = [
  {
    id: "source-1",
    label: "Source",
    icon: <FaDatabase />,
    type: "source",
    config: {
      endpoint: "https://api.example.com/data",
    },
  },
  {
    id: "filter-1",
    label: "Filter",
    icon: <FaFilter />,
    type: "filter",
    config: {
      condition: "item.value > 10",
    },
  },
  {
    id: "processor-1",
    label: "Processor",
    icon: <FaCogs />,
    type: "processor",
    config: {
      threads: 2,
    },
  },
];
