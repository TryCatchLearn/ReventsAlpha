import React from 'react';
import ReactDOM from 'react-dom';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from './app/config/firebase';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './index.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import { configureStore } from './app/store/configureStore';
import ScrollToTop from './app/common/util/ScrollToTop';

const store = configureStore();

const rrfConfig = {
  userProfile: 'users',
  attachAuthIsReady: true,
  useFirestoreForProfile: true,
  updateProfileOnLogin: false
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

const rootEl = document.getElementById('root');

let render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <BrowserRouter>
          <ScrollToTop>
            <ReduxToastr
              position='bottom-right'
              transitionIn='fadeIn'
              transitionOut='fadeOut'
            />
            <App />
          </ScrollToTop>
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>,
    rootEl
  );
};

if (module.hot) {
  module.hot.accept('./app/layout/App', () => {
    setTimeout(render);
  });
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
