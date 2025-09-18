import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productDummyData } from '@/assets/assets'

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({storeId}, { thunkAPI }) => {
    try {
      const { data } = await axios.get('/api/products' +(storeId ? `?storeId=${storeId}`: ''))
      return data.products
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors du chargement des produits"
      )
    }
  }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchProducts.fulfilled,(state, action)=>{
            sta
        })
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer