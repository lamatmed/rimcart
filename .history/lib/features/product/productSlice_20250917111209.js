import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// --- Thunk API ---
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({storeId}, { thu }) => {
    try {
      const { data } = await axios.get('/api/products')
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors du chargement des produits"
      )
    }
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProduct: (state, action) => {
      state.list = action.payload
    },
    clearProduct: (state) => {
      state.list = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setProduct, clearProduct } = productSlice.actions
export default productSlice.reducer
