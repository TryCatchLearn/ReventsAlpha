import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {incrementAsync, decrementAsync} from './testActions';
import {openModal} from '../modals/modalActions';
import {Button, Header} from 'semantic-ui-react';
import TestPlaceInput from './TestPlaceInput';
import SimpleMap from './SimpleMap';
import {toastr} from 'react-redux-toastr';
import firebase from '../../app/config/firebase';

const TestComponent = () => {
    const dispatch = useDispatch();

    const data = useSelector(state => state.test.data, []);
    const loading = useSelector(state => state.async.loading, []);
    const buttonName = useSelector(state => state.async.elementName, []);

    const handleTestUpdateProfile = async () => {
        const firestore = firebase.firestore();
        // doc = diana's userUid
        let userDocRef = await firestore
            .collection('users')
            .doc('455ZrcNYOCY2AwRDlJidBju368M2');
        try {
            await userDocRef.update({displayName: 'testing'});
            toastr.success('Success');
        } catch (error) {
            console.log(error);
            toastr.error('Computer says no');
        }
    };

    const handleCreateTestEvent = async () => {
        const firestore = firebase.firestore();
        let eventDocRef = await firestore.collection('events').doc('DELETEME');
        try {
            await eventDocRef.set({
                title: 'DELETEME'
            });
            toastr.success('Success');
        } catch (error) {
            console.log(error);
            toastr.error('Computer says no');
        }
    };

    const handleTestJoinEvent = async () => {
        const firestore = firebase.firestore();
        let eventDocRef = await firestore.collection('events').doc('DELETEME');
        const attendee = {
            photoURL: '/assets/user.png',
            displayName: 'Testing'
        };
        try {
            await eventDocRef.update({
                [`attendees.455ZrcNYOCY2AwRDlJidBju368M2`]: attendee
            });
            toastr.success('Success');
        } catch (error) {
            console.log(error);
            toastr.error('Computer says no');
        }
    };

    const handleTestCancelGoingToEvent = async () => {
        const firestore = firebase.firestore();
        let eventDocRef = await firestore.collection('events').doc('DELETEME');
        try {
            await eventDocRef.update({
                [`attendees.455ZrcNYOCY2AwRDlJidBju368M2`]: firebase.firestore.FieldValue.delete()
            });
            toastr.success('Success');
        } catch (error) {
            console.log(error);
            toastr.error('Computer says no');
        }
    };

    const handleTestChangeAttendeePhotoInEvent = async () => {
        const firestore = firebase.firestore();
        let eventDocRef = await firestore.collection('events').doc('DELETEME');
        try {
            await eventDocRef.update({
                [`attendees.455ZrcNYOCY2AwRDlJidBju368M2.photoURL`]: 'testing123.jpg'
            });
            toastr.success('Success');
        } catch (error) {
            console.log(error);
            toastr.error('Computer says no');
        }
    };

    return (
        <div>
            <h1>Test Area</h1>
            <h3>The answer is: {data}</h3>
            <Button
                name='increment'
                loading={buttonName === 'increment' && loading}
                onClick={(e) => dispatch(incrementAsync(e.target.name))}
                positive
                content='Increment'
            />
            <Button
                name='decrement'
                loading={buttonName === 'decrement' && loading}
                onClick={(e) => dispatch(decrementAsync(e.target.name))}
                negative
                content='Decrement'
            />
            <Button
                onClick={() => dispatch(openModal('TestModal', {data: 42}))}
                color='teal'
                content='Open Modal'
            />
            <br/>
            <br/>
            <Header as='h2' content='Permissions tests'/>
            <Button
                onClick={handleCreateTestEvent}
                color='blue'
                fluid
                content='Test create event - should fail if anon'
            />
            <Button
                onClick={handleTestUpdateProfile}
                color='orange'
                fluid
                content='Test update dianas profile - should fail if anon/not diana - should succeed if diana'
            />
            <Button
                onClick={handleTestJoinEvent}
                color='olive'
                fluid
                content='Test joining an event - should fail if anon/not diana - should succeed if diana'
            />
            <Button
                onClick={handleTestCancelGoingToEvent}
                color='purple'
                fluid
                content='Test cancelling attendance to an event - should fail if anon/not diana - should succeed if diana'
            />
            <Button
                onClick={handleTestChangeAttendeePhotoInEvent}
                color='violet'
                fluid
                content='Test changing photo for event attendee - should fail if anon/not diana - should succeed if diana'
            />
            <br/>
            <br/>
            <TestPlaceInput/>
            <br/>
            <SimpleMap/>
        </div>
    );
};

export default TestComponent;
