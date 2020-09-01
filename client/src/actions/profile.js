import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

// get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  console.log("hit here");
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
