import React from 'react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect, useFirebase} from 'react-redux-firebase';
import {Grid} from 'semantic-ui-react';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedEvents from './UserDetailedEvents';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedSidebar from './UserDetailedSidebar';

const UserDetailedPage = () => {
    const firebase = useFirebase();
    const userUid = firebase.auth().currentUser.uid;
    useFirestoreConnect(`users/${userUid}/photos`);

    const profile = useSelector(state => state.firebase.profile);
    const photos = useSelector(state => state.firestore.ordered[`users/${userUid}`]);
    return (
        <Grid>
            <UserDetailedHeader profile={profile}/>
            <UserDetailedDescription profile={profile}/>
            <UserDetailedSidebar/>
            {photos && photos.length > 0 &&
            <UserDetailedPhotos photos={photos}/>}
            <UserDetailedEvents/>
        </Grid>
    );
};

export default UserDetailedPage;