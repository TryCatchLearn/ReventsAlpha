import {closeModal} from "../modals/modalActions";
import {SubmissionError, reset} from 'redux-form';
import toastr from 'react-redux-toastr'

export const login = ({firebase}, user) =>
    async dispatch => {
        try {
            await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
            dispatch(closeModal())
        } catch (error) {
            console.log(error);
            throw new SubmissionError({
                _error: error.message
            });
        }
    };

export const registerUser = ({firebase, firestore}, user) =>
    async dispatch => {
        try {
            let createdUser = await firebase
                .auth()
                .createUserWithEmailAndPassword(user.email, user.password);
            console.log(createdUser);
            await createdUser.user.updateProfile({
                displayName: user.displayName
            });
            let newUser = {
                displayName: user.displayName,
                createdAt: firestore.FieldValue.serverTimestamp()
            };
            await firestore.set(`users/${createdUser.user.uid}`, {...newUser})
            dispatch(closeModal());
        } catch (error) {
            console.log(error);
            throw new SubmissionError({
                _error: error.message
            });
        }
    };

export const socialLogin = ({firebase, firestore}, selectedProvider) =>
    async dispatch => {
        try {
            dispatch(closeModal());
            let user = await firebase.login({
                provider: selectedProvider,
                type: 'popup'
            });
            if (user.additionalUserInfo.isNewUser) {
                await firestore.set(`users/${user.user.uid}`, {
                    displayName: user.profile.displayName,
                    photoURL: user.profile.avatarUrl,
                    createdAt: firestore.FieldValue.serverTimestamp()
                })
            }
        } catch (error) {
            console.log(error)
        }
    };

export const updatePassword = ({firebase}, creds) =>
    async dispatch => {
        const user = firebase.auth().currentUser;
        try {
            await user.updatePassword(creds.newPassword1);
            await dispatch(reset('account'));
            toastr.success('Success', 'Your password has been updated');
        } catch (error) {
            throw new SubmissionError({
                _error: error.message
            });
        }
    }