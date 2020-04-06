import React, { Component } from 'react'
import { Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import { Collection, Item, Tag, Account } from '../../ajax'
import DatePicker from 'react-datepicker'
import { withTranslation } from 'react-i18next'
import CKEditor from 'ckeditor4-react'
import update from 'immutability-helper'
import ReactTags from 'react-tag-autocomplete'
import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'

class add_item extends Component {
  state = {
    id: '',
    name: '',
    tags: [],
    suggestions: [],
    String: [],
    Number: [],
    Text: [],
    Date: [],
    Checkbox: [],
    data: '',
    message: '',
    execute: true,
  }

  async componentDidMount() {
    try {
      let verify = await Account.verify()
      let tag = await Tag.getAllTags()
      let collection = await Collection.getCollection({ id: this.props.match.params.collection })
      if (
        !(verify.status && (Number(verify.id) === Number(collection.data.userId) || verify.admin))
      )
        this.props.history.push('/')
      this.setState({
        suggestions: tag.data,
        id: collection.data.id,
        data: collection.data.data,
      })
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
  }

  changeField = (e, event) => {
    this.setState({
      [event.target.name]: update(this.state[event.target.name], {
        [this.state[event.target.name].indexOf(e)]: { value: { $set: event.target.value } },
      }),
    })
  }

  handleSubmit = async () => {
    try {
      let res = await Item.create({
        id: this.props.match.params.collection,
        name: this.state.name,
        data: {
          String: this.state.String,
          Number: this.state.Number,
          Text: this.state.Text,
          Date: this.state.Date,
          Checkbox: this.state.Checkbox,
        },
      })
      let tag = await Tag.create({
        data: this.state.tags,
        itemId: res.itemId,
      })
      if (tag) this.props.history.push('/collection-' + this.state.id)
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
  }

  addField = (e, event) => {
    this.setState({
      data: update(this.state.data, {
        [event.target.name]: { $splice: [[this.state.data[event.target.name].indexOf(e), 1]] },
      }),
      [event.target.name]: update(this.state[event.target.name], { $push: [e] }),
    })
  }

  deleteField = (e, event) => {
    this.setState({
      data: update(this.state.data, {
        [event.target.name]: { $push: [e] },
      }),
      [event.target.name]: update(this.state[event.target.name], {
        $splice: [[this.state[event.target.name].indexOf(e), 1]],
      }),
    })
  }

  handleDelete(i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleAddition(tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
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
    if (!this.state.data) {
      return (
        <Row className="justify-content-center align-items-center mt-5">
          <Col xs={2}>
            <Spinner animation="grow" variant="primary" />
          </Col>
        </Row>
      )
    }

    return (
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          this.handleSubmit()
        }}
      >
        <Row className="justify-content-center item-a mt-3">
          <Col xs={10} className="box shadow">
            <Form.Group className="mt-3">
              <Form.Label>{t('Name of item')}</Form.Label>
              <Form.Control
                required
                type="text"
                value={this.state.name}
                placeholder={t('Enter name of item') + '...'}
                onChange={(event) => {
                  this.setState({ name: event.target.value })
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('Tags')}</Form.Label>
              <ReactTags
                tags={this.state.tags}
                suggestions={this.state.suggestions}
                handleDelete={(e) => {
                  this.handleDelete(e)
                }}
                handleAddition={(e) => {
                  this.handleAddition(e)
                }}
                allowNew
                placeholder={t('Enter tags') + '...'}
                minQueryLength={1}
              />
            </Form.Group>

            {Object.values(this.state.data.String).map((e) => {
              return (
                <Form.Row key={e.id} className="fields">
                  <Form.Group as={Col}>
                    <Button
                      onClick={(event) => {
                        this.addField(e, event)
                      }}
                      name="String"
                      variant="light"
                      className="btn-block text-left shadow"
                    >
                      <i className="add-icon"></i>
                      {e.name}
                    </Button>
                  </Form.Group>
                </Form.Row>
              )
            })}
            {this.state.String.map((e) => {
              return (
                <Form.Group as={Row} key={e.id}>
                  <Col xs={12}>
                    <Form.Label>{e.name}</Form.Label>
                  </Col>
                  <Col xs={10}>
                    <Form.Control
                      type="text"
                      name="String"
                      value={e.value ? e.value : ''}
                      onChange={(event) => {
                        this.changeField(e, event)
                      }}
                    />
                  </Col>
                  <Col xs={2}>
                    <Button
                      onClick={(event) => {
                        this.deleteField(e, event)
                      }}
                      name="String"
                      variant="light"
                      className="text-left shadow"
                    >
                      {t('Delete')}
                    </Button>
                  </Col>
                </Form.Group>
              )
            })}

            {Object.values(this.state.data.Text).map((e) => {
              return (
                <Form.Row key={e.id} className="fields">
                  <Form.Group as={Col}>
                    <Button
                      onClick={(event) => {
                        this.addField(e, event)
                      }}
                      name="Text"
                      variant="light"
                      className="btn-block text-left shadow"
                    >
                      <i className="add-icon"></i>
                      {e.name}
                    </Button>
                  </Form.Group>
                </Form.Row>
              )
            })}
            {this.state.Text.map((e) => {
              return (
                <Form.Group as={Row} key={e.id}>
                  <Col xs={12}>
                    <Form.Label>{e.name}</Form.Label>
                  </Col>
                  <Col xs={10}>
                    <CKEditor
                      data={e.value}
                      config={{
                        language: 'en',
                        toolbarGroups: [
                          { name: 'clipboard', groups: ['undo', 'clipboard'] },
                          { name: 'document', groups: ['mode', 'document', 'doctools'] },
                          {
                            name: 'editing',
                            groups: ['find', 'selection', 'spellchecker', 'editing'],
                          },
                          { name: 'forms', groups: ['forms'] },
                          '/',
                          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                          {
                            name: 'paragraph',
                            groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'],
                          },
                          { name: 'links', groups: ['links'] },
                          { name: 'insert', groups: ['insert'] },
                          '/',
                          { name: 'colors', groups: ['colors'] },
                          { name: 'tools', groups: ['tools'] },
                          { name: 'others', groups: ['others'] },
                          { name: 'about', groups: ['about'] },
                        ],
                        removeButtons:
                          'Save,NewPage,Preview,Print,Templates,PasteFromWord,PasteText,Find,Replace,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Maximize,ShowBlocks,About,Image,Flash,PageBreak,Iframe,Anchor',
                      }}
                      onChange={(evt) => {
                        this.setState({
                          Text: update(this.state.Text, {
                            [this.state.Text.indexOf(e)]: { value: { $set: evt.editor.getData() } },
                          }),
                        })
                      }}
                    />
                  </Col>
                  <Col xs={2}>
                    <Button
                      onClick={(event) => {
                        this.deleteField(e, event)
                      }}
                      name="Text"
                      variant="light"
                      className="text-left shadow"
                    >
                      {t('Delete')}
                    </Button>
                  </Col>
                </Form.Group>
              )
            })}

            {Object.values(this.state.data.Number).map((e) => {
              return (
                <Form.Row key={e.id} className="fields">
                  <Form.Group as={Col}>
                    <Button
                      onClick={(event) => {
                        this.addField(e, event)
                      }}
                      name="Number"
                      variant="light"
                      className="btn-block text-left shadow"
                    >
                      <i className="add-icon"></i>
                      {e.name}
                    </Button>
                  </Form.Group>
                </Form.Row>
              )
            })}
            {this.state.Number.map((e) => {
              return (
                <Form.Group as={Row} key={e.id}>
                  <Col xs={12}>
                    <Form.Label>{e.name}</Form.Label>
                  </Col>
                  <Col xs={10}>
                    <Form.Control
                      name="Number"
                      value={e.value ? e.value : ''}
                      onChange={(event) => {
                        if (event.target.value === '' || /^[0-9\b]+$/.test(event.target.value))
                          this.changeField(e, event)
                      }}
                    />
                  </Col>
                  <Col xs={2}>
                    <Button
                      onClick={(event) => {
                        this.deleteField(e, event)
                      }}
                      name="Number"
                      variant="light"
                      className="text-left shadow"
                    >
                      {t('Delete')}
                    </Button>
                  </Col>
                </Form.Group>
              )
            })}

            {Object.values(this.state.data.Date).map((e) => {
              return (
                <Form.Row key={e.id} className="fields">
                  <Form.Group as={Col}>
                    <Button
                      onClick={(event) => {
                        this.addField(e, event)
                      }}
                      name="Date"
                      variant="light"
                      className="btn-block text-left shadow"
                    >
                      <i className="add-icon"></i>
                      {e.name}
                    </Button>
                  </Form.Group>
                </Form.Row>
              )
            })}
            {this.state.Date.map((e) => {
              return (
                <Form.Group as={Row} key={e.id}>
                  <Col xs={12}>
                    <Form.Label className="mr-1">{e.name}</Form.Label>
                  </Col>
                  <Col xs={10}>
                    <DatePicker
                      selected={e.value ? e.value : ''}
                      onChange={(event) => {
                        this.setState({
                          Date: update(this.state.Date, {
                            [this.state.Date.indexOf(e)]: { value: { $set: event } },
                          }),
                        })
                      }}
                    />
                  </Col>
                  <Col xs={2}>
                    <Button
                      onClick={(event) => {
                        this.deleteField(e, event)
                      }}
                      name="Date"
                      variant="light"
                      className="text-left shadow"
                    >
                      {t('Delete')}
                    </Button>
                  </Col>
                </Form.Group>
              )
            })}

            {Object.values(this.state.data.Checkbox).map((e) => {
              return (
                <Form.Row key={e.id} className="fields">
                  <Form.Group as={Col}>
                    <Button
                      onClick={(event) => {
                        this.addField(e, event)
                      }}
                      name="Checkbox"
                      variant="light"
                      className="btn-block text-left shadow"
                    >
                      <i className="add-icon"></i>
                      {e.name}
                    </Button>
                  </Form.Group>
                </Form.Row>
              )
            })}
            {this.state.Checkbox.map((e) => {
              return (
                <Form.Group key={e.id} as={Row}>
                  <Col xs={12}>
                    <Form.Label column md="auto">
                      {e.name}
                    </Form.Label>
                  </Col>
                  <Col xs={1} />
                  <Col xs={9}>
                    <Form.Check
                      type="checkbox"
                      onChange={(event) => {
                        this.setState({
                          Checkbox: update(this.state.Checkbox, {
                            [this.state.Checkbox.indexOf(e)]: {
                              value: { $set: event.target.checked },
                            },
                          }),
                        })
                      }}
                    />
                  </Col>
                  <Col xs={2}>
                    <Button
                      onClick={(event) => {
                        this.deleteField(e, event)
                      }}
                      name="Checkbox"
                      variant="light"
                      className="text-left shadow"
                    >
                      {t('Delete')}
                    </Button>
                  </Col>
                </Form.Group>
              )
            })}
          </Col>

          <Col className="mt-3 mb-5 button" xs={10}>
            <Button type="submit" variant="Light">
              {t('Create item')}
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default withTranslation()(add_item)

