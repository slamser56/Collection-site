import React, { Component } from 'react'
import {
  FindCollection,
  Verify,
  GetProfile,
  FindOneTheme,
  FindUserItems,
  DeleteItem,
} from '../../ajax/actions'
import { Row, Col, Spinner, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import Markdown from 'react-markdown'
import update from 'immutability-helper'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import dateFormat from 'dateformat'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import './collection.scss'

class Collection extends Component {
  state = {
    execute: '',
    collection: '',
    Owner: '',
    Theme: '',
    Items: '',
    edit: false,
  }

  componentDidMount() {
    Verify().then(verify => {
      FindCollection({ id: this.props.match.params.collection }).then(collection => {
        GetProfile({ id: collection.data.userId }).then(profile => {
          FindOneTheme({ id: collection.data.themeId }).then(theme => {
            FindUserItems({ id: this.props.match.params.collection }).then(items => {
              this.setState({
                Theme: theme.theme.name_theme,
                collection: collection.data,
                Owner: profile.data.login,
                Items: items.data,
                edit:
                  verify.status && (verify.admin || Number(verify.id) === Number(profile.data.id))
                    ? true
                    : false,
              })
            })
          })
        })
      })
    })
  }

  handleCreate = () => {
    this.props.history.push('/collection-' + this.props.match.params.collection + '/add_item')
  }

  handleDelete = e => {
    DeleteItem({ id: e.id })
      .then(res => {
        if (res.verify === false || res.execute === false) {
          this.setState({ verify: false })
        } else {
          this.setState({
            Items: update(this.state.Items, { $splice: [[this.state.Items.indexOf(e), 1]] }),
          })
        }
      })
      .catch(err => {
        this.setState({ verify: false })
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
        dataField: 'createdAt',
        text: 'CreatedAt',
        sort: true,
        formatter: (cell, row, rowIndex, extraData) => {
          return <p>{dateFormat(cell, 'yyyy-mm-dd HH:MM')}</p>
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
                      this.props.history.push('/item-' + row.id + '/edit')
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
                </>
              )}
              <Dropdown.Item
                onClick={item => {
                  this.props.history.push('/item-' + row.id)
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
        data={this.state.Items}
        columns={columns}
        striped
        wrapperClasses="table-responsive table-sm"
        pagination={paginationFactory()}
      />
    )
  }

  render() {
    if (!this.state.collection || !this.state.Items) {
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
            <p className="font-weight-bold">Name collection: {this.state.collection.name}</p>
            <p className="font-weight-bold">Theme: {this.state.Theme}</p>
            <p className="font-weight-bold">Owner: {this.state.Owner}</p>
            {this.state.collection.link_image && (
              <>
                <p className="font-weight-bold">Image:</p>

                <img
                  alt="link_image"
                  style={{ height: '300px', width: 'auto' }}
                  src={this.state.collection.link_image}
                ></img>
              </>
            )}
            <p className="font-weight-bold">Description:</p>
            <Markdown escapeHtml={false} source={this.state.collection.text} />
            <p className="font-weight-bold">Fields:</p>
            <Row>
              {this.state.collection.data.String.length !== 0 && (
                <Col>
                  <ul className="list-group">
                    <li className="list-group-item active">String:</li>
                    {Object.values(this.state.collection.data.String).map(val => {
                      return (
                        <li key={val.id} className="list-group-item">
                          {val.name}
                        </li>
                      )
                    })}
                  </ul>
                </Col>
              )}
              {this.state.collection.data.Date.length !== 0 && (
                <Col>
                  <ul className="list-group">
                    <li className="list-group-item active">Date:</li>
                    {Object.values(this.state.collection.data.Date).map(val => {
                      return (
                        <li key={val.id} className="list-group-item">
                          {val.name}
                        </li>
                      )
                    })}
                  </ul>
                </Col>
              )}
              {this.state.collection.data.Text.length !== 0 && (
                <Col>
                  <ul className="list-group">
                    <li className="list-group-item active">Text:</li>
                    {Object.values(this.state.collection.data.Text).map(val => {
                      return (
                        <li key={val.id} className="list-group-item">
                          {val.name}
                        </li>
                      )
                    })}
                  </ul>
                </Col>
              )}
            </Row>
            <Row className="mt-2">
              {this.state.collection.data.Number.length !== 0 && (
                <Col xs={4}>
                  <ul className="list-group">
                    <li className="list-group-item active">Number:</li>
                    {Object.values(this.state.collection.data.Number).map(val => {
                      return (
                        <li key={val.id} className="list-group-item">
                          {val.name}
                        </li>
                      )
                    })}
                  </ul>
                </Col>
              )}
              {this.state.collection.data.Checkbox.length !== 0 && (
                <Col xs={4}>
                  <ul className="list-group">
                    <li className="list-group-item active">Checkbox:</li>
                    {Object.values(this.state.collection.data.Checkbox).map(val => {
                      return (
                        <li key={val.id} className="list-group-item">
                          {val.name}
                        </li>
                      )
                    })}
                  </ul>
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        <p className="font-weight-bold">Item:</p>

        <Row>
          {this.state.edit && (
            <Button
              type="button"
              onClick={event => {
                this.handleCreate()
              }}
              variant="outline-primary"
            >
              Create item
            </Button>
          )}
          {this.CreateTable()}
        </Row>
      </>
    )
  }
}

export default Collection
