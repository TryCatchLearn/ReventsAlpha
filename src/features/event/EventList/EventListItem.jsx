import React from 'react';
import {Item, Segment, Icon, List, Button, Label} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {format} from 'date-fns';
import EventListAttendee from './EventListAttendee';
import {objectToArray} from '../../../app/common/util/helpers';

const EventListItem = ({event}) =>
    <Segment.Group>
        <Segment>
            <Item.Group>
                <Item>
                    <Item.Image size='tiny' circular src={event.hostPhotoURL}/>
                    <Item.Content>
                        <Item.Header as={Link} to={`events/${event.id}`}>{event.title}</Item.Header>
                        <Item.Description>Hosted by <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link></Item.Description>
                        {event.cancelled &&
                        <Label
                            style={{ top: '-40px' }}
                            ribbon="right"
                            color="red"
                            content="This event has been cancelled"
                        />}
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name='clock'/> {format(event.date && event.date.toDate(), 'EEEE do LLLL')} at{' '}
              {format(event.date && event.date.toDate(), 'HH:mm')} |
            <Icon name='marker'/> {event.venue}
          </span>
        </Segment>
        <Segment secondary>
            <List horizontal>
                {event.attendees &&
                objectToArray(event.attendees).map((attendee) => (
                    <EventListAttendee key={attendee.id} attendee={attendee}/>
                ))}
            </List>
        </Segment>
        <Segment clearing>
            <span>{event.description}</span>
            <Button
                as={Link}
                to={`/events/${event.id}`}
                color='teal'
                floated='right'
                content='View'
            />
        </Segment>
    </Segment.Group>;

export default EventListItem;
