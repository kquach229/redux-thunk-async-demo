// Bring in the redux library
const redux = require("redux");

// Bring in the createStore function from the redux library
const createStore = redux.createStore;

// Bring in the applyMiddleware function from the redux library
const applyMiddleware = redux.applyMiddleware;

// Bring in the redux thunk library
const reduxThunk = require("redux-thunk").default;

// Bring in the axios library
const axios = require("axios");

// Create the initial state
const initialState = {
  loading: false,
  users: [],
  error: "",
};

// Create the action constants
const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

// Create the action creators
const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

// Create the thunk function that we will ultimately pass into dispatch later
const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUsersRequest());
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const users = response.data.map((user) => user.id);
        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {
        dispatch(fetchUsersFailure(error.message));
      });
  };
};

// Create the reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };

    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
  }
};

// Create the store and pass in the reducer as well as the middleware
const store = createStore(reducer, applyMiddleware(reduxThunk));

// Subscribe to the store to get the state of the store
store.subscribe(() => {
  console.log(store.getState());
});

// Dispatch the thunk function containing the axios call
store.dispatch(fetchUsers());
