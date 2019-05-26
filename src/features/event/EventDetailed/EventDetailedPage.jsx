import React from 'react';
import {Grid} from 'semantic-ui-react';
import {connect, useSelector} from 'react-redux';
import {useFirestoreConnect, useFirebase, useFirestore} from 'react-redux-firebase';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import {objectToArray} from '../../../app/common/util/helpers';

const EventDetailedPage = ({match: {params}}) => {
    useFirestoreConnect(`events/${params.id}`);
    const event = useSelector(state => state.firestore.ordered.events && state.firestore.ordered.events[0]);
    const attendees = event && objectToArray(event.attendees);
    if (!event) return <LoadingComponent />;
    return (
        <Grid>
            <Grid.Column width={10}>
                <EventDetailedHeader event={event}/>
                <EventDetailedInfo event={event}/>
                <EventDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <EventDetailedSidebar attendees={attendees}/>
            </Grid.Column>
        </Grid>
    );
};

export default EventDetailedPage;

