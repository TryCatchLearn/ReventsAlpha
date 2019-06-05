import {toastr} from 'react-redux-toastr';
import {asyncActionStart, asyncActionFinish, asyncActionError} from '../async/asyncActions';
import {createNewEvent, objectToArray} from '../../app/common/util/helpers';
import {MORE_EVENTS} from './eventConstants';

export const createEvent = ({firebase, firestore}, event) => {
    return async (dispatch, getState) => {
        const user = firebase.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        const newEvent = createNewEvent(user, photoURL, event, firestore);
        try {
            let createdEvent = await firestore.add('events', newEvent);
            await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
                eventId: createdEvent.id,
                userUid: user.uid,
                eventDate: event.date,
                host: true
            });
            toastr.success('Success!', 'Event has been created');
            return createdEvent;
        } catch (error) {
            toastr.error('Oops', 'Something went wrong');
        }
    };
};

export const updateEvent = ({firestore}, event) => {
    return async (dispatch, getState) => {
        try {
            dispatch(asyncActionStart());
            let eventDocRef = firestore.collection('events').doc(event.id);
            let dateEqual = getState().firestore.ordered.events[0].date.isEqual(event.date);
            if (!dateEqual) {
                let batch = firestore.batch();
                batch.update(eventDocRef, event);

                let eventAttendeeRef = firestore.collection('event_attendee');
                let eventAttendeeQuery = await eventAttendeeRef.where('eventId', '==', event.id);
                let eventAttendeeQuerySnap = await eventAttendeeQuery.get();

                for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
                    let eventAttendeeDocRef = firestore
                        .collection('event_attendee')
                        .doc(eventAttendeeQuerySnap.docs[i].id);

                    batch.update(eventAttendeeDocRef, {
                        eventDate: event.date
                    })
                }
                await batch.commit();
            } else {
                await eventDocRef.update(event);
            }
            toastr.success('Success!', 'Event has been updated');
            dispatch(asyncActionFinish());
        } catch (error) {
            dispatch(asyncActionError());
            toastr.error('Oops', 'Something went wrong');
        }
    };
};

export const cancelToggle = ({firestore}, cancelled, eventId) =>
    async dispatch => {
        const message = cancelled
            ? 'Are you sure you want to cancel the event?'
            : 'This will reactivate the event - are you sure?Ì';
        try {
            toastr.confirm(message, {
                onOk: () =>
                    firestore.update(`events/${eventId}`, {
                        cancelled: cancelled
                    })
            });
        } catch (error) {
            console.log(error);
        }
    };

export const getPagedEvents = ({firestore}) =>
    async (dispatch, getState) => {
        dispatch(asyncActionStart());
        const LIMIT = 2;
        let nextEventSnapshot = null;
        const {firestore: {data: {events: items}}} = getState();
        if (items && Object.keys(items).length >= LIMIT) {
            let itemsArray = objectToArray(items);
            nextEventSnapshot = await firestore.collection('events').doc(itemsArray[itemsArray.length - 1].id).get();
        }

        let querySnap = await firestore.get({
            collection: 'events',
            limit: LIMIT,
            where: ['date', '>=', new Date()],
            orderBy: ['date'],
            startAfter: nextEventSnapshot,
            storeAs: 'events'
        });

        if (querySnap.docs.length < LIMIT) {
            dispatch({type: MORE_EVENTS});
        }
        dispatch(asyncActionFinish());
    };

export const addEventComment = ({firebase}, eventId, values, parentId) =>
    async (dispatch, getState) => {
        const profile = getState().firebase.profile;
        const user = firebase.auth().currentUser;
        let newComment = {
            parentId: parentId,
            displayName: profile.displayName,
            photoURL: profile.photoURL || '/assets/user.png',
            uid: user.uid,
            text: values.comment,
            date: Date.now()
        };
        try {
            await firebase.push(`event_chat/${eventId}`, newComment);
        } catch (error) {
            console.log(error);
            toastr.error('Oops', 'Problem adding comment');
        }
    };
