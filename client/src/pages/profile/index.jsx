import React, { Component } from 'react'
import { Row, Col, Button, Spinner, DropdownButton, Dropdown } from 'react-bootstrap'
import { Account, Collection, Item } from '../../ajax'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import update from 'immutability-helper'
import { Parser } from 'json2csv'
import './profile.scss'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

class Profile extends Component {
  state = {
    account: '',
    collection: '',
    edit: false,
    location: this.props.location,
    status: false,
    csv: '',
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.key !== state.location.key) {
      window.location.reload()
    }
    return null
  }

  componentDidMount() {
    Account.verify().then(verify => {
      Account.get({ id: this.props.match.params.id }).then(profile => {
        Collection.getCollectionsUser({ id: this.props.match.params.id }).then(collection => {
          this.setState({
            collection: collection.data,
            account: profile.data,
            status: verify.status,
            edit:
              verify.status && (verify.admin || Number(verify.id) === Number(profile.data.id))
                ? true
                : false,
          })
        })
      })
    })
  }

  handleDelete = e => {
    Collection.delete({ id: e.id })
      .then(res => {
        if (res.execute) {
          this.setState({
            collection: update(this.state.collection, {
              $splice: [[this.state.collection.indexOf(e), 1]],
            }),
          })
        } else {
          window.location.reload()
        }
      })
      .catch(err => {
        this.setState({ verify: false })
      })
  }

  handleExport = id => {
    Item.getUserItems({ id: id }).then(items => {
      const fields = ['id', 'name', 'createdAt', 'data']
      const opts = { fields }
      try {
        const parser = new Parser(opts)
        const csv = parser.parse(items.data)
        const element = document.createElement('a')
        const file = new Blob([csv], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = 'File.csv'
        document.body.appendChild(element)
        element.click()
      } catch (err) {
        console.error(err)
      }
    })
  }

  CreateTable = () => {
    const columns = [
      {
        dataField: 'id',
        text: 'ID',
        sort: true,
      },
      {
        dataField: 'name',
        text: 'Name',
        sort: true,
      },
      {
        dataField: 'theme',
        text: 'Theme',
        sort: true,
      },
      {
        dataField: 'link_image',
        text: 'Image',
        formatter: (cell, row, rowIndex, extraData) => {
          if (cell)
            return <img src={cell} alt={rowIndex} style={{ width: '50px', height: '50px' }} />
        },
      },
      {
        dataField: 'button',
        text: 'Function',
        formatter: (cell, row, rowIndex, extraData) => {
          return (
            <DropdownButton id="dropdown-basic-button" title="Function">
              {this.state.edit && (
                <>
                  <Dropdown.Item
                    onClick={item => {
                      this.props.history.push('/collection-' + row.id + '/edit')
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={item => {
                      this.handleDelete(row)
                    }}
                  >
                    Delete
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={item => {
                      this.handleExport(row.id)
                    }}
                  >
                    Export CSV
                  </Dropdown.Item>
                </>
              )}
              <Dropdown.Item
                onClick={item => {
                  this.props.history.push('/collection-' + row.id)
                }}
              >
                Open
              </Dropdown.Item>
            </DropdownButton>
          )
        },
      },
    ]

    return (
      <BootstrapTable
        bootstrap4
        keyField="id"
        data={this.state.collection}
        columns={columns}
        striped
        wrapperClasses="table-responsive table-sm"
        pagination={paginationFactory()}
      />
    )
  }

  render() {
    if (!this.state.account || !this.state.collection) {
      return (
        <Row className="justify-content-center align-items-center mt-5">
          <Col xs={2}>
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      )
    }

    return (
      <>
        <Row>
          <Col className="bg-light border">
            <p className="font-weight-bold">Login: {this.state.account.login}</p>
            <p className="font-weight-bold">Fullname: {this.state.account.fullname}</p>
            <p className="font-weight-bold">E-mail: {this.state.account.mail}</p>
            <p className="font-weight-bold">Status: {this.state.account.status ? 'Active' : ''}</p>
            <p className="font-weight-bold">Admin: {this.state.account.admin ? 'Yes' : 'No'}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="font-weight-bold">Collection:</p>
          </Col>
        </Row>
        {this.state.edit && (
          <Button
            onClick={event => {
              this.props.history.push('/profile-' + this.props.match.params.id + '/add_collection')
            }}
            variant="outline-primary"
          >
            Create collection
          </Button>
        )}
        <Row>{this.state.collection && <>{this.CreateTable()}</>}</Row>
      </>
    )
  }
}

export default Profile
