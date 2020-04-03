import React, { Component } from 'react'
import { Row, Col, ListGroup } from 'react-bootstrap'
import {Collection} from '../../ajax'

export default class FindPage extends Component {
  state = {
    result: '',
  }

  componentDidMount() {
    Collection.search({ text: this.props.match.params.text }).then(res => {
      this.setState({ result: res.data.data })
    })
  }

  render() {
    return (
      <Row className="justify-content-center">
        <Col>
          <div className="h1">Founded item:</div>
          <ListGroup>
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
