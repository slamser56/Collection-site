import React, { Component } from 'react'
import { Row, Col, Button, Alert } from 'react-bootstrap'
import CKEditor from 'ckeditor4-react'
import { Account } from '../../ajax'
import { withTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import dateFormat from 'dateformat'
import update from 'immutability-helper'
import openSocket from 'socket.io-client'
import './style.scss'
const socket = openSocket(
  process.env.NODE_ENV === 'production' ? window.location.host : 'http://localhost:5000/'
)

class CommentsBlock extends Component {
  state = {
    id: '',
    text: '',
    comment: '',
    edit: '',
    message: '',
    execute: true
  }

  sendmessage(message, itemId) {
    this.setState({ text: '' })
    socket.emit('sendmessage', {
      body: { text: message, itemId: itemId, token: localStorage.getItem('token') },
    })
  }

  join(itemId) {
    socket.emit('JoinToComment', { itemId: itemId })
  }

  getmessage() {
    socket.on('newMessage', res => {
      this.setState({ comment: update(this.state.comment, { $push: [res.data] }) })
    })
  }

  async componentDidMount() {
    try {
      let verify = await Account.verify()
      let res = await Account.getComment({ id: this.props.itemId })
      this.join(this.props.itemId)
      this.setState({ comment: res.data, edit: verify.status })
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
    this.getmessage()
  }

  handleSubmit = () => {
    if (this.state.text) this.sendmessage(this.state.text, this.props.itemId)
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
      <>
        {Object.values(this.state.comment).map(val => {
          return (
            <Row key={this.state.comment.indexOf(val)} className=" mt-1 box shadow">
              <Col>
                <p className="mt-3">{t("Login")}: {val.login}</p>
                <p className="">{t("User Id")}: {val.userId} </p>
                <p className="">
                  {t("Written")}: {dateFormat(val.createdAt, 'yyyy-mm-dd HH:MM')}
                </p>
                <div className="horisontal-Line"/>
                <Markdown escapeHtml={false} source={val.text} className="mt-3"/>
              </Col>
            </Row>
          )
        })}
        {this.state.edit && (
          <Row className="justify-content-center mt-4">
            <Col>
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
                <Col className="mt-3 mb-5" xs lg="2">
                  <Button
                    type="button"
                    onClick={event => {
                      this.handleSubmit()
                    }}
                    variant="light"
                  >
                    {t("Write")}
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

export default withTranslation()(CommentsBlock)
