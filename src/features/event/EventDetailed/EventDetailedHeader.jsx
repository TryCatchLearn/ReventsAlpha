import React, {Fragment} from 'react';
import {Segment, Image, Item, Header, Button, Label} from 'semantic-ui-react';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {format} from 'date-fns';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {goingToEvent, cancelGoingToEvent} from '../../user/userActions';
import {openModal} from '../../modals/modalActions';

const eventImageStyle = {
    filter: 'brightness(30%)'
};

const eventImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

const EventDetailedHeader = ({event, isHost, isGoing, authenticated}) => {
    const firestore = useFirestore();
    const firebase = useFirebase();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.async.loading, []);
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                <Image
                    src={`/assets/categoryImages/${event.category}.jpg`}
                    fluid
                    style={eventImageStyle}
                />

                <Segment basic style={eventImageTextStyle}>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={event.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(event.date && event.date.toDate(), 'EEEE do LLLL')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>

            <Segment attached='bottom' clearing>
                {event.cancelled && (
                    <Label
                        size='large'
                        color='red'
                        content='This event has been cancelled'
                    />
                )}
                {!isHost && (
                    <Fragment>
                        {isGoing && !event.cancelled && (
                            <Button onClick={() => dispatch(cancelGoingToEvent({firebase, firestore}, event))}>
                                Cancel My Place
                            </Button>
                        )}
                        {!isGoing && authenticated && !event.cancelled && (
                            <Button
                                loading={loading}
                                onClick={() => dispatch(goingToEvent({firebase, firestore}, event))}
                                color='teal'
                            >
                                JOIN THIS EVENT
                            </Button>
                        )}
                        {!authenticated && !event.cancelled && (
                            <Button
                                loading={loading}
                                onClick={() => dispatch(openModal('UnauthModal'))}
                                color='teal'
                            >
                                JOIN THIS EVENT
                            </Button>
                        )}
                    </Fragment>
                )}

                {isHost && (
                    <Button
                        as={Link}
                        to={`/manage/${event.id}`}
                        color='orange'
                        floated='right'
                    >
                        Manage Event
                    </Button>
                )}
            </Segment>
        </Segment.Group>
    );
};

export default EventDetailedHeader;
