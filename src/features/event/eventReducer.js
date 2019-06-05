import {CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT, MORE_EVENTS} from './eventConstants';
import { createReducer } from '../../app/common/util/reducerUtils';

const initialState = {
  events: [],
  moreEvents: true
};

export const createEvent = (state, payload) => {
  return [...state.events, Object.assign({}, payload.event)];
};

export const updateEvent = (state, payload) => {
  return [
    ...state.events.filter(event => event.id !== payload.event.id),
    Object.assign({}, payload.event)
  ];
};

export const deleteEvent = (state, payload) => {
  return [...state.events.filter(event => event.id !== payload.eventId)];
};

export const moreEvents = (state) => {
  return {
    ...state.events,
    moreEvents: false
  }
};

export default createReducer(initialState, {
  [CREATE_EVENT]: createEvent,
  [DELETE_EVENT]: deleteEvent,
  [UPDATE_EVENT]: updateEvent,
  [MORE_EVENTS]: moreEvents
});
