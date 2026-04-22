import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../../auth/state/auth.slice";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setloading: (state, action) => {
        state.loading = action.payload
    },
    seterror: (state, action) => {
        state.error = action.payload
    }
  },
});

export const { setProducts, setloading, seterror } = productSlice.actions;

export default productSlice.reducer;
