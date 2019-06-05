import React, {useState, useEffect} from 'react';
import {Grid, Loader} from 'semantic-ui-react';
import {useSelector, useDispatch} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import EventList from '../EventList/EventList';
import EventActivity from '../EventActivity/EventActivity';
import {getPagedEvents} from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import {objectToArray} from '../../../app/common/util/helpers';

const EventDashboard = () => {
    const dispatch = useDispatch();
    const firestore = useFirestore();
    const [loadingInitial, setLoadingInitial] = useState(true);

    const events = useSelector(state => objectToArray(state.firestore.data.events) || []);
    const moreEvents = useSelector(state => state.events.moreEvents);
    const loading = useSelector(state => state.async.loading);

    useEffect(() => {
        const getEvents = async () => {
            await dispatch(getPagedEvents({firestore}));
        };
        if (events.length === 0) {
            getEvents().then(() => {
                setLoadingInitial(false);
            })
        } else {
            setLoadingInitial(false);
        }

    }, [dispatch, firestore, events]);

    const handleGetNextEvents = async () => {
        await dispatch(getPagedEvents({firestore}));
    };

    if (loadingInitial) return <LoadingComponent/>;
    return (
        <Grid>
            <Grid.Column width={10}>
                <EventList events={events} loading={loading} moreEvents={moreEvents}
                           getNextEvents={handleGetNextEvents}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <EventActivity />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loading}/>
            </Grid.Column>
        </Grid>
    );
};

export default EventDashboard;
