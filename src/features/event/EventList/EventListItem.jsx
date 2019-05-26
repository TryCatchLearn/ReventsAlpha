import React, { Component } from 'react';
import { Item, Segment, Icon, List, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import EventListAttendee from './EventListAttendee';

class EventListItem extends Component {
  render() {
    const { event, deleteEvent } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size='tiny' circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header>{event.title}</Item.Header>
                <Item.Description>Hosted by {event.hostedBy}</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name='clock' /> {format(event.date && event.date.toDate(), 'EEEE do LLLL')} at{' '}
            {format(event.date.toDate(), 'HH:mm')} |
            <Icon name='marker' /> {event.venue}
          </span>
        </Segment>
        <Segment secondary>
          <List horizontal>
            {event.attendees &&
              Object.values(event.attendees).map((attendee, index) => (
                <EventListAttendee key={index} attendee={attendee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>
          <Button
            as={Link}
            to={`/event/${event.id}`}
            color='teal'
            floated='right'
            content='View'
          />
          <Button
            onClick={() => deleteEvent(event.id)}
            color='red'
            floated='right'
            content='Delete'
          />
        </Segment>
      </Segment.Group>
    );
  }
}

export default EventListItem;
