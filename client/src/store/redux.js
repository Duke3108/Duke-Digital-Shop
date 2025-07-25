import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from './appSlice';
import { productSlice } from './product/productSlice';
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer, FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE } from 'redux-persist'
import { userSlice } from './user/userSlice';

const commonConfig = {
  key: 'shop/user',
  storage
}

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current', 'cart', 'wishList']
}

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    products: productSlice.reducer,
    user: persistReducer(userConfig, userSlice.reducer)
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE]
    }
  })
});

export const persistor = persistStore(store)
