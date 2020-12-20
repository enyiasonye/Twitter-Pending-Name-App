import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setLoggedIn, setLoggedOut } from '../actions/authActions';
import { UserProfile } from '../commonTypes';
import { signIn } from '../thunks/authThunks';

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
    // setLoggedIn(state: AuthSliceState, action: PayloadAction<UserProfile>) {
    //   state.userProfile = action.payload;
    // },
    // setLoggedOut(state: AuthSliceState) {
    //   state.userProfile = {
    //     status: UserStatuses.ANONYMOUS,
    //     displayName: null,
    //     uid: null,
    //     profileImageUrl: null,
    //   };
    // },
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
    builder.addCase(signIn.fulfilled, (state, action) => {
      console.log('yeet', action);
    });
  },
});

// export const { setLoggedIn, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
