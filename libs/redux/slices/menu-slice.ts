import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: false,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    toggleSidebar: (state): void => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openSidebar: (state): void => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state): void => {
      state.isSidebarOpen = false;
    },
  },
});

export const { toggleSidebar, openSidebar, closeSidebar } = menuSlice.actions;
export default menuSlice.reducer;
