import React, { Component } from 'react'
import { Col, Button, Form, ListGroup } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import { Collection } from '../../ajax'

import './style.scss'

class FindBar extends Component {
  state = {
    text: '',
    result: [],
    lang: 'eng'
  }

  componentDidMount() {
    
  }

  handleChange = event => {
    this.setState({ text: event.target.value })
    const { i18n } = this.props
    i18n.changeLanguage('ru')
    if (event.target.value) {
      Collection.search({ text: event.target.value }).then(res => {
        this.setState({ result: res.data.data })
      })
    } else {
      this.setState({ result: [] })
    }
  }

  render() {
    const { t } = this.props
    return (
      <>
        <Form
          onSubmit={e => {
            e.preventDefault()
            window.location.href = '/find-' + this.state.text
          }}
          className="form-inline mt-3 mb-3"
        >
          <Col md={9} xs={7}>
            <Form.Control
              placeholder={t("Search")+"..."}
              type="text"
              required
              value={this.state.text}
              onChange={event => {
                this.handleChange(event)
              }}
            />
            {this.state.result.length > 0 && (
              <ListGroup style={{ position: 'absolute', zIndex: '10' }}>
                {this.state.result.map(e => {
                  return (
                    <ListGroup.Item key={e.id} action href={'/item-' + e.id}>
                      {e.name}
                    </ListGroup.Item>
                  )
                })}
              </ListGroup>
            )}
          </Col>
          <Col md={3} xs={5}>
            <Button type="submit" className="btn-light">
            {t("Search")}
            </Button>
          </Col>
        </Form>
      </>
    )
  }
}

export default withTranslation()(FindBar)
