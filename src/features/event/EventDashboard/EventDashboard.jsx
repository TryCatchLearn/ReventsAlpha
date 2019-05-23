import React from 'react';
import {Grid} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from "react-redux-firebase";
import EventList from '../EventList/EventList';
import EventActivity from '../EventActivity/EventActivity';

const EventDashboard = () => {
    useFirestoreConnect('events');

    const events = useSelector(state => state.firestore.ordered.events);
    return (
        <Grid>
            <Grid.Column width={10}>
                <EventList events={events}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <EventActivity/>
            </Grid.Column>
        </Grid>
    );
};

export default EventDashboard;
