import React, {Fragment} from 'react';
import {useSelector} from "react-redux";
import {Container} from 'semantic-ui-react';
import {Route, Switch} from 'react-router-dom';
import EventDashboard from '../../features/event/EventDashboard/EventDashboard';
import NavBar from '../../features/nav/NavBar/NavBar';
import EventDetailedPage from '../../features/event/EventDetailed/EventDetailedPage';
import PeopleDashboard from '../../features/user/PeopleDashboard/PeopleDashboard';
import UserDetailedPage from '../../features/user/UserDetailed/UserDetailedPage';
import SettingsDashboard from '../../features/user/Settings/SettingsDashboard';
import EventForm from '../../features/event/EventForm/EventForm';
import HomePage from '../../features/home/HomePage';
import TestComponent from '../../features/testarea/TestComponent';
import ModalManager from '../../features/modals/ModalManager';
import LoadingComponent from "./LoadingComponent";

const App = () => {
    const auth = useSelector(state => state.firebase.auth);
    if (!auth.isLoaded && auth.isEmpty) return <LoadingComponent />
    return (
        <Fragment>
            <ModalManager/>
            <Switch>
                <Route exact path='/' component={HomePage}/>
            </Switch>
            <Route
                path='/(.+)'
                render={() => (
                    <Fragment>
                        <NavBar/>
                        <Container className='main'>
                            <Switch>
                                <Route path='/events' component={EventDashboard}/>
                                <Route path='/test' component={TestComponent}/>
                                <Route path='/event/:id' component={EventDetailedPage}/>
                                <Route path='/manage/:id' component={EventForm}/>
                                <Route path='/people' component={PeopleDashboard}/>
                                <Route path='/profile/:id' component={UserDetailedPage}/>
                                <Route path='/settings' component={SettingsDashboard}/>
                                <Route path='/createEvent' component={EventForm}/>
                            </Switch>
                        </Container>
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default App;
