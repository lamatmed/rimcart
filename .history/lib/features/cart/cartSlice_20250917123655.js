import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export  const fetchCart = createAsyncThunk('cart/fetchCart', async ({getToken}, thunkAPI)=>{
    try {
        const {token}= getToken
        const { data } = await axios.get('/api/cart'+(storeId ? `?storeId=${storeId}`: ''))
              return data.products
        
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors du chargement des produits"
      )  
    }

})


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
            }
            state.total -= 1
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer
