import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productDummyData } from '@/assets/assets'

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({storeId}, { thunkAPI }) => {
    try {
      const { data } = await axios.get('/api/products' +(storeId))
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
        list: productDummyData,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        }
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer