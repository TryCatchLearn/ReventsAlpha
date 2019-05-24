import React, {useState, useEffect, Fragment, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useFirestoreConnect, useFirestore, useFirebase} from 'react-redux-firebase';
import {
    Image,
    Segment,
    Header,
    Divider,
    Grid,
    Button
} from 'semantic-ui-react';
import DropzoneInput from './DropZoneInput';
import CropperInput from './CropperInput';
import {
    uploadProfileImage,
    deletePhoto,
    setMainPhoto
} from '../../userActions';
import {toastr} from 'react-redux-toastr';
import UserPhotos from './UserPhotos';

const PhotosPage = (selector, deps) => {
        //TODO: bug in the photos where it adds an extra photo to reducer
        const dispatch = useDispatch();
        const firestore = useFirestore();
        const firebase = useFirebase();

        // firestoreConnect equivalent
        useFirestoreConnect(`users/${firebase.auth().currentUser.uid}/photos`);

        // mapstate equivalent
        const auth = useSelector(state => state.firebase.auth);
        const profile = useSelector(state => state.firebase.profile);
        const loading = useSelector(state => state.async.loading);
        const photos = useSelector(state => state.firestore.ordered[`users/${auth.uid}`]);

        // actions equivalent
        const [files, setFiles] = useState([]);
        const [cropResult, setCropResult] = useState('');
        const [image, setImage] = useState(null);


        useEffect(() => {
            return () => {
                files.forEach(file => URL.revokeObjectURL(file.preview));
                URL.revokeObjectURL(cropResult);
            };
        }, [files, cropResult]);

        const handleUploadImage = useCallback(
            async () => {
                try {
                    await dispatch(uploadProfileImage({firebase, firestore}, image));
                    handleCancelCrop();
                    toastr.success('Success', 'Photo has been uploaded');
                } catch (error) {
                    console.log(error);
                    toastr.error('Oops', 'Something went wrong');
                }
            }, [dispatch, firebase, firestore, image]
        );

        const handleCancelCrop = () => {
            setFiles([]);
            setImage(null);
            setCropResult('');
        };

        const handleDeletePhoto = useCallback(
            async (photo) => {
                try {
                    await dispatch(deletePhoto({firebase, firestore}, photo));
                } catch (error) {
                    toastr.error('Oops', error.message);
                }
            }, [dispatch, firebase, firestore]
        );

        const handleSetMainPhoto = useCallback(
            async (photo) => {
                try {
                    await dispatch(setMainPhoto({firebase}, photo));
                } catch (error) {
                    toastr.error('Oops', error.message);
                }
            }, [dispatch, firebase]
        );

        return (
            <Segment>
                <Header dividing size='large' content='Your Photos'/>
                <Grid>
                    <Grid.Row/>
                    <Grid.Column width={4}>
                        <Header color='teal' sub content='Step 1 - Add Photo'/>
                        <DropzoneInput setFiles={setFiles}/>
                    </Grid.Column>
                    <Grid.Column width={1}/>
                    <Grid.Column width={4}>
                        <Header sub color='teal' content='Step 2 - Resize image'/>
                        {files.length > 0 && (
                            <CropperInput
                                imagePreview={files[0].preview}
                                setImage={setImage}
                                setCropResult={setCropResult}
                            />
                        )}
                    </Grid.Column>
                    <Grid.Column width={1}/>
                    <Grid.Column width={4}>
                        <Header sub color='teal' content='Step 3 - Preview & Upload'/>
                        {files.length > 0 && (
                            <Fragment>
                                <Image
                                    src={cropResult}
                                    style={{minHeight: '200px', minWidth: '200px'}}
                                />
                                <Button.Group>
                                    <Button
                                        loading={loading}
                                        onClick={handleUploadImage}
                                        style={{width: '100px'}}
                                        positive
                                        icon='check'
                                    />
                                    <Button
                                        disabled={loading}
                                        onClick={handleCancelCrop}
                                        style={{width: '100px'}}
                                        icon='close'
                                    />
                                </Button.Group>
                            </Fragment>
                        )}
                    </Grid.Column>
                </Grid>

                <Divider/>
                <UserPhotos
                    photos={photos}
                    profile={profile}
                    deletePhoto={handleDeletePhoto}
                    setMainPhoto={handleSetMainPhoto}
                />
            </Segment>
        );
    }
;

export default PhotosPage;
