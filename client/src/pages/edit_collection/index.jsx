import React, { Component } from 'react'
import { Form, Col, Button, Row, Alert, ProgressBar } from 'react-bootstrap'
import CKEditor from 'ckeditor4-react'
import { withTranslation } from 'react-i18next'
import Dropzone from 'react-dropzone'
import { Collection, Theme, Account } from '../../ajax'
import axios from 'axios'
import './style.scss'

class edit_collection extends Component {
  state = {
    execute: 'wait',
    Url: '',
    Name: '',
    Description: '',
    UploadPercent: 0,
    Upload: '',
    SelectedTheme: 1,
    theme: [],
    String: [],
    Number: [],
    Text: [],
    Date: [],
    Checkbox: [],
    userId: '',
    edit: true,
    message: '',
  }

  async componentDidMount() {
    try {
      let verify = await Account.verify()
      let res = await Collection.getCollection({ id: this.props.match.params.collection })
      if (!(verify.status && (Number(verify.id) === Number(res.data.userId) || verify.admin)))
          this.props.history.push('/')
        let theme = await Theme.getAllTheme()
        this.setState({
          theme: theme.theme,
          edit: res.edit,
          execute: res.execute,
          Url: res.data.link_image,
          Name: res.data.name,
          Description: res.data.text,
          SelectedTheme: res.data.themeId,
          String: res.data.data.String,
          Date: res.data.data.Date,
          Text: res.data.data.Text,
          Number: res.data.data.Number,
          Checkbox: res.data.data.Checkbox,
          userId: res.data.userId,
        })
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
  }

  toBase64(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    return new Promise((resolve, reject) => {
      reader.onload = event => {
        resolve(event.target.result)
      }
      reader.onerror = () => {
        reader.abort()
        reject('Problem parsing input file.')
      }
    })
  }

  uploadImage = fileImage => {
    let config = {
      onUploadProgress: progressEvent => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.setState({ UploadPercent: percentCompleted, Upload: true })
      },
    }
    this.toBase64(fileImage).then(res => {
      axios.post('/UploadImage', { data: res }, config).then(res => {
        this.setState({ Url: res.data.url, Upload: false })
      })
    })
  }

