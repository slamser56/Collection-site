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
    String: '',
    Number: [],
    Text: [],
    Date: [],
    Checkbox: [],
    message: '',
    execute: true,
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
    }).then(res => {
      Tag.update({ data: this.state.tags, itemId: this.props.match.params.item }).then(result => {
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
    if (!this.state.String) {
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
        onSubmit={event => {
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
                onChange={event => {
                  this.setState({ name: event.target.value })
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('Tags')}</Form.Label>
              <ReactTags
                tags={this.state.tags}
                suggestions={this.state.suggestions}
                handleDelete={e => {
                  this.handleDelete(e)
                }}
                handleAddition={e => {
                  this.handleAddition(e)
                }}
                allowNew
                placeholder={t('Enter tags') + '...'}
                minQueryLength={1}
              />
            </Form.Group>

            {this.state.String.map(e => {
              return (
                <Form.Group key={e.id}>
                  <Form.Label>{e.name}</Form.Label>
                  <Form.Control
                    type="text"
                    name="String"
                    value={e.value ? e.value : ''}
                    onChange={event => {
                      this.changeField(e, event)
                    }}
                  />
                </Form.Group>
              )
            })}

            {this.state.Text.map(e => {
              return (
                <Form.Group key={e.id}>
                  <Form.Label>{e.name}</Form.Label>
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
                    onChange={evt => {
                      this.setState({
                        Text: update(this.state.Text, {
                          [this.state.Text.indexOf(e)]: { value: { $set: evt.editor.getData() } },
                        }),
                      })
                    }}
                  />
                </Form.Group>
              )
            })}

            {this.state.Number.map(e => {
              return (
                <Form.Group key={e.id}>
                  <Form.Label>{e.name}</Form.Label>
                  <Form.Control
                    name="Number"
                    value={e.value ? e.value : ''}
                    onChange={event => {
                      if (event.target.value === '' || /^[0-9\b]+$/.test(event.target.value))
                        this.changeField(e, event)
                    }}
                  />
                </Form.Group>
              )
            })}
            {this.state.Date.map(e => {
              return (
                <Form.Group key={e.id}>
                  <Form.Label className="mr-1">{e.name}</Form.Label>
                  <DatePicker
                    selected={Date.parse(e.value)}
                    onChange={event => {
                      this.setState({
                        Date: update(this.state.Date, {
                          [this.state.Date.indexOf(e)]: { value: { $set: event } },
                        }),
                      })
                    }}
                  />
                </Form.Group>
              )
            })}
            {this.state.Checkbox.map(e => {
              return (
                <Form.Group key={e.id} as={Row}>
                  <Form.Label column md="auto">
                    {e.name}
                  </Form.Label>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      checked={e.value}
                      onChange={event => {
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
