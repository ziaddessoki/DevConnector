import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  DELETE_ACCOUNT,
  CLEAR_PROFILE,
} from "./types";

// get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({
      type: PROFILE_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get All profiles
export const getAllProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
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

//Get  profile by ID
export const getProfileByID = (userID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userID}`);

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

//Get  Github repos
export const getRepos = (gitUser) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${gitUser}`);

    dispatch({
      type: GET_REPOS,
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

//Create or update profile
//will use history.push to redirect
//edit to differentiate if creating or updating
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add experience
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add Education
export const addEdu = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete experience
export const deleteExp = (exp_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${exp_id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete education
export const deleteEdu = (edu_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${edu_id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete Profile & account
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure you want to delete your account?!")) {
    try {
      await axios.delete("/api/profile/");

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: DELETE_ACCOUNT });
      dispatch(setAlert("ACCOUNT BEEN DELETED"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        //to get err msg and status set at the backend
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
