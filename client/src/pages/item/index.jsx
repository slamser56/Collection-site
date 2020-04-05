import React, { Component } from 'react'
import { Account, Collection, Item, Tag, Like } from '../../ajax'
import { CommentsBlock } from '../../components'
import { withTranslation } from 'react-i18next'
import { Row, Col, Spinner, Form, Badge } from 'react-bootstrap'
import Markdown from 'react-markdown'
import dateFormat from 'dateformat'
import './style.scss'

class ItemPage extends Component {
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
    Account.verify().then(verify => {
      Like.get({ itemId: this.props.match.params.item }).then(res => {
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

      Item.getItem({ id: this.props.match.params.item }).then(item => {
        Collection.getCollection({ id: item.data.collectionId }).then(collection => {
          Account.get({ id: collection.data.userId }).then(profile => {
            Tag.getTag({ id: item.data.id }).then(tag => {
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
    const { t } = this.props
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
      <div className="item">
        <Row className="justify-content-center mt-3">
          <Col xs={10} className="shadow box">
            <p className="font-weight-bold mt-3">{t("Name item")}: {this.state.name}</p>
            <p className="font-weight-bold">{t("Collection")}: {this.state.Collection.data.name}</p>
            <p className="font-weight-bold mb-3">{t("Owner")}: {this.state.Owner} </p>

            <Form.Group as={Row}>
              <Col sm={1} xs={2}>
                <Form.Check
                  className={`like-${this.state.like}`}
                  type="checkbox"
                  disabled={!this.state.edit}
                  checked={this.state.like}
                  onChange={event => {
                    if (event.target.checked) {
                      Like.set({ itemId: this.props.match.params.item }).then(e => {
                        this.setState({ like: true, likecount: this.state.likecount + 1 })
                      })
                    } else {
                      Like.unset({ itemId: this.props.match.params.item }).then(e => {
                        this.setState({ like: false, likecount: this.state.likecount - 1 })
                      })
                    }
                  }}
                />
              </Col>
              <Col sm={1} xs={2}>
              <Form.Label column md="auto" className="font-weight-bold">
              {this.state.likecount}
              </Form.Label>
              </Col>
            </Form.Group>
          </Col>
        </Row>
        <Form as={Row} className="justify-content-center mt-3">
          <Col xs={10} className="shadow box">
            {Object.values(this.state.String).map(val => {
              return (
                <Form.Group key={val.id} as={Row} className="mt-1">
                  <Form.Label column sm="auto">
                    {val.name}
                  </Form.Label>
                  <div className="verticalLine" />
                  <Col sm="auto">
                    <Form.Control plaintext readOnly defaultValue={val.value} />
                  </Col>
                </Form.Group>
              )
            })}

            {Object.values(this.state.Number).map(val => {
              return (
                <Form.Group key={val.id} as={Row} className="mt-1">
                  <Form.Label column sm="auto">
                    {val.name}
                  </Form.Label>
                  <div className="verticalLine" />
                  <Col sm="auto">
                    <Form.Control plaintext readOnly defaultValue={val.value} />
                  </Col>
                </Form.Group>
              )
            })}

            {Object.values(this.state.Text).map(val => {
              return (
                <Form.Group key={val.id} as={Row} className="mt-1">
                  <Form.Label column sm="auto">
                    {val.name}
                  </Form.Label>
                  <div className="verticalLine" />
                  <Col sm="auto">
                    <Markdown escapeHtml={false} source={val.value} />
                  </Col>
                </Form.Group>
              )
            })}

            {Object.values(this.state.Date).map(val => {
              return (
                <Form.Group key={val.id} as={Row} className="mt-1">
                  <Form.Label column sm="auto">
                    {val.name}
                  </Form.Label>
                  <div className="verticalLine" />
                  <Col sm="auto">
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
                <Form.Group key={e.id} as={Row} className="mt-1">
                  <Form.Label column sm="auto">
                    {e.name}
                  </Form.Label>
                  <div className="verticalLine" />
                  <Col sm="auto">
                    <Form.Check type="checkbox" disabled checked={e.value} />
                  </Col>
                </Form.Group>
              )
            })}
          </Col>
            <Col xs={10} className="mt-3">
              <p className="h1">{t("Tags")}:</p>
            </Col>
            <Col xs={10} className="mt-2">
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
            </Col>
        </Form>
        <Row className="justify-content-center mt-3">
          <Col xs={10}>
        <p className="h1 mb-4">{t("Comments")}:</p>
        <CommentsBlock itemId={this.props.match.params.item} />
        </Col>
        </Row>
      </div>
    )
  }
}

export default withTranslation()(ItemPage)
