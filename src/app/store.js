import { configureStore } from '@reduxjs/toolkit';
import apiSlice from '../features/apiSlice';
import profileSlice from '../features/profileSlice';

export const store = configureStore({
    reducer: {
        api: apiSlice,
        profile: profileSlice,
    },
});