import React from 'react'
import { Card, Grid, Header, Image, Segment, Tab } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {format} from 'date-fns';

const panes = [
    {menuItem: 'All Events', panse: {key: 'allEvents'}},
    {menuItem: 'Past Events', panse: {key: 'pastEvents'}},
    {menuItem: 'Future Events', panse: {key: 'futureEvents'}},
    {menuItem: 'Hosting', panse: {key: 'hosted'}}
];

const UserDetailedEvents = ({changeTab, events, loading}) => {
    return (
        <Grid.Column width={12}>
            <Segment attached loading={loading}>
                <Header icon="calendar" content="Events" />
                <Tab onTabChange={(e, data) => changeTab(e, data)} panes={panes} menu={{secondary: true, pointing: true}}/>
                <br/>

                <Card.Group itemsPerRow={5}>
                    {events &&
                    events.map(event => (
                        <Card as={Link} to={`/events/${event.id}`} key={event.id}>
                            <Image src={`/assets/categoryImages/${event.category}.jpg`} />
                            <Card.Content>
                                <Card.Header textAlign='center'>{event.title}</Card.Header>
                                <Card.Meta textAlign='center'>
                                    <div>{format(event.date && event.date.toDate(), 'dd LLL yyyy')}</div>
                                    <div>{format(event.date && event.date.toDate(), 'h:mm a')}</div>
                                </Card.Meta>
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Group>
            </Segment>
        </Grid.Column>
    )
};

export default UserDetailedEvents