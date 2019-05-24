import React from 'react';
import {Grid} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import SettingsNav from './SettingsNav';
import BasicPage from './BasicPage';
import AboutPage from './AboutPage';
import PhotosPage from './Photos/PhotosPage';
import AccountPage from './AccountPage';

const SettingsDashboard = () => {
    const profile = useSelector(state => state.firebase.profile);
    return (
        <Grid>
            <Grid.Column width={12}>
                <Switch>
                    <Redirect exact from='/settings' to='/settings/basic'/>
                    <Route path='/settings/basic' render={() => <BasicPage initialValues={profile}/> }/>
                    <Route path='/settings/about' render={() => <AboutPage initialValues={profile}/>}/>
                    <Route path='/settings/photos' component={PhotosPage}/>
                    <Route path='/settings/account' component={AccountPage}/>
                </Switch>
            </Grid.Column>
            <Grid.Column width={4}>
                <SettingsNav/>
            </Grid.Column>
        </Grid>
    );
};

export default SettingsDashboard;
