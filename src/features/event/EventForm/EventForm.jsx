/*global google*/
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {useFirestoreConnect, useFirebase, useFirestore} from 'react-redux-firebase';
import {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import {
    composeValidators,
    combineValidators,
    isRequired,
    hasLengthGreaterThan
} from 'revalidate';
import {Form, Segment, Button, Grid, Header} from 'semantic-ui-react';
import {createEvent, updateEvent} from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired({message: 'Please provide a category'}),
    description: composeValidators(
        isRequired({message: 'Please enter a description'}),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
    )(),
    city: isRequired('city'),
    venue: isRequired('venue'),
    date: isRequired('date')
});

const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'}
];

const EventForm = ({change, history, match: {params}, invalid, submitting, pristine, handleSubmit}) => {
    const dispatch = useDispatch();
    const firebase = useFirebase();
    const firestore = useFirestore();
    const [cityLatLng, setCityLatLng] = useState({});
    const [venueLatLng, setVenueLatLng] = useState({});
    useFirestoreConnect(`events/${params.id}`);
    const initialValues = useSelector(state => state.firestore.ordered.events && state.firestore.ordered.events[0] || {});

    const handleCitySelect = (selectedCity) => {
        geocodeByAddress(selectedCity)
            .then(results => getLatLng(results[0]))
            .then(latlng => {
                setCityLatLng(latlng);
            })
            .then(() => {
                change('city', selectedCity);
            });
    };

    const handleVenueSelect = (selectedVenue) => {
        geocodeByAddress(selectedVenue)
            .then(results => getLatLng(results[0]))
            .then(latlng => {
                setVenueLatLng(latlng)
            })
            .then(() => {
                change('venue', selectedVenue);
            });
    };

    const handleFormSubmit = values => {
        values.venueLatLng = venueLatLng;
        if (initialValues.id) {
            dispatch(updateEvent({firebase, firestore}, values));
        } else {
            dispatch(createEvent({firebase, firestore}, values));
            history.push('/events');
        }
    };

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment>
                    <Header sub color='teal' content='Event Details'/>
                    <Form onSubmit={handleSubmit(handleFormSubmit)}>
                        <Field
                            name='title'
                            type='text'
                            component={TextInput}
                            placeholder='Give your event a name'
                        />
                        <Field
                            name='category'
                            type='text'
                            options={category}
                            component={SelectInput}
                            placeholder='What is your event about'
                        />
                        <Field
                            name='description'
                            type='text'
                            rows={3}
                            component={TextArea}
                            placeholder='Tell us about your event'
                        />
                        <Header sub color='teal' content='Event location details'/>
                        <Field
                            name='city'
                            type='text'
                            component={PlaceInput}
                            options={{typs: ['(cities)']}}
                            placeholder='Event city'
                            onSelect={handleCitySelect}
                        />
                        <Field
                            name='venue'
                            type='text'
                            component={PlaceInput}
                            options={{
                                location: new google.maps.LatLng(cityLatLng),
                                radius: 1000,
                                types: ['establishment']
                            }}
                            placeholder='Event venue'
                            onSelect={handleVenueSelect}
                        />
                        <Field
                            name='date'
                            type='text'
                            component={DateInput}
                            dateFormat='yyyy/LL/dd HH:mm'
                            timeFormat='HH:mm'
                            showTimeSelect
                            placeholder='Event date'
                        />
                        <Button disabled={invalid || submitting || pristine} positive type='submit'>
                            Submit
                        </Button>
                        <Button onClick={history.goBack} type='button'>
                            Cancel
                        </Button>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default reduxForm({form: 'eventForm', enableReinitialize: true, validate})(EventForm);
