import React from 'react';
import {Modal, Button, Divider} from 'semantic-ui-react';
import {useDispatch} from 'react-redux';
import {closeModal, openModal} from './modalActions';
import {withRouter} from 'react-router-dom';


const UnauthModal = ({location, history}) => {
    const dispatch = useDispatch();

    const handleCloseModal = () => {
        if (location.pathname.includes('/event')) {
            dispatch(closeModal());
        } else {
            history.goBack();
            dispatch(closeModal());
        }
    };

    return (
        <Modal size='mini' open={true} onClose={handleCloseModal}>
            <Modal.Header>You need to be signed in to do that!</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>Please either login or register to see this page</p>
                    <Button.Group widths={4}>
                        <Button
                            fluid
                            color='teal'
                            onClick={() => dispatch(openModal('LoginModal'))}
                        >
                            Login
                        </Button>
                        <Button.Or/>
                        <Button fluid positive onClick={() => dispatch(openModal('RegisterModal'))}>
                            Register
                        </Button>
                    </Button.Group>
                    <Divider/>
                    <div style={{textAlign: 'center'}}>
                        <p>Or click cancel to continue as a guest</p>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                    </div>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
};

export default withRouter(UnauthModal);
