import React, { Component } from 'react'
import { Account, Collection, Item, Theme } from '../../ajax'
import { Row, Col, Spinner, Button, DropdownButton, Dropdown, Alert } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import update from 'immutability-helper'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import dateFormat from 'dateformat'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import './style.scss'

class CollectionPage extends Component {
  state = {
    execute: true,
    collection: '',
    Owner: '',
    Theme: '',
    Items: '',
    edit: false,
    location: this.props.location,
    message: ''
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.key !== state.location.key) {
      window.location.reload()
    }
    return null
  }

  async componentDidMount() {
    try {
      let verify = await Account.verify()
      let collection = await Collection.getCollection({ id: this.props.match.params.collection })
      let profile = await Account.get({ id: collection.data.userId })
      let theme = await Theme.getOneTheme({ id: collection.data.themeId })
      let items = await Item.getUserItems({ id: this.props.match.params.collection })
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
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
  }

  handleCreate = () => {
    this.props.history.push('/collection-' + this.props.match.params.collection + '/add_item')
  }

  handleDelete = async e => {
    try {
      let res = await Item.delete({ id: e.id })
      if (res.verify === false || res.execute === false) {
        this.setState({ status: false })
      } else {
        this.setState({
          Items: update(this.state.Items, { $splice: [[this.state.Items.indexOf(e), 1]] }),
        })
      }
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
  }

  Formatter(column, colIndex, { sortElement, filterElement }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filterElement}
        {console.log(filterElement)}
        {column.text}
        {sortElement}
      </div>
    )
  }

  CreateTable = () => {
    const { t } = this.props
    const columns = [
      {
        dataField: 'id',
        text: 'ID',
        sort: true,
      },
      {
        dataField: 'name',
        text: t('Name'),
        sort: true,
        filter: textFilter({
          placeholder: t('Enter') + '...',
        }),
        headerFormatter: this.Formatter,
      },
      {
        dataField: 'createdAt',
        text: t('CreatedAt'),
        sort: true,
        filter: textFilter({
          placeholder: t('Enter') + '...',
        }),
        headerFormatter: this.Formatter,
        formatter: (cell, row, rowIndex, extraData) => {
          return <p>{dateFormat(cell, 'yyyy-mm-dd HH:MM')}</p>
        },
      },
      {
        dataField: 'button',
        text: t('Function'),
        formatter: (cell, row, rowIndex, extraData) => {
          return (
            <DropdownButton variant={'light'} id="dropdown-basic-button" title={t('Function')}>
              {this.state.edit && (
                <>
                  <Dropdown.Item
                    className="ml-3"
                    onClick={item => {
                      this.props.history.push('/item-' + row.id + '/edit')
                    }}
                  >
                    <i className="edit-toggle"></i>
                    {t('Edit')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="ml-3"
                    onClick={item => {
                      this.handleDelete(row)
                    }}
                  >
                    <i className="delete-toggle"></i>
                    {t('Delete')}
                  </Dropdown.Item>
                </>
              )}
              <Dropdown.Item
                className="ml-3"
                onClick={item => {
                  this.props.history.push('/item-' + row.id)
                }}
              >
                <i className="open-toggle"></i>
                {t('Open')}
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
        filter={filterFactory()}
        wrapperClasses="table-responsive table-sm shadow"
        pagination={paginationFactory()}
      />
    )
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
      <div className="collection">
        <Row className="justify-content-center">
          <Col xs={10} className="mt-3 box shadow">
            <p className="font-weight-bold mt-3">
              {t('Name collection')}: {this.state.collection.name}
            </p>
            <p className="font-weight-bold">
              {t('Theme')}: {t(this.state.Theme)}
            </p>
            <p className="font-weight-bold mb-3">
              {t('Owner')}: {this.state.Owner}
            </p>
          </Col>
          <Col xs={10} className="mt-3 box shadow">
            {this.state.collection.link_image && (
              <img
                className="mt-3"
                alt="link_image"
                style={{ maxHeight: '300px', maxWidth: '100%' }}
                src={this.state.collection.link_image}
              ></img>
            )}
            <p className="font-weight-bold mt-3">{t('Description')}:</p>
            <Markdown escapeHtml={false} source={this.state.collection.text} />
          </Col>
          <Col xs={10}>
            <p className="h1 mt-3">{t('Fields')}:</p>
          </Col>
          <Col xs={10}>
            <Row className="justify-content-center">
              {this.state.collection.data.String.length !== 0 && (
                <Col>
                  <ul className="list-group shadow">
                    <li className="list-group-item active text-center">{t('String')}:</li>
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
            </Row>
            <Row className="justify-content-center mt-3">
              {this.state.collection.data.Date.length !== 0 && (
                <Col>
                  <ul className="list-group shadow">
                    <li className="list-group-item active text-center">{t('Date')}:</li>
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
            </Row>
            <Row className="justify-content-center mt-3">
              {this.state.collection.data.Text.length !== 0 && (
                <Col>
                  <ul className="list-group shadow">
                    <li className="list-group-item active text-center">{t('Text')}:</li>
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
            <Row className="justify-content-center mt-3">
              {this.state.collection.data.Number.length !== 0 && (
                <Col>
                  <ul className="list-group shadow">
                    <li className="list-group-item active text-center">{t('Number')}:</li>
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
            </Row>
            <Row className="justify-content-center mt-3">
              {this.state.collection.data.Checkbox.length !== 0 && (
                <Col>
                  <ul className="list-group shadow">
                    <li className="list-group-item active text-center">{t('Checkbox')}:</li>
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
        <Row className="justify-content-center mt-3">
          <Col xs={10}>
            <p className="h1 mt-3">{t('Items')}:</p>
          </Col>
          <Col xs={10}>{this.CreateTable()}</Col>
          <Col xs={10} className="mb-5">
            {this.state.edit && (
              <Button
                type="button"
                onClick={event => {
                  this.handleCreate()
                }}
                variant="outline-primary"
              >
                {t('Create item')}
              </Button>
            )}
          </Col>
        </Row>
      </div>
    )
  }
}

export default withTranslation()(CollectionPage)
