import {createReducer} from '../../app/common/util/reducerUtils';
import {GET_USER_EVENTS} from './userConstants';

const initialState = {
    events: []
};

const getUserEvents = (state, payload) => {
    return {
        ...state,
        events: payload.events
    }
};

export default createReducer(initialState, {
    [GET_USER_EVENTS]: getUserEvents
})