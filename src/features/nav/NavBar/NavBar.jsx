import React, {Fragment} from 'react';
import {Menu, Container, Button} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {NavLink, Link, withRouter} from 'react-router-dom';
import {useFirebase} from 'react-redux-firebase';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';

const NavBar = ({history}) => {
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth, []);

    const handleLogout = () => {
        firebase.auth().signOut().then(() => {
            history.push('/');
        });

    };

    const authenticated = auth.isLoaded && !auth.isEmpty;
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={Link} to='/' header>
                    <img src='/assets/logo.png' alt='logo'/>
                    Re-vents
                </Menu.Item>
                <Menu.Item as={NavLink} exact to='/events' name='Events'/>
                <Menu.Item as={NavLink} to='/test' name='Test'/>
                {authenticated && (
                    <Fragment>
                        <Menu.Item as={NavLink} to='/people' name='People'/>
                        <Menu.Item>
                            <Button
                                as={Link}
                                to='/createEvent'
                                floated='right'
                                positive
                                inverted
                                content='Create Event'
                            />
                        </Menu.Item>
                    </Fragment>
                )}

                {authenticated ? (
                    <SignedInMenu signOut={handleLogout}/>
                ) : (
                    <SignedOutMenu/>
                )}
            </Container>
        </Menu>
    );
};

export default withRouter(NavBar);
