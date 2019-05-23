import { createReducer } from "../../app/common/util/reducerUtils";
import {LOGIN_USER, SIGN_OUT_USER} from './authConstants';

const initialState = {
    currentUser: {}
}

export const loginUser = (state, payload) => {
    return {
        ...state,
        authenticated: true,
        currentUser: payload.creds.email
    }
}

export const signOutUser = (state, payload) => {
    return {
        ...state,
        authenticated: false,
        currentUser: {}
    }
}

export default createReducer(initialState, {
    [LOGIN_USER]: loginUser,
    [SIGN_OUT_USER]: signOutUser
}) 