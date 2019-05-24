import {toastr} from 'react-redux-toastr';
import cuid from 'cuid';
import {asyncActionError, asyncActionFinish, asyncActionStart} from '../async/asyncActions';

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

export const setMainPhoto = ({firebase}, photo) =>
    async dispatch => {
        try {
            return await firebase.updateProfile({
                photoURL: photo.url
            });
        } catch (error) {
            console.log(error);
            throw new Error('Problem setting main photo');
        }
    };