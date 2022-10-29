import { User } from '@prisma/client';
import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

export type UserState = (User & { token: string; }) | null;

const initialState: UserState = null;

export const userSlice = createSlice<UserState, SliceCaseReducers<UserState>>({
  name: 'user',
  initialState,
  reducers: {
    update: (_state, action: PayloadAction<UserState>) => action.payload,
    logout: () => null,
  },
});

export const { update: updateUser, logout: logoutUser } = userSlice.actions;

export default userSlice.reducer;
