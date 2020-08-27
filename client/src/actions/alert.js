import uuid from 'uuid'//uni
import { SET_ALERT, REMOVE_ALERT } from './types';


//this function made to access multiple actions, using Thunk
export const setAlert = (msg, alertType) => dispatch => {
    //generate random universal ID
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })
}