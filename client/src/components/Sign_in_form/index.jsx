import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import { SignIn, Verify } from '../../ajax/actions'
import { Alert } from 'react-bootstrap'

class SignInForm extends Component {
  state = {
    status: 'wait',
    loginuser: '',
    loginform: '',
    password: '',
    message: '',
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    SignIn({ login: this.state.loginform, password: this.state.password })
      .then(res => {
        if (res.status) {
          window.location.reload()
        } else {
          this.setState({ status: res.status, message: res.message })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  handlelogout = event => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  componentDidMount() {
    Verify()
      .then(res => {
        this.setState({ status: res.status, loginuser: res.login })
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }

  render() {
    if (this.state.status) {
      return (
        <>
          <p className="text-center">Login: {this.state.loginuser}</p>
          <div className="row">
            <div className="col">
              <form onSubmit={this.handlelogout}>
                <button type="submit" className="btn btn-block btn-primary mt-2">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </>
      )
    } else if (this.state.status === 'wait') {
      return <></>
    } else {
      return (
        <>
          <form onSubmit={this.handleSubmit}>
            {this.state.message !== '' && (
              <div className="col-md text-center">
                <Alert variant="danger">{this.state.message}</Alert>
              </div>
            )}
            <div className="input-group input-group-sm mt-2">
              <div className="input-group-prepend">
                <span className="input-group-text">Login</span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Login"
                aria-label="Login"
                name="loginform"
                value={this.state.loginform}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="input-group input-group-sm mt-2">
              <div className="input-group-prepend">
                <span className="input-group-text">Password</span>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                aria-label="Password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="row">
              <div className="col-auto">
                <button type="submit" className="btn btn-primary mt-2">
                  Sign in
                </button>
              </div>
              <div className="col-auto ml-auto">
                <Link to="/registration">
                  <button type="button" className="btn btn-primary mt-2">
                    Sign up
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </>
      )
    }
  }
}

export default SignInForm
