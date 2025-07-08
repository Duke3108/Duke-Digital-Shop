import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from './appSlice';
import { productSlice } from './product/productSlice';

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    products: productSlice.reducer
  },
});
