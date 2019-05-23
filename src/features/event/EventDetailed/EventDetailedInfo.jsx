import React, { Component } from 'react';
import { Segment, Grid, Icon, Button } from 'semantic-ui-react';
import {format, parseISO} from 'date-fns';
import EventDetailedMap from './EventDetailedMap';

class EventDetailedInfo extends Component {
  state = {
    showMap: false
  };

  showMapToggle = () => {
    this.setState(({ showMap }) => ({
      showMap: !showMap
    }));
  };

  render() {
    const { event } = this.props;
    const { showMap } = this.state;
    return (
      <Segment.Group>
        <Segment attached='top'>
          <Grid>
            <Grid.Column width={1}>
              <Icon size='large' color='teal' name='info' />
            </Grid.Column>
            <Grid.Column width={15}>
              <p>{event.description}</p>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign='middle'>
            <Grid.Column width={1}>
              <Icon name='calendar' size='large' color='teal' />
            </Grid.Column>
            <Grid.Column width={15}>
              <span>{format(parseISO(event.date), 'EEEE do LLLL')} at {format(parseISO(event.date), 'h:mm a')}</span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign='middle'>
            <Grid.Column width={1}>
              <Icon name='marker' size='large' color='teal' />
            </Grid.Column>
            <Grid.Column width={11}>
              <span>{event.venue}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                onClick={this.showMapToggle}
                color='teal'
                size='tiny'
                content={showMap ? 'Hide Map' : 'Show Map'}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        {showMap && (
          <EventDetailedMap
            lat={event.venueLatLng.lat}
            lng={event.venueLatLng.lng}
          />
        )}
      </Segment.Group>
    );
  }
}

export default EventDetailedInfo;
