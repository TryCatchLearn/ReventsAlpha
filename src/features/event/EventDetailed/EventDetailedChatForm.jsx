import React from 'react';
import {useFirebase} from 'react-redux-firebase';
import {useDispatch} from 'react-redux';
import {addEventComment} from '../eventActions';
import {Form, Button} from 'semantic-ui-react';
import {Field, reduxForm} from 'redux-form';
import TextArea from '../../../app/common/form/TextArea';

const EventDetailedChatForm = ({handleSubmit, reset, eventId, closeForm, parentId}) => {
    const firebase = useFirebase();
    const dispatch = useDispatch();
    const handleCommentSubmit = values => {
        dispatch(addEventComment({firebase}, eventId, values, parentId));
        reset();
        if (parentId !== 0) {
            closeForm();
        }
    };

    return (
        <Form onSubmit={handleSubmit(handleCommentSubmit)}>
            <Field name="comment" type="text" component={TextArea} rows={2}/>
            <Button content="Add Reply" labelPosition="left" icon="edit" primary/>
        </Form>
    );
};

export default reduxForm({Fields: 'comment'})(EventDetailedChatForm);
