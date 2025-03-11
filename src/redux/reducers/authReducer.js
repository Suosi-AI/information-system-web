// src/redux/reducers/authReducer.js
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './../type'

const initialState = {
  loading: false,
  authenticated: false,
  token: null,
  error: null
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        authenticated: true,
        token: action.payload.token
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        authenticated: false,
        error: action.payload
      }
    default:
      return state
  }
}