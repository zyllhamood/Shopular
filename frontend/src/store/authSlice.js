import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import axios from 'axios';
export const login = createAsyncThunk('auth/login', async (data_recived, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const data = {
        username: data_recived.username,
        password: data_recived.password
    }
    try {
        const response = await axios.post('https://api.igstore.io/login/', data, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': data_recived.csrf,

            }
        });
        return response.data;
    } catch (error) {
        let errorMessage;

        try {
            errorMessage = JSON.parse(error.request.response).error;

        } catch (e) {
            errorMessage = 'An error occurred';
        }
        return rejectWithValue(errorMessage);
    }
});

export const register = createAsyncThunk('auth/register', async (data_recived, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const data = {
        username: data_recived.username,
        password: data_recived.password,
        email: data_recived.email
    }
    try {
        const response = await axios.post('https://api.igstore.io/register/', data, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': data_recived.csrf,
            }
        });
        return response.data;
    } catch (error) {
        let errorMessage;
        try {
            errorMessage = JSON.parse(error.request.response).message;
        } catch (e) {
            errorMessage = 'An error occurred';
        }
        return rejectWithValue(errorMessage);
    }
});

export const get_info = createAsyncThunk('auth/info', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {

        const response = await axios.get('https://api.igstore.io/info/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data}`
            }
        });
        return response.data;
    } catch (error) {

        return rejectWithValue(error.request.message);
    }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (data, thunkAPI) => {
    const access_token = Cookies.get('access_token');
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await axios.post('http://192.168.3.163:8000/change-password/', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.request.message);
    }
});

const initialState = {
    isLoading: false,
    wrongLogin: null,
    isLogged: false,
    isAdmin: false,
    email: null,
    access_token: null,
    userAuth: null,
    respRegister: null,
    respChangePassword: null,
    isPasswordChanged: false,
    avatar: null,
    respLogin: null,

}
const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.wrongLogin = false;
                state.respLogin = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload.detail === "No active account found with the given credentials" || action.payload.detail === "You do not have permission to perform this action.") {
                    state.wrongLogin = true;

                }
                else {
                    state.isLogged = true;
                    state.access_token = action.payload.access;
                    state.userAuth = action.meta.arg.username;
                    Cookies.set('access_token', state.access_token, { expires: 30 });
                    state.respLogin = state.payload;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;

                state.wrongLogin = true;
                state.isLogged = false;
                state.respLogin = action.payload;
            })

            //register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.wrongLogin = false;
                state.respRegister = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.respRegister = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.wrongLogin = true;
                state.isLogged = false;
                state.isLoading = false;
                state.respRegister = action.payload;
            })

            //get_info
            .addCase(get_info.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(get_info.fulfilled, (state, action) => {

                state.isLoading = false;
                if (action.payload.detail !== "No active account found with the given credentials") {
                    state.isLogged = true;
                    state.isAdmin = action.payload.is_superuser;
                    state.userAuth = action.payload.username;
                    state.email = action.payload.email;
                    state.avatar = action.payload.avatar;
                    state.access_token = action.meta.arg;
                }
                else {
                    Cookies.remove('access_token');
                }
            })
            .addCase(get_info.rejected, (state) => {
                state.isLoading = false;
                state.isLogged = false;
                Cookies.remove('access_token');
            })

            //changePassword
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changePassword.fulfilled, (state, action) => {

                state.isLoading = false;
                if (action.payload.message === 'Password changed successfully.') {
                    state.isPasswordChanged = true;
                    state.isLogged = false;



                    state.respChangePassword = action.payload;
                }
                else {
                    state.isPasswordChanged = false;
                    state.respChangePassword = action.payload;

                }
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isPasswordChanged = false;

            })



    }
})

export default authSlice.reducer;
