import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setLoggedIn, setLoggedOut } from '../actions/authActions';
import { UserProfile, UserSettings } from '../commonTypes';

interface AuthSliceState {
  userProfile: UserProfile | null;
  applicationLoading: boolean;
}

const initialState: AuthSliceState = {
  userProfile: null,
  applicationLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSettings(state: AuthSliceState, action: PayloadAction<UserSettings>) {
      if (state.userProfile?.settings)
        state.userProfile.settings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setLoggedIn, (state, action) => {
      state.userProfile = action.payload;
      state.applicationLoading = false;
    });
    builder.addCase(setLoggedOut, (state) => {
      state.userProfile = null;
      state.applicationLoading = false;
    });
  },
});

export const { setSettings } = authSlice.actions;
export default authSlice.reducer;
