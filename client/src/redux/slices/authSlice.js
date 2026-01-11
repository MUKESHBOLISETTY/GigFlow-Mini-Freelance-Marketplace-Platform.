import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  loading: false,
  email: localStorage.getItem("email") ? localStorage.getItem("email") : null,
  is_logged_in: localStorage.getItem("is_logged_in") ? localStorage.getItem("is_logged_in") : false,
  user: null,
  error: null,
  navigation: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
    },
    setNavigation(state, value) {
      state.navigation = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setEmail(state, value) {
      state.email = value.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetAuth: (state) => {
      state.token = null;
      state.email = null;
      state.user = null;
    }
  },
});

export const { setLoading, setEmail, setUser, setError, resetAuth, setNavigation } = authSlice.actions;

export default authSlice.reducer;