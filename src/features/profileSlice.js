import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: {},
    CurrentUserFingerprint: null,
    auth: false,
};

export const fetchprofile = createAsyncThunk('FilmFairProfile/fetchprofile', async(token, { rejectWithValue }) => {
    try {
      const response = await fetch("https://filmfairserverr.vercel.app/getuser", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
            },
        });
        
        if (!response.ok) {
          let error = 'Rejected with Value by redux';
          if (response.status === 401) {
              error = 'Unauthorized';
          }
          return rejectWithValue({ status: response.status, message: error });
        }

        const data = await response.json();
        return { status: response.status, data };
      }
      catch (error) {
        return rejectWithValue({ status: 500, message: error.message });
      }
});


export const profileSlice = createSlice({
    name: 'FilmFairProfile',
    initialState,
  
    reducers: {
      updateFingerprint: (state, action) => {
        state.CurrentUserFingerprint = action.payload;
      },
      updateAuth: (state, action) => {
        state.auth = 'false';
      },
    },
  
    extraReducers: (builder) => {
      builder
        .addCase(fetchprofile.fulfilled, (state, action) => {
          state.profile = { ...state.profile, ...action.payload };
          state.auth = true;
        })
        .addCase(fetchprofile.rejected, (state, action) => {
          console.error('Error fetching profile:', action.payload.message);
          state.auth = false; // Optionally update the auth state
        });
    },
  });
  
//   export const selectCount = (state) => state.counter.value;

  export const { updateFingerprint, updateAuth } = profileSlice.actions;

  export default profileSlice.reducer;