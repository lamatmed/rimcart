import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const fetchUserRatings = createAsyncThunk(
  "rating/fetchUserRatings",
  async ({getToken}, { thunkAPI }) => {
    try {
        const token = getToken()
      const { data } = await axios.get("/api/rating",{
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.ratings;
    } catch (error) {
     return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors du chargement des produits"
      )
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
    },
      extraReducers:(builder)=>{
            builder.addCase(fetchUserRatings.fulfilled,(state, action)=>{
                state.list = action.payload
            })
        }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer