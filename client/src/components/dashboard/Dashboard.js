import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";

const Dashboard = (props) => {
  //since its functional component, useEffect for lifeCycle
  //[] is added a second param its would act as 'componentWillMount' just load ONCE
  //else it will keep running
  useEffect(() => {
    props.getCurrentProfile();
  }, [getCurrentProfile]);
  return <div>dashboard</div>;
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
