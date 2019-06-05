import {toastr} from 'react-redux-toastr';
import cuid from 'cuid';
import {asyncActionError, asyncActionFinish, asyncActionStart} from '../async/asyncActions';
import {GET_USER_EVENTS} from './userConstants';
import firebase from '../../app/config/firebase';

export const updateProfile = ({firebase}, user) => {
    return async (dispatch) => {
        const {isLoaded, isEmpty, ...updatedUser} = user;
        try {
            await firebase.updateProfile(updatedUser);
            dispatch(() => toastr.success('Success', 'Your profile has been updated'));
        } catch (error) {
            console.log(error);
        }
    };
};

export const uploadProfileImage = ({firebase, firestore}, file) =>
    async (dispatch) => {
        const imageName = cuid();
        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`;
        const options = {
            name: imageName
        };
        try {
            dispatch(asyncActionStart());
            // upload the file to firebase storage
            let uploadedFile = await firebase.uploadFile(path, file, null, options);
            // get url of image
            let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
            // get userdoc
            let userDoc = await firestore.get(`users/${user.uid}`);
            // check if user has photo, if not update profile
            if (!userDoc.data().photoURL) {
                await firebase.updateProfile({
                    photoURL: downloadURL
                });
                await user.updateProfile({
                    photoURL: downloadURL
                });
            }
            // add the image to firestore
            await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}]
            }, {
                name: imageName,
                url: downloadURL
            });
            dispatch(asyncActionFinish());
        } catch (error) {
            console.log(error);
            dispatch(asyncActionError());
        }
    };

export const deletePhoto = ({firebase, firestore}, photo) =>
    async dispatch => {
        const user = firebase.auth().currentUser;
        try {
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
            await firestore.delete({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos', doc: photo.id}]
            });
        } catch (error) {
            console.log(error);
            throw new Error('Problem deleting the photo');
        }
    };

export const setMainPhoto = ({firebase, firestore}, photo) =>
    async dispatch => {
        const user = firebase.auth().currentUser;
        const today = new Date();
        let userDocRef = firestore.collection('users').doc(user.uid);
        let eventAttendeeRef = firestore.collection('event_attendee');
        try {
            dispatch(asyncActionStart());
            let batch = firestore.batch();

            batch.update(userDocRef, {
                photoURL: photo.url
            });

            let eventQuery = await eventAttendeeRef
                .where('userUid', '==', user.uid)
                .where('eventDate', '>=', today);

            let eventQuerySnap = await eventQuery.get();

            console.log(eventQuerySnap);

            for (let i=0; i<eventQuerySnap.docs.length; i++) {
                let eventDocRef = await firestore
                    .collection('events')
                    .doc(eventQuerySnap.docs[i].data().eventId);
                let event = await eventDocRef.get();
                if (event.data().hostUid === user.uid) {
                    batch.update(eventDocRef, {
                        hostPhotoURL: photo.url,
                        [`attendees.${user.uid}.photoURL`]: photo.url
                    });
                } else {
                    batch.update(eventDocRef, {
                        [`attendees.${user.uid}.photoURL`]: photo.url
                    })
                }
            }
            console.log(batch);
            await batch.commit();
            dispatch(asyncActionFinish());
        } catch (error) {
            console.log(error);
            dispatch(asyncActionError());
            throw new Error('Problem setting main photo');
        }
    };

export const goingToEvent = ({firebase, firestore}, event) =>
    async (dispatch, getState) => {
        const user = firebase.auth().currentUser;
        const profile = getState().firebase.profile;
        const attendee = {
            going: true,
            joinDate: firestore.FieldValue.serverTimestamp(),
            photoURL: profile.photoURL || '/assets/user.png',
            displayName: profile.displayName,
            host: false
        };
        try {
            await firestore.update(`events/${event.id}`, {
                [`attendees.${user.uid}`]: attendee
            });
            await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
                eventId: event.id,
                userUid: user.uid,
                eventDate: event.date,
                host: false
            });
            toastr.success('Success', 'You have signed up to the event');
        } catch (error) {
            console.log(error);
            toastr.error('Oops', 'Problem signing up to the event');
        }
    };

//TODO: this still contains the FieldValue.delete() bug so it will not remove the event from the reducer
export const cancelGoingToEvent = ({firebase, firestore}, event) =>
    async (dispatch) => {
        const user = firebase.auth().currentUser;
        try {
            await firestore.update(`events/${event.id}`, {
                [`attendees.${user.uid}`]: firestore.FieldValue.delete()
            });
            await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
            toastr.success('Success', 'You have removed yourself from the event');
        } catch (error) {
            console.log(error);
            toastr.error('Oops', 'Something went wrong');
        }
    };


//TODO: check to see if there is a way to preserve the data in ordered reducer when using RRF
export const getUserEvents = (userUid, activeTab) => async (
    dispatch,
    getState
) => {
    dispatch(asyncActionStart());
    const firestore = firebase.firestore();
    const today = new Date(Date.now());
    let eventsRef = firestore.collection('event_attendee');
    let query;
    switch (activeTab) {
        case 1: // past events
            query = eventsRef
                .where('userUid', '==', userUid)
                .where('eventDate', '<=', today)
                .orderBy('eventDate', 'desc');
            break;
        case 2: // future events
            query = eventsRef
                .where('userUid', '==', userUid)
                .where('eventDate', '>=', today)
                .orderBy('eventDate');
            break;
        case 3: // hosted events
            query = eventsRef
                .where('userUid', '==', userUid)
                .where('host', '==', true)
                .orderBy('eventDate', 'desc');
            break;
        default:
            query = eventsRef
                .where('userUid', '==', userUid)
                .orderBy('eventDate', 'desc');
            break;
    }

    try {
        let querySnap = await query.get();
        let events = [];

        for (let i = 0; i < querySnap.docs.length; i++) {
            let evt = await firestore
                .collection('events')
                .doc(querySnap.docs[i].data().eventId)
                .get();
            events.push({ ...evt.data(), id: evt.id });
        }

        dispatch({ type: GET_USER_EVENTS, payload: { events } });

        dispatch(asyncActionFinish());
    } catch (error) {
        console.log(error);
        dispatch(asyncActionError());
    }
};