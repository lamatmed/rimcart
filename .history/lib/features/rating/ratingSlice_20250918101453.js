import { createSlice } from '@reduxjs/toolkit'


export const fetchUserRatings = createAsyncThunk(
  "rating/fetchUserRatings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/rating");
      return data.ratings;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
    },
    reducers: {
        addRating: (state, action) => {
            state.ratings.push(action.payload)
        },
    }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer