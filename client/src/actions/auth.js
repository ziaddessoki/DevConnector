import axios from 'axios';
import { setAlert } from './alert'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADER,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from './types';
import setAuthToken from '../utils/setAuthToken';


//Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        //grab the token from localStorage and set Header={x-auth-token:'token'}
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADER,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        })

    }
}
//Log in User
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            "content-type": "application/json"
        }
    }
    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: LOGIN_FAIL,
        })
    }
}

//Register User
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            "content-type": "application/json"
        }
    }
    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: REGISTER_FAIL,
        })
    }
}