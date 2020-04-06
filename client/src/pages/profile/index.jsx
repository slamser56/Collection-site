import React, { Component } from 'react'
import { Row, Col, Button, Spinner, DropdownButton, Dropdown, Alert } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import { Account, Collection, Item } from '../../ajax'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import update from 'immutability-helper'
import { Parser } from 'json2csv'
import './style.scss'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

class Profile extends Component {
  state = {
    account: '',
    collection: '',
    edit: false,
    location: this.props.location,
    status: false,
    csv: '',
    message: '',
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
      let profile = await Account.get({ id: this.props.match.params.id })
      let collection = await Collection.getCollectionsUser({ id: this.props.match.params.id })
      this.setState({
        collection: collection.data,
        account: profile.data,
        status: verify.status,
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

  handleDelete = async e => {
    try {
      let res = await Collection.delete({ id: e.id })
      if (res.execute) {
        this.setState({
          collection: update(this.state.collection, {
            $splice: [[this.state.collection.indexOf(e), 1]],
          }),
        })
      } else {
        this.props.history.push('/')
      }
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
  }

  handleExport = async id => {
    try {
      let items = await Item.getUserItems({ id: id })
      const fields = ['id', 'name', 'createdAt', 'data']
      const opts = { fields }
      const parser = new Parser(opts)
      const csv = parser.parse(items.data)
      const element = document.createElement('a')
      const file = new Blob([csv], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = 'File.csv'
      document.body.appendChild(element)
      element.click()
    } catch (err) {
      console.log(err)
      this.setState({ message: 'Somethig wrong, try later.' })
    }
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
      },
      {
        dataField: 'theme',
        text: t('Theme'),
        sort: true,
        formatter: (cell, row, rowIndex, extraData) => {
          if (cell)
            return <p>{t(cell)}</p>
        },
      },
      {
        dataField: 'link_image',
        text: t('Image'),
        formatter: (cell, row, rowIndex, extraData) => {
          if (cell)
            return <img src={cell} alt={rowIndex} style={{ width: '50px', height: '50px' }} />
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
                      this.props.history.push('/collection-' + row.id + '/edit')
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
                  <Dropdown.Item
                    className="ml-3"
                    onClick={item => {
                      this.handleExport(row.id)
                    }}
                  >
                    <i className="export-toggle"></i>
                    {t('Export')} CSV
                  </Dropdown.Item>
                </>
              )}
              <Dropdown.Item
                className="ml-3"
                onClick={item => {
                  this.props.history.push('/collection-' + row.id)
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
        data={this.state.collection}
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
    if (this.state.message) {
      return (
        <Row className="justify-content-center align-items-center mt-5">
          <Col xs={10}>
            <Alert variant="danger" className="text-center">
              {this.state.message}
            </Alert>
          </Col>
        </Row>
      )
    }
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
      <div className="profile">
        <Row className="justify-content-center">
          <Col xs={10} className="mt-3">
            <div className="h1">{t('Profile')}:</div>
          </Col>
          <Col xs={10} className="mt-3 box shadow">
            <p className="font-weight-bold mt-3 ml-3">
              {t('Login')}: {this.state.account.login}
            </p>
            <p className="font-weight-bold ml-3">
              {t('Full Name')}: {this.state.account.fullname}
            </p>
            <p className="font-weight-bold ml-3">
              {t('E-mail')}: {this.state.account.mail}
            </p>
            <p className="font-weight-bold ml-3">
              {t('Status')}: {this.state.account.status ? t('Active') : t('Blocked')}
            </p>
            <p className="font-weight-bold ml-3 mb-3">
              {t('Admin')}: {this.state.account.admin ? t('Yes') : t('No')}
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={10} className="mt-3">
            <p className="h1">{t('Collections')}:</p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={10}>{this.state.collection && <>{this.CreateTable()}</>}</Col>
        </Row>
        {this.state.edit && (
          <Row className="justify-content-center mb-5">
            <Col sm={10}>
              <Button
                onClick={event => {
                  this.props.history.push(
                    '/profile-' + this.props.match.params.id + '/add_collection'
                  )
                }}
                variant="light"
              >
                {t('Create collection')}
              </Button>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default withTranslation()(Profile)
