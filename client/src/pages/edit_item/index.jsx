import React, { Component } from 'react'
import { Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import { Collection, Item, Tag, Account } from '../../ajax'
import DatePicker from 'react-datepicker'
import CKEditor from 'ckeditor4-react'
import update from 'immutability-helper'
import ReactTags from 'react-tag-autocomplete'
import { withTranslation } from 'react-i18next'

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'

class EditItem extends Component {
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
    message: '',
    execute: true,
    data: '',
  }

  async componentDidMount() {
    try {
      let verify = await Account.verify()
      let suggestions = await Tag.getAllTags()
      let item = await Item.getItem({ id: this.props.match.params.item })
      let res = await Collection.getCollection({ id: item.data.collectionId })
      if (!(verify.status && (Number(verify.id) === Number(res.data.userId) || verify.admin)))
        this.props.history.push('/')
      let tag = await Tag.getTag({ id: item.data.id })

      res.data.data.Text = res.data.data.Text.filter((el) => {
        if (item.data.data.Text.length === 0) return el
        return item.data.data.Text.find((el2) => el2.id !== el.id)
      })
      res.data.data.Date = res.data.data.Date.filter((el) => {
        if (item.data.data.Date.length === 0) return el
        return item.data.data.Date.find((el2) => el2.id !== el.id)
      })
      res.data.data.Number = res.data.data.Number.filter((el) => {
        if (item.data.data.Number.length === 0) return el
        return item.data.data.Number.find((el2) => el2.id !== el.id)
      })
      res.data.data.String = res.data.data.String.filter((el) => {
        if (item.data.data.String.length === 0) return el
        return item.data.data.String.find((el2) => el2.id !== el.id)
      })
      res.data.data.Checkbox = res.data.data.Checkbox.filter((el) => {
        if (item.data.data.Checkbox.length === 0) return el
        return item.data.data.Checkbox.find((el2) => el2.id !== el.id)
      })

      this.setState({
        tags: tag.data,
        String: item.data.data.String,
        Date: item.data.data.Date,
        Text: item.data.data.Text,
        Number: item.data.data.Number,
        Checkbox: item.data.data.Checkbox,
        name: item.data.name,
        id: res.data.id,
        suggestions: suggestions.data,
        data: res.data.data,
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

  handleSubmit = () => {
    Item.update({
      id: this.props.match.params.item,
      name: this.state.name,
      data: {
        String: this.state.String,
        Date: this.state.Date,
        Text: this.state.Text,
        Number: this.state.Number,
        Checkbox: this.state.Checkbox,
      },
    }).then((res) => {
      Tag.update({ data: this.state.tags, itemId: this.props.match.params.item }).then((result) => {
        this.props.history.push('/collection-' + this.state.id)
      })
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
                      selected={Date.parse(e.value)}
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
              {t('Save item')}
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default withTranslation()(EditItem)
