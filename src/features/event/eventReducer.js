import { CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT, FETCH_EVENTS } from './eventConstants';
import { createReducer } from '../../app/common/util/reducerUtils';

 const initialState = [];

export const createEvent = (state, payload) => {
  return [...state, Object.assign({}, payload.event)];
};

export const updateEvent = (state, payload) => {
  return [
    ...state.filter(event => event.id !== payload.event.id),
    Object.assign({}, payload.event)
  ];
};

export const deleteEvent = (state, payload) => {
  console.log(payload);
  return [...state.filter(event => event.id !== payload.eventId)];
};

export const fetchEvents = (state, payload) => {
  return payload.events
}

export default createReducer(initialState, {
  [CREATE_EVENT]: createEvent,
  [DELETE_EVENT]: deleteEvent,
  [UPDATE_EVENT]: updateEvent,
  [FETCH_EVENTS]: fetchEvents
});
