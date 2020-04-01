import React, { Component } from 'react'
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import { FindCollection, CreateItem, CreateTag, GetAllTag } from '../../ajax/actions'
import DatePicker from 'react-datepicker'
import CKEditor from 'ckeditor4-react'
import update from 'immutability-helper'
import ReactTags from 'react-tag-autocomplete'

import 'react-datepicker/dist/react-datepicker.css'
import './add_item.scss'

class add_item extends Component {
  state = {
    id: '',
    name: '',
    tags: [],
    suggestions: [],
    String: 'wait',
    Number: [],
    Text: [],
    Date: [],
    Checkbox: [],
  }

  componentDidMount() {
    GetAllTag().then(res => {
      this.setState({ suggestions: res.data })
    })
    FindCollection({ id: this.props.match.params.collection }).then(res => {
      this.setState({
        String: res.data.data.String,
        Date: res.data.data.Date,
        Text: res.data.data.Text,
        Number: res.data.data.Number,
        Checkbox: res.data.data.Checkbox,
        id: res.data.id,
      })
    })
  }

  changeField = (e, event) => {
    this.setState({
      [event.target.name]: update(this.state[event.target.name], {
        [this.state[event.target.name].indexOf(e)]: { value: { $set: event.target.value } },
      }),
    })
  }

  handleSubmit = () => {
    CreateItem({
      id: this.props.match.params.collection,
      name: this.state.name,
      data: {
        String: this.state.String,
        Number: this.state.Number,
        Text: this.state.Text,
        Date: this.state.Date,
        Checkbox: this.state.Checkbox,
      },
    }).then(res => {
      CreateTag({
        data: this.state.tags,
        itemId: res.itemId,
      }).then(result => {
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
    if (this.state.String === 'wait') {
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
        <div></div>
        <Form.Group controlId="NameCollection">
          <Form.Label>Name of item</Form.Label>
          <Form.Control
            required
            type="text"
            value={this.state.name}
            placeholder="Enter name of item"
            onChange={event => {
              this.setState({ name: event.target.value })
            }}
          />
        </Form.Group>
        <Form.Group controlId="NameCollection">
          <Form.Label>Tags</Form.Label>
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
            placeholder="Enter tags"
            minQueryLength={1}
          />
        </Form.Group>

        {this.state.String.map(e => {
          return (
            <Form.Group key={e.id} as={Row} controlId="formPlaintextPassword">
              <Form.Label column md="auto">
                {e.name}
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  name="String"
                  value={e.value ? e.value : ''}
                  onChange={event => {
                    this.changeField(e, event)
                  }}
                />
              </Col>
            </Form.Group>
          )
        })}

        {this.state.Text.map(e => {
          return (
            <Form.Group key={e.id} as={Row} controlId="formPlaintextPassword">
              <Form.Label column md="auto">
                {e.name}
              </Form.Label>
              <Col>
                <CKEditor
                  data={this.state.Description}
                  config={{
                    language: 'en',
                    toolbarGroups: [
                      { name: 'clipboard', groups: ['undo', 'clipboard'] },
                      { name: 'document', groups: ['mode', 'document', 'doctools'] },
                      { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
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
              </Col>
            </Form.Group>
          )
        })}

        {this.state.Number.map(e => {
          return (
            <Form.Group key={e.id} as={Row} controlId="formPlaintextPassword">
              <Form.Label column md="auto">
                {e.name}
              </Form.Label>
              <Col>
                <Form.Control
                  name="Number"
                  value={e.value ? e.value : ''}
                  onChange={event => {
                    if (event.target.value === '' || /^[0-9\b]+$/.test(event.target.value))
                      this.changeField(e, event)
                  }}
                />
              </Col>
            </Form.Group>
          )
        })}
        {this.state.Date.map(e => {
          return (
            <Form.Group key={e.id} as={Row} controlId="formPlaintextPassword">
              <Form.Label column md="auto">
                {e.name}
              </Form.Label>
              <Col>
                <DatePicker
                  selected={e.value ? e.value : ''}
                  onChange={event => {
                    this.setState({
                      Date: update(this.state.Date, {
                        [this.state.Date.indexOf(e)]: { value: { $set: event } },
                      }),
                    })
                  }}
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
                <Form.Check
                  type="checkbox"
                  onChange={event => {
                    this.setState({
                      Checkbox: update(this.state.Checkbox, {
                        [this.state.Checkbox.indexOf(e)]: { value: { $set: event.target.checked } },
                      }),
                    })
                  }}
                />
              </Col>
            </Form.Group>
          )
        })}

        <Row className="justify-content-md-end">
          <Col className="mt-2" xs lg="2">
            <Button type="submit" variant="outline-primary">
              Create
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default add_item
