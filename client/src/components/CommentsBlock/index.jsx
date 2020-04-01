import React, {Component} from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import CKEditor from 'ckeditor4-react'
import {CreateComment, GetComment, Verify} from '../../ajax/actions'
import Markdown from 'react-markdown'
import dateFormat from 'dateformat'
import update from 'immutability-helper'


class CommentsBlock extends Component{
    state = {
        id: '',
        text: '',
        comment: '',
        edit: ''
      };

      componentDidMount(){
        Verify().then(verify=>{
            this.setState({edit: verify.status})
        })
        GetComment({id: this.props.itemId}).then(res=>{
            this.setState({comment: res.data})
        })
        }

        handleSubmit = () =>{
            CreateComment({text: this.state.text, itemId: this.props.itemId}).then(res =>{
              if(res.execute){
                this.setState({comment: update(this.state.comment, {$push: [res.data] })})
              }
            })
        }

    render(){
    return(
        <>
        { Object.values(this.state.comment).map(val => {
      return (<Row key={this.state.comment.indexOf(val)} className="border">
          <Col>
        <p className="font-weight-bold">login: {val.login}</p>
        <p className="font-weight-bold">userId: {val.userId} </p>
        <p className="font-weight-bold">written: {dateFormat(val.createdAt, 'yyyy-mm-dd HH:MM')}</p>
        <p className="font-weight-bold">Text:</p>
        <Markdown escapeHtml={false} source={val.text}/>
        </Col>
            </Row>)
         })}
        {this.state.edit && 
        <Row className="justify-content-center">
                <Col className="border">
                    <CKEditor
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
                    onChange={evt => this.setState({text: evt.editor.getData()})}
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
        </Row>}
        </>
    )}
}



export default CommentsBlock;