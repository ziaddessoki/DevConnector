import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

// get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  if (localStorage.token) {
    //grab the token from localStorage and set Header={x-auth-token:'token'}
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      //to get err msg and status setted at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
