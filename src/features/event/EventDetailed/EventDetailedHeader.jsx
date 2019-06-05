import React, {Fragment} from 'react';
import {Segment, Image, Item, Header, Button} from 'semantic-ui-react';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {format} from 'date-fns';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {goingToEvent, cancelGoingToEvent} from '../../user/userActions';

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

const EventDetailedHeader = ({event, isHost, isGoing}) => {
    const firestore = useFirestore();
    const firebase = useFirebase();
    const dispatch = useDispatch();
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
                {!isHost &&
                <Fragment>
                    {isGoing ?
                        <Button
                            onClick={() => dispatch(cancelGoingToEvent({firebase, firestore}, event))}>
                            Cancel My Place
                        </Button> :

                        <Button onClick={() => dispatch(goingToEvent({firebase, firestore}, event))} color='teal'>JOIN
                            THIS EVENT</Button>}
                </Fragment>
                }


                {isHost &&
                <Button as={Link} to={`/manage/${event.id}`} color='orange' floated='right'>
                    Manage Event
                </Button>}
            </Segment>
        </Segment.Group>
    );
};

export default EventDetailedHeader;
