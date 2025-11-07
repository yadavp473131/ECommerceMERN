import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// createSlice — convenience function for creating a slice: action creators + reducer in one place.
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
}

//        actioncreators                   identifier
export const registerUser = createAsyncThunk('/auth/register',
    //payload creator
    async (formData) => {
        const response = await axios.post('http://localhost:5000/api/auth/register', formData, { withCredentials: true });
        return response.data;//later becomes action.payload
    }
)

export const loginUser = createAsyncThunk('/auth/login',
    async (formData) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData, { withCredentials: true });
        return response.data;
    }
)

export const logoutUser = createAsyncThunk('/auth/logout',
    async () => {
        const response = await axios.post('http://localhost:5000/api/auth/logout',  {},{ withCredentials: true });
        return response.data;
    }
   
)

export const checkAuth = createAsyncThunk('/auth/checkauth',
    async () => {
        const response = await axios.get('http://localhost:5000/api/auth/check-auth'
            , {
                withCredentials: true,
                headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', }
            },);
        return response.data;
    }
)

const authSlice = createSlice({
    //reducer name
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {

        }
    },
    //you can manage by builder
    extraReducers: (builder) => {
        //when state in pending state
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.success ? action.payload.user : null;
            state.isAuthenticated = action.payload.success;
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
        }).addCase(checkAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.success ? action.payload.user : null;
            state.isAuthenticated = action.payload.success;
        }).addCase(checkAuth.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(logoutUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
    }

})
//setUser is auto-generated action creator which can be dispatched elsewhere
export const { setUser } = authSlice.actions;
//authSlice has a property reducer different from one that i provided inside reducers
export default authSlice.reducer;


// configureStore() – easier store setup with sensible defaults

// createSlice() – combine reducers and action creators in one step

// createAsyncThunk() – simplify async logic and automatically dispatch pending/fulfilled/rejected actions

// Built-in Immer for immutable state updates
// ┌─────────────────────────────┐
// │         React UI            │
// │ (useDispatch / useSelector) │
// └─────────────┬───────────────┘
//               │ dispatch(action) / read state
//               │
// ┌─────────────▼────────────────┐
// │       Redux Store            │
// │ (created by configureStore)  │
// └─────────────┬────────────────┘
//               │ state & reducers
//               │
//       ┌───────▼─────────────────────────────────────────────┐
//       │        authSlice (createSlice)                      │
//       │  - initialState                                     │
//       │  - reducers (sync logic)                           │
//       │  - extraReducers (handle async thunk results)       │
//       └─────────────────────────────────────────────────────┘
//               ▲
//               │ automatically generates
//               │ action creators + reducer
//               │
// ┌─────────────▼────────────────────────┐
// │  createAsyncThunk (e.g. loginUser)   │
// │  - Handles async calls (axios)       │
// │  - Dispatches: pending / fulfilled / │
// │    rejected actions automatically    │
// └─────────────┬────────────────────────┘
//               │
//               │ (makes API call)
//               │
//        ┌──────▼─────────┐
//        │  API / Server  │
//        │ (Express, etc.)│
//        └────────────────┘
