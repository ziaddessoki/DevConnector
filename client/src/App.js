import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./App.css";
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar'
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken'


if (localStorage.token) {
  //grab the token from localStorage and set Header={x-auth-token:'token'}
  setAuthToken(localStorage.token)
}


const App = () => {

  //since its functional component, useEffect for lifeCycle
  //[] is added a second param its would act as 'componentWillMount' just load ONCE
  //else it will keep running
  //calling for users data, everyTime the app runs(refresh)
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (

    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar></Navbar>
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
};
export default App;
