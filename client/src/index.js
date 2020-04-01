import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

import {Registration, Main} from './pages'
import './styles/app.scss'

ReactDOM.render((
        <Router>
            <Switch>
                <Route exact path='/registration' component={Registration}/>
                <Route path='/' component={Main}/>
            </Switch>
        </Router>
    ), document.getElementById('root'));

