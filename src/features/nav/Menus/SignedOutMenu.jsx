import React from 'react';
import { Menu, Button } from 'semantic-ui-react';

const SignedOutMenu = ({ signIn, register }) => {
  return (
    <Menu.Item position='right'>
      <Button onClick={() => signIn('LoginModal')} basic inverted content='Login' />
      <Button
        onClick={() => register('RegisterModal')}
        basic
        inverted
        content='Register'
        style={{ marginLeft: '0.5em' }}
      />
    </Menu.Item>
  );
};

export default SignedOutMenu;
