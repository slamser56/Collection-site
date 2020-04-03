import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
  import {I18nextProvider} from 'react-i18next';
  import i18n from './locale/i18n';
import {Registration, Main} from './pages'
import './styles/app.scss'


ReactDOM.render((
    <I18nextProvider i18n={i18n}>
        <Router>
            <Switch>
                <Route exact path='/registration' component={Registration}/>
                <Route path='/' component={Main}/>
            </Switch>
        </Router>
    </I18nextProvider>
    ), document.getElementById('root'));

