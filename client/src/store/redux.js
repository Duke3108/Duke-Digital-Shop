import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from './appSlice';
import { productSlice } from './product/productSlice';
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer, FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE } from 'redux-persist'
import { userSlice } from './user/userSlice';

const commonConfig = {
  storage
}

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current'],
  key: 'shop/user',
}

const productConfig = {
  ...commonConfig,
  whitelist: ['dealDaily'],
  key: 'shop/product',
}

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    products: persistReducer(productConfig, productSlice.reducer),
    user: persistReducer(userConfig, userSlice.reducer)
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE]
    }
  })
});

export const persistor = persistStore(store)
