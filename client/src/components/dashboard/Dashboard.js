import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GetCurrentProfile } from "../../actions/profile";

const Dashboard = (props) => {
  return <div>dashboard</div>;
};

Dashboard.propTypes = {
  GetCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { GetCurrentProfile })(Dashboard);
