import React, { Component } from 'react'
import { Row, Col, ListGroup, Alert } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import {Collection} from '../../ajax'
import './style.scss'

class FindPage extends Component {
  state = {
    result: '',
    message: '',
    execute: true
  }

  async componentDidMount() {
    try {
      let res = await Collection.search({ text: this.props.match.params.text })
      this.setState({ result: res.data.data })
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
  }

  render() {
    const { t } = this.props
    if (this.state.message || !this.state.execute) {
      return (
        <Row className="justify-content-center align-items-center mt-5">
          <Col xs={10}>
            <Alert variant="danger" className="text-center">
              {t(this.state.message)}
            </Alert>
          </Col>
        </Row>
      )
    }
    return (
      <Row className="justify-content-center FindPage mt-3">
        <Col>
          <div className="h1">{t("Founded item")}:</div>
          <ListGroup className="mt-3 shadow">
            {Object.values(this.state.result).map(e => {
              return (
                <ListGroup.Item
                  key={e.id}
                  action
                  onClick={event => {
                    this.props.history.push('/item-' + e.id)
                  }}
                >
                  {e.name}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Col>
      </Row>
    )
  }
}


export default withTranslation()(FindPage)