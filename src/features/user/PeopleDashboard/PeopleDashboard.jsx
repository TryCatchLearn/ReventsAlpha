import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import { Grid, Segment, Header, Card } from 'semantic-ui-react';
import PersonCard from './PersonCard';

const PeopleDashboard = () => {
    const auth = useSelector(state => state.firebase.auth);
    const followingQuery = useMemo(() => ({
        collection: 'following',
        doc: auth.uid,
        subcollections: [{collection: 'following'}],
        storeAs: 'following'
    }), [auth.uid]);
    const followerQuery = useMemo(() => ({
        collection: 'followers',
        doc: auth.uid,
        subcollections: [{collection: 'followers'}],
        storeAs: 'followers'
    }), [auth.uid]);
    useFirestoreConnect(followerQuery);
    useFirestoreConnect(followingQuery);
    const followers = useSelector(state => state.firestore.ordered.followers);
    const followings = useSelector(state => state.firestore.ordered.following);

    return (
        <Grid>
            <Grid.Column width={16}>
                <Segment>
                    <Header dividing content="People following me" />
                    <Card.Group itemsPerRow={8} stackable>
                        {followers &&
                        followers.map(follower => <PersonCard key={follower.id} user={follower} />)}
                    </Card.Group>
                </Segment>
                <Segment>
                    <Header dividing content="People I'm following" />
                    <Card.Group itemsPerRow={8} stackable>
                        {followings &&
                        followings.map(following => <PersonCard key={following.id} user={following} />)}
                    </Card.Group>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default PeopleDashboard;
