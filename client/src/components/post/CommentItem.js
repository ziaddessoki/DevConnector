import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { removeComment } from "../../actions/post";

const CommentItem = ({
  postID,
  comment: { _id, text, name, avatar, user, date },
  auth,
  removeComment,
}) => (
  <div class="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img class="round-img" src={avatar} alt="" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p class="my-1">{text}</p>
      <p class="post-date">
        Posted on : <Moment format="YYYY-MM-DD HH:mm">{date}</Moment>
      </p>
      {!auth.loading && user === auth.user._id && (
        <button
          onClick={() => removeComment(postID, _id)}
          className="btn btn-danger"
          type="button"
        >
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  </div>
);

CommentItem.propTypes = {
  postID: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  removeComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { removeComment })(CommentItem);
