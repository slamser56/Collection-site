import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import Signup from '../../active_components/registration'
import {Verify} from '../../ajax/actions'
    

class Registration extends Component { 

    state = {
        status: false
      };

      componentDidMount(){
        Verify().then(res => {
            this.setState({status: res.status})
        }).catch(err =>{this.setState({status: false})})
        }

    render() {


    if(this.state.status){
        return(
            <Redirect to='/' />
            )
    }else{
        return(
            <div className="container">
                <Signup/>
            </div>
                )
    }
}
}

export default Registration;