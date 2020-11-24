import { createAsyncThunk } from '@reduxjs/toolkit';

// First, create the thunk
export const authenticateUser = createAsyncThunk(
  'user/authenticateUser',
  async () => {
    const response = await fetch('http://localhost:4000/auth/login/success', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
    console.log(response);
    console.log('YEET');
    return response.json();
  },
);
