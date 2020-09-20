import axios from "axios";
import { setAlert } from "./alert";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";

//Get Posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Like Post
export const addLike = (postID) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${postID}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postID, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Unlike Post
export const removeLike = (postID) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postID}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postID, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      //to get err msg and status set at the backend
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
