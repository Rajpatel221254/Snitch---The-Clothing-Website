import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../../auth/state/auth.slice";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setloading: (state, action) => {
      state.loading = action.payload;
    },
    seterror: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSellerProducts, setloading, seterror, setProducts } = productSlice.actions;

export default productSlice.reducer;
