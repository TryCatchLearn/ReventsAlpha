import {
    INCREMENT_COUNTER,
    DECREMENT_COUNTER,
    COUNTER_ACTION_STARTED,
    COUNTER_ACTION_FINISHED
} from './testConstants';
import {ASYNC_ACTION_START} from '../async/asyncConstants';
import {asyncActionFinish} from '../async/asyncActions';

export const incrementCounter = () => {
    return {
        type: INCREMENT_COUNTER
    };
};

export const decrementCounter = () => {
    return {
        type: DECREMENT_COUNTER
    };
};

export const startCounterAction = () => {
    return {
        type: COUNTER_ACTION_STARTED
    };
};

export const finishCounterAction = () => {
    return {
        type: COUNTER_ACTION_FINISHED
    };
};

const delay = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const incrementAsync = (name) => {
    return async dispatch => {
        dispatch({type: ASYNC_ACTION_START, payload: name});
        await delay(1000);
        dispatch(incrementCounter());
        dispatch(asyncActionFinish());
    };
};

export const decrementAsync = (name) => {
    return async dispatch => {
        dispatch({type: ASYNC_ACTION_START, payload: name});
        await delay(1000);
        dispatch({type: DECREMENT_COUNTER});
        dispatch(asyncActionFinish());
    };
};