  handleSubmit = async () => {
    try {
      let res = await Collection.update({
        id: this.props.match.params.collection,
        name: this.state.Name,
        link_image: this.state.Url,
        text: this.state.Description,
        themeId: this.state.SelectedTheme,
        data: {
          String: this.state.String,
          Number: this.state.Number,
          Text: this.state.Text,
          Date: this.state.Date,
          Checkbox: this.state.Checkbox,
        },
      })
      if (res.execute) {
        this.props.history.push('/profile-' + this.state.userId)
      }
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
  }

  handleDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length !== 0) {
      this.setState({
        imagePreview: URL.createObjectURL(acceptedFiles[0]),
      })
      this.uploadImage(acceptedFiles[0])
    }
  }

  addField = event => {
    this.setState({
      [event.target.name]: this.state[event.target.name].concat({
        id:
          this.state[event.target.name].length > 0
            ? this.state[event.target.name][this.state[event.target.name].length - 1].id + 1
            : 1,
        name: '',
      }),
    })
  }
  deleteField = (e, event) => {
    let array = this.state[event.target.name]
    array.splice(array.indexOf(e), 1)
    this.setState({ [event.target.name]: array })
  }
  changeField = (e, event) => {
    let array = this.state[event.target.name]
    array[array.indexOf(e)].name = event.target.value
    this.setState({ [event.target.name]: array })
  }

  handleSelect = event => {
    this.setState({ SelectedTheme: event.target.value })
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
    if (!this.state.execute) {
      return <Alert variant="danger">Something wrong, try later</Alert>
    }

    return (
      <Form
        onSubmit={event => {
          event.preventDefault()
          this.handleSubmit()
        }}
      >
        <Row className="justify-content-center collection-a">
          <Col xs={10} className="box shadow mt-3">
            <Form.Group controlId="NameCollection" className="mt-3">
              <Form.Label>{t('Name of collection')}</Form.Label>
              <Form.Control
                required
                type="text"
                value={this.state.Name}
                placeholder={t('Enter name of collection') + '...'}
                onChange={event => {
                  this.setState({ Name: event.target.value })
                }}
              />
            </Form.Group>
            <Form.Group controlId="ThemeControl">
              <Form.Label>{t('Theme')}</Form.Label>
              <Form.Control
                as="select"
                onChange={event => {
                  this.handleSelect(event)
                }}
              >
                {Object.values(this.state.theme).map(val => {
                  return (
                    <option key={val.id} value={val.id}>
                      {t(val.name_theme)}
                    </option>
                  )
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('Image')}</Form.Label>
              <Dropzone
                onDrop={this.handleDrop}
                accept="image/jpeg, image/png"
                minSize={0}
                maxSize={10485760}
              >
                {({
                  getRootProps,
                  getInputProps,
                  isDragActive,
                  isDragReject,
                  rejectedFiles,
                  acceptedFiles,
                }) => {
                  const maxSize = 10485760
                  const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize
                  const additionalClass = isDragActive ? 'dropzone_active' : 'dropzone_disable'
                  return (
                    <div {...getRootProps({ className: 'dropzone ' + additionalClass })}>
                      <input {...getInputProps()} />
                      {!isDragActive &&
                        acceptedFiles.length === 0 &&
                        t('Click here or drop a file to upload!')}
                      {isDragActive && t('Drop it')}
                      {rejectedFiles.length > 0 &&
                        !isDragActive &&
                        t('File type not accepted, sorry!')}
                      {isFileTooLarge && (
                        <div className="text-danger mt-2">{t('File is too large.')}</div>
                      )}
                      {(acceptedFiles.length !== 0 || this.state.Url) && !isDragActive ? (
                        <img alt="preview" style={{ width: '100%' }} src={this.state.Url} />
                      ) : (
                        <></>
                      )}
                      {this.state.Upload && <ProgressBar animated now={this.state.UploadPercent} />}
                    </div>
                  )
                }}
              </Dropzone>
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('Description')}</Form.Label>
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
                onChange={evt => this.setState({ Description: evt.editor.getData() })}
              />
            </Form.Group>
          </Col>
          <Col xs={10} className="mt-3 fields">
            <p className="h1">{t('Fields')}:</p>
            <Row className="mb-3 mt-2 justify-content-center">
              <Col>
                <Button
                  name="String"
                  onClick={event => {
                    this.addField(event)
                  }}
                  variant={'light'}
                  className="btn-block text-left shadow"
                >
                  <i className="add-icon"></i>
                  {t('String')}
                </Button>
              </Col>
            </Row>

            {this.state.String.map(e => {
              return (
                <Form.Row key={e.id} className="danger">
                  <Form.Group as={Col}>
                    <Row>
                      <Col>
                        <Form.Control
                          required
                          type="text"
                          name="String"
                          value={e.name}
                          onChange={event => {
                            this.changeField(e, event)
                          }}
                          placeholder={t('Name of string field')}
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          onClick={event => {
                            this.deleteField(e, event)
                          }}
                          name="String"
                          variant="danger"
                        >
                          {t('Delete')}
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form.Row>
              )
            })}
            <Row className="mb-3 justify-content-center">
              <Col>
                <Button
                  name="Number"
                  onClick={event => {
                    this.addField(event)
                  }}
                  variant={'light'}
                  className="btn-block text-left shadow"
                >
                  <i className="add-icon"></i>
                  {t('Number')}
                </Button>
              </Col>
            </Row>
            {this.state.Number.map(e => {
              return (
                <Form.Row key={e.id} className="danger">
                  <Form.Group as={Col}>
                    <Row>
                      <Col>
                        <Form.Control
                          required
                          type="text"
                          name="Number"
                          value={e.name}
                          onChange={event => {
                            this.changeField(e, event)
                          }}
                          placeholder={t('Name of number field')}
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          onClick={event => {
                            this.deleteField(e, event)
                          }}
                          name="Number"
                          variant="outline-danger"
                        >
                          {t('Delete')}
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form.Row>
              )
            })}
            <Row className="mb-3 justify-content-center">
              <Col>
                <Button
                  name="Date"
                  onClick={event => {
                    this.addField(event)
                  }}
                  variant={'light'}
                  className="btn-block text-left shadow"
                >
                  <i className="add-icon"></i>
                  {t('Date')}
                </Button>
              </Col>
            </Row>
            {this.state.Date.map(e => {
              return (
                <Form.Row key={e.id} className="danger">
                  <Form.Group as={Col}>
                    <Row>
                      <Col>
                        <Form.Control
                          required
                          type="text"
                          name="Date"
                          value={e.name}
                          onChange={event => {
                            this.changeField(e, event)
                          }}
                          placeholder={t('Name of date field')}
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          onClick={event => {
                            this.deleteField(e, event)
                          }}
                          name="Date"
                          variant="outline-danger"
                        >
                          {t('Delete')}
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form.Row>
              )
            })}
            <Row className="mb-3 justify-content-center">
              <Col>
                <Button
                  name="Checkbox"
                  onClick={event => {
                    this.addField(event)
                  }}
                  variant={'light'}
                  className="btn-block text-left shadow"
                >
                  <i className="add-icon"></i>
                  {t('Checkbox')}
                </Button>
              </Col>
            </Row>
            {this.state.Checkbox.map(e => {
              return (
                <Form.Row key={e.id} className="danger">
                  <Form.Group as={Col}>
                    <Row>
                      <Col>
                        <Form.Control
                          required
                          type="text"
                          name="Checkbox"
                          value={e.name}
                          onChange={event => {
                            this.changeField(e, event)
                          }}
                          placeholder={t('Name of checkbox field')}
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          onClick={event => {
                            this.deleteField(e, event)
                          }}
                          name="Checkbox"
                          variant="outline-danger"
                        >
                          {t('Delete')}
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form.Row>
              )
            })}
            <Row className="mb-3 justify-content-center">
              <Col>
                <Button
                  name="Text"
                  onClick={event => {
                    this.addField(event)
                  }}
                  variant={'light'}
                  className="btn-block text-left shadow"
                >
                  <i className="add-icon"></i>
                  {t('Text')}
                </Button>
              </Col>
            </Row>
            {this.state.Text.map(e => {
              return (
                <Form.Row key={e.id} className="danger">
                  <Form.Group as={Col}>
                    <Row>
                      <Col>
                        <Form.Control
                          required
                          type="text"
                          name="Text"
                          value={e.name}
                          onChange={event => {
                            this.changeField(e, event)
                          }}
                          placeholder={t('Name of text field')}
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          onClick={event => {
                            this.deleteField(e, event)
                          }}
                          name="Text"
                          variant="outline-danger"
                        >
                          {t('Delete')}
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form.Row>
              )
            })}

            <Row className="justify-content-md-end mb-5">
              <Col className="mt-2">
                <Button type="submit" variant="light">
                  {t('Save collection')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default withTranslation()(edit_collection)
