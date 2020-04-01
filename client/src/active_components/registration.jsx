import React, {Component} from 'react';
import { Link , Redirect} from 'react-router-dom';
import {CreateAccount} from '../ajax/actions';
import { Alert } from 'react-bootstrap'


class Signup extends Component {
    state = {
      login: '',
      password: '',
      repassword: '',
      fullname: '',
      mail: '',
      message: '',
      status: true,
      fields: ''
    }

    handleChange = event => {
        this.setState({
          [event.target.name]: event.target.value
        });
      }

    handleSubmit = event => {
        event.preventDefault()
        CreateAccount(this.state).then(res =>{
            if(!res.status){
                this.setState({
                    status: res.status,
                    message: res.message,
                    fields: res.fields
                })
            }else{
                this.setState({
                    redirect: res.redirect
                   })
            }
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/' />
        }
      }

    render() {
        if(localStorage.token)
        {
            return(<div>{this.renderRedirect()}</div>)
        }else{
        return (
            <form onSubmit={this.handleSubmit}>
            <div className="row justify-content-center">
            <div className="col-md-4">
            <div className="h1 text-center">Registration</div>
            </div>
            {this.state.status === false &&
            <div className="col-md-3 mt-5 position-absolute">
            <Alert variant="danger">{this.state.message}</Alert></div>}
            </div>
            <div className="row justify-content-center mt-5">
            <div className="col-lg-4">
                <div className="input-group">
                    <div className="input-group-prepend">
                    <span className="input-group-text">Full Name</span>
                    </div>
                    <input type="text" className="form-control" placeholder="Full Name" aria-label="Full Name" name='fullname' value={this.state.fullname}
          onChange={this.handleChange} required/>
                </div>
                </div>
            </div>
            <div className="row justify-content-center mt-2">
            <div className="col-lg-4">
                <div className="input-group">
                    <div className="input-group-prepend">
                    <span className="input-group-text">E-mail</span>
                    </div>
                    <input type="text" className="form-control" placeholder="E-mail" aria-label="E-mail" name='mail' value={this.state.mail}
          onChange={this.handleChange} style={(this.state.fields.indexOf("mail") === -1) ? {borderColor:'#ced4da'} : {borderColor:'rgb(255,0,0)'} } required/>
                </div>
                </div>
            </div>
            <div className="row justify-content-center mt-2">
            <div className="col-lg-4">
                <div className="input-group">
                    <div className="input-group-prepend">
                    <span className="input-group-text">Login</span>
                    </div>
                    <input type="text" className="form-control" placeholder="Login" aria-label="Login" name='login' value={this.state.login}
          onChange={this.handleChange} style={(this.state.fields.indexOf("login") === -1) ? {borderColor:'#ced4da'} : {borderColor:'rgb(255,0,0)'} } required/>
                </div>
                </div>
            </div>
            <div className="row justify-content-center mt-2">
            <div className="col-lg-4">
                <div className="input-group">
                    <div className="input-group-prepend">
                    <span className="input-group-text">Password</span>
                    </div>
                    <input type="password" className="form-control" placeholder="Password" aria-label="Password" name='password' value={this.state.password}
          onChange={this.handleChange} style={(this.state.fields.indexOf("password") === -1) ? {borderColor:'#ced4da'} : {borderColor:'rgb(255,0,0)'} } required/>
                </div>
                </div>
            </div>
            <div className="row justify-content-center mt-2">
            <div className="col-lg-4">
                <div className="input-group">
                    <div className="input-group-prepend">
                    <span className="input-group-text">Re-enter password</span>
                    </div>
                    <input type="password" className="form-control" placeholder="Re-enter password" aria-label="Re-enter password" name='repassword' value={this.state.repassword}
          onChange={this.handleChange} style={(this.state.fields.indexOf("repassword") === -1) ? {borderColor:'#ced4da'} : {borderColor:'rgb(255,0,0)'} } required/>
                </div>
                </div>
            </div>
            <div className="row justify-content-center mt-2">
            <div className="col-lg-4">
                <button type="submit" className="btn btn-block btn-primary">Sign up</button>
            </div>
            </div>
            <div className="row justify-content-center mt-2">
            <div className="col-lg-4">
                <Link to='/'>
                <button type="button" className="btn btn-block btn-primary">Back</button>
                </Link>
            </div>
            </div>
            </form>
        )
    }  }

}


  export default Signup;