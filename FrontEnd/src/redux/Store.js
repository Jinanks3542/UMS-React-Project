import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
import {  persistReducer,persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./Slices/userSlice.js";
import modalSlice from "./Slices/modalSlice.js";
import axios from "axios";



const API_URL = "http://localhost:4000/api/users";

const INITIAL_STATE = {
  token: null,
  user: null
  
};


const persistConfig = {
  key:'root',
  storage,
  whitelist:['auth']
}

console.log('authReducer:', authReducer);
console.log('userSlice.reducer:', userSlice);
console.log('modalSlice.reducer:', modalSlice);

// Combine reducers
const rootReducer = combineReducers({
  auth:authReducer,
  users:userSlice,
  modal:modalSlice,
})

const persistedReducer = persistReducer(persistConfig,rootReducer)



export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export const persistor = persistStore(store)



export { getUsers, searchUsers, createUser, updateAdminUser, deleteUser } from "./Slices/userActions"


// const authSlice = createSlice({
//   name: "auth",
//   initialState: INITIAL_STATE,
//   reducers: {
//     login: (state, action) => {
//       state.token = action.payload.token;
//       state.user = action.payload.user;
      
//     },
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
     
//     },
//   },
// });



// export const { login, logout } = authSlice.actions;



