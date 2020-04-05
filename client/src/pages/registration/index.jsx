import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Account } from '../../ajax'
import { Alert, Container, Row, Col, Modal, Form, Button } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import './registration.scss'

class Registration extends Component {
  state = {
    login: '',
    password: '',
    repassword: '',
    fullname: '',
    mail: '',
    message: '',
    status: false,
    execute: true,
    fields: '',
    theme: 'light',
  }

  componentDidMount() {
    const { i18n } = this.props
    if(localStorage.getItem('lang') === 'rus') i18n.changeLanguage('ru')
    else i18n.changeLanguage('en')
    if(localStorage.getItem('theme'))
      this.setState({theme: localStorage.getItem('theme')})
    Account.verify()
      .then(res => {
        this.setState({ status: res.status })
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    Account.create(this.state).then(res => {
      if (!res.status) {
        this.setState({
          execute: res.status,
          message: res.message,
          fields: res.fields,
        })
      } else {
        this.setState({
          status: true,
        })
      }
    }).catch(err => {
      this.setState({ status: true })
    })
  }

  render() {
    const { t } = this.props
    if (this.state.status) {
      return <Redirect to="/" />
    } else {
      return (
        <Container fluid className={`container-${this.state.theme}`}>
          <Container className="h-100">
            <Row className={`justify-content-center bar-${this.state.theme}`}>
              <Col md={4}>
                <div className="h1 text-center mt-3 mb-3">{t('Collections site')}</div>
              </Col>
            </Row>
            {!this.state.execute && (
              <Row className="justify-content-center">
                <Col md={5}>
                  <Alert variant="danger" className="w-100 text-center">
                    {t(this.state.message)}
                  </Alert>
                </Col>
              </Row>
            )}
            <Modal.Dialog className="mt-5 shadow modal_1">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group as={Row} className="justify-content-center mt-5">
                  <Col xs={10}>
                    <Form.Control
                      type="text"
                      placeholder={t('Full Name')}
                      name="fullname"
                      value={this.state.fullname}
                      onChange={this.handleChange}
                      style={{}}
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="justify-content-center mt-2">
                  <Col xs={10}>
                    <Form.Control
                      type="text"
                      placeholder={t('E-mail')}
                      name="mail"
                      value={this.state.mail}
                      onChange={this.handleChange}
                      style={
                        this.state.fields.indexOf('mail') === -1
                          ? {}
                          : { borderColor: 'rgb(255,0,0)' }
                      }
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="justify-content-center mt-2">
                  <Col xs={10}>
                    <Form.Control
                      type="text"
                      placeholder={t('Login')}
                      name="login"
                      value={this.state.login}
                      onChange={this.handleChange}
                      style={
                        this.state.fields.indexOf('login') === -1
                          ? {}
                          : { borderColor: 'rgb(255,0,0)' }
                      }
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="justify-content-center mt-2">
                  <Col xs={10}>
                    <Form.Control
                      type="password"
                      placeholder={t('Password')}
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      style={
                        this.state.fields.indexOf('password') === -1
                          ? {}
                          : { borderColor: 'rgb(255,0,0)' }
                      }
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="justify-content-center mt-2">
                  <Form.Label className={`form-label-${this.state.theme} mt-2 mb-4`}>
                    {t('Enter password again')}
                  </Form.Label>
                  <Col xs={10}>
                    <Form.Control
                      type="password"
                      placeholder={t('Password')}
                      name="repassword"
                      value={this.state.repassword}
                      onChange={this.handleChange}
                      style={
                        this.state.fields.indexOf('repassword') === -1
                          ? {}
                          : { borderColor: 'rgb(255,0,0)' }
                      }
                      required
                    />
                  </Col>
                </Form.Group>
                <Row className="justify-content-center mt-2 mb-5">
                  <Col xs={10}>
                    <Button type="submit" className={`btn-block btn-${this.state.theme}`}>
                      {t('Sign up')}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Modal.Dialog>
          </Container>
        </Container>
      )
    }
  }
}

export default withTranslation()(Registration)
