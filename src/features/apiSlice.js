import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    apidt: [],
    loading: true,
    error: null,
};

export const fetchdt = createAsyncThunk('FilmFairAPI/fetchdt', async () => {
    try {
        const response = await fetch("https://filmfairserverr.vercel.app/api?param=true")
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Hi Piyush Error on line 15 Slice-->', error);
      }
});


export const apiSlice = createSlice({
    name: 'FilmFairAPI',
    initialState,
  
    reducers: {
    },
  
    extraReducers: (builder) => {
      builder
        .addCase(fetchdt.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchdt.fulfilled, (state, action) => {
          state.apidt = action.payload;
          state.loading = false;
        });
        // .addCase(fetchdt.rejected, (state, action) => {
        //     state.error = action.payload;
        //     state.loading = false;
        // });
    },
  });
  
//   export const selectCount = (state) => state.counter.value;
  
  export default apiSlice.reducer;