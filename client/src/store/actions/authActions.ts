import { createAction } from '@reduxjs/toolkit';
import { UserProfile } from '../commonTypes';

export const setLoggedIn = createAction<UserProfile>('auth/setLoggedIn');
export const setLoggedOut = createAction<undefined>('auth/setLoggedOut');
