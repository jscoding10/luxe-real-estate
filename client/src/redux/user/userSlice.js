import { createSlice } from '@reduxjs/toolkit';
// Initial state
const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}
// User slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Sign in reducers
        signInStart: (state) => {
            state.loading = true;
        },
        // When recieve data from database
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        // Update user reducers
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        // Delete user reducer
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;

        },
        // Sign out reducer
        signOutUserStart: (state) => {
            state.loading = true;
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

// Export functions and user reducer
export const { 
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateUserFailure, 
    updateUserSuccess, 
    updateUserStart ,
    deleteUserFailure,
    deleteUserSuccess,
    deleteUserStart,
    signOutUserFailure,
    signOutUserSuccess,
    signOutUserStart,
    } = userSlice.actions;

export default userSlice.reducer;