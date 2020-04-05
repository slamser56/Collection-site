import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Col, Form, Row, Modal } from 'react-bootstrap'
import { SignInForm } from '../../components'
import { withTranslation } from 'react-i18next'
import './sidebar.scss'

class SideBar extends Component {
  state = {
    id: '',
    admin: '',
    check: false,
    lang: 'eng',
  }

  updateData = value => {
    this.setState({ id: value.id, admin: value.admin })
  }

  componentDidMount() {
    const { i18n } = this.props
    if (localStorage.getItem('theme') === 'light') this.setState({ check: true })
    else this.setState({ check: false })
    if (localStorage.getItem('lang') === 'rus') i18n.changeLanguage('ru')
    else i18n.changeLanguage('en')
    this.setState({ lang: localStorage.getItem('lang') })
  }

  handleChangeTheme = e => {
    if (e.target.checked) {
      this.setState({ check: true })
      this.props.ChangeTheme('light')
    } else {
      this.setState({ check: false })
      this.props.ChangeTheme('dark')
    }
  }

  handleChangeLanguage = e => {
    const { i18n } = this.props
    if (e === 1) {
      this.setState({ lang: 'eng' })
      localStorage.setItem('lang', 'eng')
      i18n.changeLanguage('en')
    } else {
      this.setState({ lang: 'rus' })
      localStorage.setItem('lang', 'rus')
      i18n.changeLanguage('ru')
    }
  }

  render() {
    const { t } = this.props
    return (
      <Col xs={12} md={3} className="order-1 order-md-2 ">
        <Form as={Row} className="mt-3 justify-content-center">
          <Col className="mt-4">
            <Form.Check
              className="l"
              checked={this.state.check}
              type={'checkbox'}
              onChange={e => {
                this.handleChangeTheme(e)
              }}
            />
          </Col>
          <Col>
            <div
              className="eng"
              style={
                this.state.lang === 'rus'
                  ? {
                      opacity: '0.5',
                    }
                  : {}
              }
              onClick={e => {
                this.handleChangeLanguage(1)
              }}
            >
              <p>ENG</p>
            </div>
            <div
              className="rus"
              style={
                this.state.lang === 'eng' || !this.state.lang
                  ? {
                      opacity: '0.5',
                    }
                  : {}
              }
              onClick={e => {
                this.handleChangeLanguage(2)
              }}
            >
              <p>RUS</p>
            </div>
          </Col>
        </Form>
        <Modal.Dialog className="shadow right_borger">
          <Col className="mt-3">
            <SignInForm updateData={this.updateData} />
            <div className="Line mt-4"/>
            <ul className="nav flex-column mt-2 mb-2">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  {t("Main")}
                </Link>
              </li>
              {this.state.admin && (
                <li className="nav-item">
                  <Link to="/account_managment" className="nav-link">
                    {t("Account Managment")}
                  </Link>
                </li>
              )}
              {this.state.id ? (
                <li className="nav-item">
                  <Link className="nav-link" to={'/profile-' + this.state.id}>
                    {t("My profile")}
                  </Link>
                </li>
              ) : (
                <></>
              )}
            </ul>
          </Col>
        </Modal.Dialog>
      </Col>
    )
  }
}

export default withTranslation()(SideBar)

