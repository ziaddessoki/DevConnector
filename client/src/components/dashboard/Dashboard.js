import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const Dashboard = (props) => {
  //since its functional component, useEffect for lifeCycle
  //[] is added a second param its would act as 'componentWillMount' just load ONCE
  //else it will keep running
  useEffect(() => {
    props.getCurrentProfile();
  }, [getCurrentProfile]);
  return props.profile.profile === null && props.profile.loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        {/* if auth.user then render .name */}
        <i className="fas fa-user" /> Welcome{" "}
        {props.auth.user && props.auth.user.name}
      </p>
      {/* check if the user have a profile */}
      {props.profile.profile !== null ? (
        <Fragment>has</Fragment>
      ) : (
        <Fragment>
          <p>You didn't setup your profile yet, please create one!!</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
