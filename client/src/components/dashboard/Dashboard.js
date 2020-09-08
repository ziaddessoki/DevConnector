import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";

//deconstructing props
const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
  deleteAccount,
}) => {
  //since its functional component, useEffect for lifeCycle
  //[] is added a second param its would act as 'componentWillMount' just load ONCE
  //else it will keep running
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return profile === null && loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        {/* if auth.user then render .name */}
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {/* check if the user have a profile */}
      {profile !== null ? (
        <Fragment>
          <DashboardActions />

          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus"></i>DELETE ACCOUNT
            </button>
          </div>
        </Fragment>
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
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
