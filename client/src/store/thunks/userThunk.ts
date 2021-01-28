import { createAsyncThunk } from '@reduxjs/toolkit';
import { userRef } from '../../firebaseConfig';
import { UserSettings } from '../commonTypes';
import { setSettings } from '../slices/authSlice';

export const updateSettings = createAsyncThunk(
  'user/updateSettings',
  async (
    {
      updatedSettings,
      userId,
    }: {
      updatedSettings: UserSettings;
      userId: string;
    },
    thunkAPI,
  ) => {
    try {
      await userRef.doc(userId).update({ settings: updatedSettings });
      thunkAPI.dispatch(setSettings(updatedSettings));
    } catch (e) {
      console.log(e);
    }
  },
);
