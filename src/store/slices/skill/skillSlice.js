import { createSlice } from "@reduxjs/toolkit";

const levels = ["default", "senior", "middle", "junior", "trainee", "incoming"];

export const skillSlice = createSlice({
  name: "skill",

  initialState: {
    skillLevel: "default",
  },

  reducers: {
    initSkillState: (state, action) => {
      state.level = action.payload;
    },
    setSkillLevel: (state, action) => {
      if (!levels.includes(action.payload)) return;

      state.level = action.payload;
    },
  },
});

export const { initSkillState, setSkillLevel } = skillSlice.actions;

export default skillSlice.reducer;
