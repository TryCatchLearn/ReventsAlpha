import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const NotFound = ({ history }) => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Oops - we've looked everywhere but couldn't find this.
            </Header>
            <Segment.Inline>
                <Button onClick={() => history.push('/events')} primary>
                    Return to Events page
                </Button>
            </Segment.Inline>
        </Segment>
    );
};

export default withRouter(NotFound);
