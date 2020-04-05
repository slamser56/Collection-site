import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import { Account } from '../../ajax'
import { Alert, Row, Col, Button, Form } from 'react-bootstrap'
import openSocket from 'socket.io-client'
import { withTranslation } from 'react-i18next'
const socket = openSocket(
  process.env.NODE_ENV === 'production' ? window.location.host : 'http://localhost:5000/'
)

class SignInForm extends Component {
  state = {
    status: 'wait',
    loginuser: '',
    loginform: '',
    password: '',
    message: '',
    popup: false,
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  Popup(product) {
    const width = 500,
      height = 500
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2
    const url =
      (process.env.NODE_ENV === 'production'
        ? 'https://' + window.location.host
        : 'http://localhost:5000') +
      '/auth/' +
      product +
      '?socketId=' +
      socket.id
    return window.open(
      url,
      '',
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    )
  }

  checkPopup() {
    const check = setInterval(() => {
      if (!this.popup || this.popup.closed || this.popup.closed === undefined) {
        clearInterval(check)
        this.setState({ popup: false })
      }
    }, 1000)
  }

  GoogleSignIn = () => {
    if (!this.state.popup) {
      this.popup = this.Popup('google')
      this.checkPopup()
      this.setState({ popup: true })
    }
  }

  GitHubSignIn = () => {
    if (!this.state.popup) {
      this.popup = this.Popup('github')
      this.checkPopup()
      this.setState({ popup: true })
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    Account.signin({ login: this.state.loginform, password: this.state.password })
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
    socket.on('auth', user => {
      this.popup.close()
      localStorage.setItem('token', user.token)
      window.location.reload()
    })
    Account.verify()
      .then(res => {
        this.setState({ status: res.status, loginuser: res.login })
        this.props.updateData({ id: res.id, admin: res.admin })
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }

  render() {
    const { t } = this.props
    if (this.state.status) {
      return (
        <>
          <p className="text-center">
            {t('Login')}: {this.state.loginuser}
          </p>
          <Row className="row">
            <Col>
              <Form onSubmit={this.handlelogout}>
                <Button type="submit" className="btn-block btn-light mt-2">
                  {t("Logout")}
                </Button>
              </Form>
            </Col>
          </Row>
        </>
      )
    } else if (this.state.status === 'wait') {
      return <></>
    } else {
      return (
        <>
          <Form onSubmit={this.handleSubmit}>
            {this.state.message !== '' && (
              <Col className="text-center">
                <Alert variant="danger">{this.state.message}</Alert>
              </Col>
            )}
            <Form.Group as={Row}>
              <Col>
                <Form.Control
                  type="text"
                  className="form-control"
                  placeholder={t('Login')}
                  aria-label="Login"
                  name="loginform"
                  value={this.state.loginform}
                  onChange={this.handleChange}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col>
                <Form.Control
                  type="password"
                  className="form-control"
                  placeholder={t('Password')}
                  aria-label="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </Col>
            </Form.Group>
            <Row className="justify-content-between">
              <Col xs={'auto'}>
                <Button type="submit" className="btn-light">
                  {t('Sign in')}
                </Button>
              </Col>
              <Col xs={'auto'}>
                <Link to="/registration">
                  <Button type="button" className="btn-light">
                    {t('Sign up')}
                  </Button>
                </Link>
              </Col>
            </Row>
            <Row className="justify-content-center mt-3">
              <Form.Label xs={10}>{t('or')}</Form.Label>
            </Row>
            <Row className="mt-2">
            <Col>
              <Button className="btn-block btn-light"
                onClick={e => {
                  this.GoogleSignIn()
                }}
              >
                <i className='google'></i>
                Google {t("Sign in")}
              </Button>
            </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Button className="btn-block btn-light"
                  onClick={e => {
                    this.GitHubSignIn()
                  }}
                >
                  <i className='github'></i>
                  GitHub {t("Sign in")}
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )
    }
  }
}

export default withTranslation()(SignInForm)
