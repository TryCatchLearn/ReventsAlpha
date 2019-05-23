import React, {useCallback} from 'react';
import { Form, Segment, Button } from 'semantic-ui-react';
import {useDispatch} from 'react-redux';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import {registerUser} from "../authActions";

const RegisterForm = ({handleSubmit}) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const handleregister = useCallback(
      (user) => {
        dispatch(registerUser({firebase, firestore}, user))
      }, [firebase, firestore, dispatch]
  );
  return (
    <div>
      <Form size="large" autoComplete='off' onSubmit={handleSubmit(handleregister)}>
        <Segment>
          <Field
            name="displayName"
            type="text"
            component={TextInput}
            placeholder="Known As"
          />
          <Field
            name="email"
            type="text"
            component={TextInput}
            placeholder="Email"
          />
          <Field
            name="password"
            autoComplete="new-password"
            type="password"
            component={TextInput}
            placeholder="Password"
          />
          <Button fluid size="large" color="teal">
            Register
          </Button>
        </Segment>
      </Form>
    </div>
  );
};

export default reduxForm({form: 'registerForm'})(RegisterForm);