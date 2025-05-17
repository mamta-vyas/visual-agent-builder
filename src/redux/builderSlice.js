import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    selectNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    updateNodeConfig: (state, action) => {
      const { id, config } = action.payload;
      const node = state.nodes.find((n) => n.id === id);
      if (node) node.data.config = config;
    },
  },
});

export const { setNodes, setEdges, selectNode, updateNodeConfig } = builderSlice.actions;
export default builderSlice.reducer;
