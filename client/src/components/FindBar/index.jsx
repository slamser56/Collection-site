import React, { Component } from 'react'
import { Col, Button, Form, ListGroup } from 'react-bootstrap'
import { Collection } from '../../ajax'

class FindBar extends Component {
  state = {
    text: '',
    result: [],
  }

  componentDidMount() {}

  handleChange = event => {
    this.setState({ text: event.target.value })
    if (event.target.value) {
      Collection.search({ text: event.target.value }).then(res => {
        this.setState({ result: res.data.data })
      })
    } else {
      this.setState({ result: [] })
    }
  }

  render() {
    return (
      <>
        <Form
          onSubmit={e => {
            e.preventDefault()
            window.location.href = '/find-' + this.state.text
          }}
          className="form-inline"
        >
          <Col md={9} xs={8}>
            <Form.Control
              placeholder="Search"
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
          <Col md={3} xs={4}>
            <Button variant="outline-primary" type="submit">
              Search
            </Button>
          </Col>
        </Form>
      </>
    )
  }
}

export default FindBar
