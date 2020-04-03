import React, { Component } from 'react'
import {
  Form,
  Col,
  Button,
  Row,
  DropdownButton,
  Dropdown,
  Alert,
  ProgressBar,
} from 'react-bootstrap'
import CKEditor from 'ckeditor4-react'
import Dropzone from 'react-dropzone'
import { Redirect } from 'react-router-dom'
import { Collection, Theme, Account } from '../../ajax'
import axios from 'axios'

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
    edit: '',
  }

  componentDidMount() {
    Account.verify()
      .then(verify => {
        Collection.getCollection({ id: this.props.match.params.collection }).then(res => {
          if (
            verify.status &&
            (Number([verify.id]) === Number([res.data.userId]) || verify.admin)
          ) {
            Theme.getAllTheme().then(theme => {
              if (theme.execute === false) {
                this.setState({ execute: false })
              } else {
                this.setState({ theme: theme.theme, execute: true })
              }
            })
          } else {
            this.setState({ execute: 'redirect' })
          }
          this.setState({
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
        })
      })
      .catch(err => {
        this.setState({ execute: false })
      })
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

  handleSubmit = () => {
    console.log(this.state)
    Collection.update({
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
    }).then(res => {
      if (res.execute) {
        this.props.history.push('/profile-' + this.state.userId)
      }
    })
  }

  handleDrop = acceptedFiles => {
    this.setState({
      imagePreview: URL.createObjectURL(acceptedFiles[0]),
    })
    this.uploadImage(acceptedFiles[0])
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
    if (this.state.edit === false) {
      return <Redirect to="/" />
    } else if (!this.state.execute) {
      return <Alert variant="danger">Something wrong, try later</Alert>
    }

    return (
      <Form
        onSubmit={event => {
          event.preventDefault()
          this.handleSubmit()
        }}
      >
        <Form.Group controlId="NameCollection">
          <Form.Label>Name of collection</Form.Label>
          <Form.Control
            required
            type="text"
            value={this.state.Name}
            placeholder="Enter name collection"
            onChange={event => {
              this.setState({ Name: event.target.value })
            }}
          />
        </Form.Group>
        <Form.Group controlId="ThemeControl">
          <Form.Label>Theme</Form.Label>
          <Form.Control
            value={this.state.SelectedTheme}
            as="select"
            onChange={event => {
              this.handleSelect(event)
            }}
          >
            {Object.values(this.state.theme).map(val => {
              return (
                <option key={val.id} value={val.id}>
                  {val.name_theme}
                </option>
              )
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Image</Form.Label>
          <Dropzone onDrop={this.handleDrop} accept="image/*" minSize={0} maxSize={10485760}>
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
                    !this.state.Url &&
                    'Click here or drop a file to upload!'}
                  {isDragActive && !isDragReject && 'Drop it'}
                  {isDragReject && 'File type not accepted, sorry!'}
                  {isFileTooLarge && <div className="text-danger mt-2">File is too large.</div>}
                  {(acceptedFiles.length !== 0 || this.state.Url) && !isDragActive ? (
                    <img alt="preview" style={{ width: '300px' }} src={this.state.Url} />
                  ) : null}
                  {this.state.Upload && <ProgressBar animated now={this.state.UploadPercent} />}
                </div>
              )
            }}
          </Dropzone>
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
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
        <Row className="mb-2">
          <DropdownButton id="dropdown-item-button" title="Add field">
            <Dropdown.Item
              name="String"
              onClick={event => {
                this.addField(event)
              }}
            >
              String
            </Dropdown.Item>
            <Dropdown.Item
              name="Number"
              onClick={event => {
                this.addField(event)
              }}
            >
              Number
            </Dropdown.Item>
            <Dropdown.Item
              name="Date"
              onClick={event => {
                this.addField(event)
              }}
            >
              Date
            </Dropdown.Item>
            <Dropdown.Item
              name="Checkbox"
              onClick={event => {
                this.addField(event)
              }}
            >
              Checkbox
            </Dropdown.Item>
            <Dropdown.Item
              name="Text"
              onClick={event => {
                this.addField(event)
              }}
            >
              Text
            </Dropdown.Item>
          </DropdownButton>
        </Row>

        {this.state.String.map(e => {
          return (
            <Form.Row key={e.id}>
              <Form.Group as={Col}>
                <Form.Label>Name of string field</Form.Label>
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
                      placeholder="Name of string field"
                    />
                  </Col>
                  <Col md="1">
                    <Button
                      onClick={event => {
                        this.deleteField(e, event)
                      }}
                      name="String"
                      variant="outline-danger"
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form.Row>
          )
        })}

        {this.state.Number.map(e => {
          return (
            <Form.Row key={e.id}>
              <Form.Group as={Col}>
                <Form.Label>Name of number field</Form.Label>
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
                      placeholder="Name of number field"
                    />
                  </Col>
                  <Col md="1">
                    <Button
                      onClick={event => {
                        this.deleteField(e, event)
                      }}
                      name="Number"
                      variant="outline-danger"
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form.Row>
          )
        })}

        {this.state.Date.map(e => {
          return (
            <Form.Row key={e.id}>
              <Form.Group as={Col}>
                <Form.Label>Name of date field</Form.Label>
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
                      placeholder="Name of date field"
                    />
                  </Col>
                  <Col md="1">
                    <Button
                      onClick={event => {
                        this.deleteField(e, event)
                      }}
                      name="Date"
                      variant="outline-danger"
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form.Row>
          )
        })}

        {this.state.Checkbox.map(e => {
          return (
            <Form.Row key={e.id}>
              <Form.Group as={Col}>
                <Form.Label>Name of checkbox field</Form.Label>
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
                      placeholder="Name of checkbox field"
                    />
                  </Col>
                  <Col md="1">
                    <Button
                      onClick={event => {
                        this.deleteField(e, event)
                      }}
                      name="Checkbox"
                      variant="outline-danger"
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form.Row>
          )
        })}

        {this.state.Text.map(e => {
          return (
            <Form.Row key={e.id}>
              <Form.Group as={Col}>
                <Form.Label>Name of text field</Form.Label>
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
                      placeholder="Name of text field"
                    />
                  </Col>
                  <Col md="1">
                    <Button
                      onClick={event => {
                        this.deleteField(e, event)
                      }}
                      name="Text"
                      variant="outline-danger"
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form.Row>
          )
        })}

        <Row className="justify-content-md-end">
          <Col className="mt-2" xs lg="2">
            <Button type="submit" variant="outline-primary">
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default edit_collection
