import React from 'react';
import {Grid} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import {objectToArray} from '../../../app/common/util/helpers';
import NotFound from '../../../app/layout/NotFound';

const EventDetailedPage = ({match: {params}}) => {
    useFirestoreConnect(`events/${params.id}`);

    const event = useSelector(state => (state.firestore.ordered.events
        && state.firestore.ordered.events.filter(e => e.id === params.id)[0]) || {}, []);

    const auth = useSelector(state => state.firebase.auth, []);

    const attendees = event && event.attendees && objectToArray(event.attendees).sort((a, b) => {
        return a.joinDate.toDate() - b.joinDate.toDate();
    });

    const isHost = event && event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const authenticated = auth.isLoaded && !auth.isEmpty;
    const loadingEvent = useSelector(state => state.firestore.status.requesting[`events/${params.id}`], []);

    if (loadingEvent) return <LoadingComponent/>;
    if (Object.keys(event).length === 0) return <NotFound/>;

    return (
        <Grid>
            <Grid.Column width={10}>
                <EventDetailedHeader event={event} isHost={isHost} isGoing={isGoing} authenticated={authenticated}/>
                <EventDetailedInfo event={event}/>
                {authenticated &&
                <EventDetailedChat eventId={event.id}/>}
            </Grid.Column>
            <Grid.Column width={6}>
                <EventDetailedSidebar attendees={attendees}/>
            </Grid.Column>
        </Grid>
    );
};

export default EventDetailedPage;

