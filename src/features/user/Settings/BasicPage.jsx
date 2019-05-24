import React, {useCallback} from 'react';
import {Segment, Form, Header, Divider, Button} from 'semantic-ui-react';
import {useDispatch} from 'react-redux';
import {useFirebase} from 'react-redux-firebase';
import {Field, reduxForm} from 'redux-form';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import TextInput from '../../../app/common/form/TextInput';
import RadioInput from '../../../app/common/form/RadioInput';
import {addYears} from 'date-fns';
import {updateProfile} from '../../user/userActions';

const BasicPage = ({pristine, submitting, handleSubmit, initialValues}) => {
    const dispatch = useDispatch();
    const firebase = useFirebase();
    const handleUpdateProfile = useCallback(
        (user) => {
            return dispatch(updateProfile({firebase}, user))
        }, [firebase, dispatch]
    );


    return (
        <Segment>
            <Header dividing size='large' content='Basics'/>
            <Form onSubmit={handleSubmit(handleUpdateProfile)}>
                <Field
                    width={8}
                    name='displayName'
                    type='text'
                    component={TextInput}
                    placeholder='Known As'
                />
                <Form.Group inline>
                    <label>Gender: </label>
                    <Field
                        name='gender'
                        type='radio'
                        value='male'
                        label='Male'
                        component={RadioInput}
                    />
                    <Field
                        name='gender'
                        type='radio'
                        value='female'
                        label='Female'
                        component={RadioInput}
                    />
                </Form.Group>
                <Field
                    width={8}
                    name='dateOfBirth'
                    component={DateInput}
                    placeholder='Date of Birth'
                    dateFormat='dd LLL yyyy'
                    showYearDropdown={true}
                    showMonthDropdown={true}
                    dropdownMode='select'
                    maxDate={addYears(new Date(), -18)}
                />
                <Field
                    name='city'
                    placeholder='Home Town'
                    options={{types: ['(cities)']}}
                    label='Female'
                    component={PlaceInput}
                    width={8}
                />
                <Divider/>
                <Button
                    disabled={pristine || submitting}
                    size='large'
                    positive
                    content='Update Profile'
                />
            </Form>
        </Segment>
    );
};

export default reduxForm({form: 'userProfile', enableReinitialize: true, destroyOnUnmount: false})(
    BasicPage
);
