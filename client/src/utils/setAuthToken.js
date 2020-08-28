//to add and remove header {x-auth-toke:"token"}
import axios from 'axios';


const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token
    } else {
        delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken;