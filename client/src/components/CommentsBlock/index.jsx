import React, { Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import CKEditor from 'ckeditor4-react'
import { GetComment, Verify } from '../../ajax/actions'
import Markdown from 'react-markdown'
import dateFormat from 'dateformat'
import update from 'immutability-helper'
import openSocket from 'socket.io-client'
const socket = openSocket((process.env.NODE_ENV === 'production')?window.location.host:'http://localhost:5000/')

class CommentsBlock extends Component {
  state = {
    id: '',
    text: '',
    comment: '',
    edit: '',
    message: '',
  }

  sendmessage(message, itemId) {
     this.setState({text: ''})
    socket.emit('sendmessage', {
      body: { text: message, itemId: itemId, token: localStorage.getItem('token') },
    })
  }

  join(itemId){
    socket.emit('JoinToComment', {itemId: itemId })
  }

  getmessage() {
    socket.on('newMessage', res => {
        this.setState({ comment: update(this.state.comment, { $push: [res.data] }) })
    })
  }

  componentDidMount() {
    Verify().then(verify => {
      GetComment({ id: this.props.itemId }).then(res => {
        this.join(this.props.itemId)
        this.setState({ comment: res.data, edit: verify.status })
      })
    })
    this.getmessage()
  }

  handleSubmit = () => {
    if (this.state.text) this.sendmessage(this.state.text, this.props.itemId)
  }

  render() {
    return (
      <>
        {Object.values(this.state.comment).map(val => {
          return (
            <Row key={this.state.comment.indexOf(val)} className="border">
              <Col>
                <p className="font-weight-bold">login: {val.login}</p>
                <p className="font-weight-bold">userId: {val.userId} </p>
                <p className="font-weight-bold">
                  written: {dateFormat(val.createdAt, 'yyyy-mm-dd HH:MM')}
                </p>
                <p className="font-weight-bold">Text:</p>
                <Markdown escapeHtml={false} source={val.text} />
              </Col>
            </Row>
          )
        })}
        {this.state.edit && (
          <Row className="justify-content-center">
            <Col className="border">
              <CKEditor
                data={this.state.text}
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
                onChange={evt => this.setState({ text: evt.editor.getData() })}
              />
              <Row className="justify-content-md-end">
                <Col className="mt-2" xs lg="2">
                  <Button
                    type="button"
                    onClick={event => {
                      this.handleSubmit()
                    }}
                    variant="outline-primary"
                  >
                    Write
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </>
    )
  }
}

export default CommentsBlock
