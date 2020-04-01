import React, { Component } from 'react'
import {
  FindCollection,
  GetProfile,
  FindItem,
  FindTags,
  SetLike,
  UnSetLike,
  GetLike,
  Verify,
} from '../../ajax/actions'
import { CommentsBlock } from '../../components'
import { Row, Col, Spinner, Form, Badge } from 'react-bootstrap'
import Markdown from 'react-markdown'
import dateFormat from 'dateformat'

class Item extends Component {
  state = {
    execute: '',
    name: '',
    tags: [],
    String: '',
    Number: [],
    Text: [],
    Date: [],
    Checkbox: [],
    Collection: '',
    Owner: '',
    like: false,
    likecount: '',
  }

  componentDidMount() {
    Verify().then(verify => {
      GetLike({ itemId: this.props.match.params.item }).then(res => {
        this.setState({
          likecount: res.data.count,
          like:
            res.data.like
              .map(e => {
                return e.userId
              })
              .indexOf(verify.id) !== -1
              ? true
              : false,
        })
      })

      FindItem({ id: this.props.match.params.item }).then(item => {
        FindCollection({ id: item.data.collectionId }).then(collection => {
          GetProfile({ id: collection.data.userId }).then(profile => {
            FindTags({ id: item.data.id }).then(tag => {
              this.setState({
                tags: tag.data,
                String: item.data.data.String,
                Date: item.data.data.Date,
                Text: item.data.data.Text,
                Number: item.data.data.Number,
                Checkbox: item.data.data.Checkbox,
                name: item.data.name,
                Collection: collection,
                Owner: profile.data.login,
                edit: verify.status ? true : false,
              })
            })
          })
        })
      })
    })
  }

  render() {
    if (!this.state.String) {
      return (
        <Row className="justify-content-center align-items-center mt-5">
          <Col xs={2}>
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      )
    }

    return (
      <>
        <Row>
          <Col className="bg-light border">
            <p className="font-weight-bold">Name item: {this.state.name}</p>
            <p className="font-weight-bold">Collection: {this.state.Collection.data.name}</p>
            <p className="font-weight-bold">Owner: {this.state.Owner} </p>
          </Col>
        </Row>

        <Form>
          {Object.values(this.state.String).map(val => {
            return (
              <Form.Group key={val.id} as={Row} controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  {val.name}
                </Form.Label>
                <Col sm="10">
                  <Form.Control plaintext readOnly defaultValue={val.value} />
                </Col>
              </Form.Group>
            )
          })}

          {Object.values(this.state.Number).map(val => {
            return (
              <Form.Group key={val.id} as={Row} controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  {val.name}
                </Form.Label>
                <Col sm="10">
                  <Form.Control plaintext readOnly defaultValue={val.value} />
                </Col>
              </Form.Group>
            )
          })}

          {Object.values(this.state.Text).map(val => {
            return (
              <Form.Group key={val.id} as={Row} controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  {val.name}
                </Form.Label>
                <Col sm="10">
                  <Markdown escapeHtml={false} source={val.value} />
                </Col>
              </Form.Group>
            )
          })}

          {Object.values(this.state.Date).map(val => {
            return (
              <Form.Group key={val.id} as={Row} controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  {val.name}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue={dateFormat(val.value, 'yyyy-mm-dd')}
                  />
                </Col>
              </Form.Group>
            )
          })}

          {this.state.Checkbox.map(e => {
            return (
              <Form.Group key={e.id} as={Row} controlId="formPlaintextPassword">
                <Form.Label column md="auto">
                  {e.name}
                </Form.Label>
                <Col>
                  <Form.Check type="checkbox" disabled checked={e.value} />
                </Col>
              </Form.Group>
            )
          })}
          <Form.Group as={Row} controlId="formPlaintextPassword">
            <Form.Label column md="auto">
              Tags
            </Form.Label>
            {this.state.tags.map(e => {
              return (
                <Badge
                  key={e.id}
                  variant="primary"
                  className="ml-2 text-nowrap"
                  style={{ top: '0px', bottom: '0px', margin: '10px' }}
                >
                  {e.name}
                </Badge>
              )
            })}
          </Form.Group>

          <Form.Group controlId="formPlaintextPassword">
            <Form.Label column md="auto">
              Like {this.state.likecount}
            </Form.Label>
            <Col>
              <Form.Check
                type="checkbox"
                disabled={!this.state.edit}
                checked={this.state.like}
                onChange={event => {
                  if (event.target.checked) {
                    SetLike({ itemId: this.props.match.params.item }).then(e => {
                      this.setState({ like: true, likecount: this.state.likecount + 1 })
                    })
                  } else {
                    UnSetLike({ itemId: this.props.match.params.item }).then(e => {
                      this.setState({ like: false, likecount: this.state.likecount - 1 })
                    })
                  }
                }}
              />
            </Col>
          </Form.Group>
        </Form>
        <p className="font-weight-bold">Comments:</p>
        <CommentsBlock itemId={this.props.match.params.item} />
      </>
    )
  }
}

export default Item
