import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Account } from '../../ajax'
import dateFormat from 'dateformat'
import { withTranslation } from 'react-i18next'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import update from 'immutability-helper'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import './style.scss'

class account_managment extends Component {
  state = {
    status: 'wait',
    UserMap: '',
  }

  componentDidMount() {
    Account.getAll()
      .then(res => {
        if (res.status === false || res.admin === false) {
          this.setState({ status: false })
        } else {
          this.setState({ UserMap: res.UserMap, status: true })
        }
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }

  handleDelete = e => {
    Account.delete({ id: e.id })
      .then(res => {
        if (res.status === false || res.execute === false) {
          this.setState({ status: false })
        } else {
          this.setState({
            UserMap: update(this.state.UserMap, {
              $splice: [[this.state.UserMap.indexOf(e), 1]],
            }),
          })
        }
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }
  handleBlock = e => {
    Account.block({ id: e.id })
      .then(res => {
        if (res.status === false || res.execute === false) {
          this.setState({ status: false })
        } else {
          this.setState({
            UserMap: update(this.state.UserMap, {
              [this.state.UserMap.indexOf(e)]: { status: { $set: false } },
            }),
          })
        }
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }
  handleUnblock = e => {
    Account.unBlock({ id: e.id })
      .then(res => {
        if (res.status === false || res.execute === false) {
          this.setState({ status: false })
        } else {
          this.setState({
            UserMap: update(this.state.UserMap, {
              [this.state.UserMap.indexOf(e)]: { status: { $set: true } },
            }),
          })
        }
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }
  handleSetAdmin = e => {
    Account.setAdmin({ id: e.id })
      .then(res => {
        if (res.status === false || res.execute === false) {
          this.setState({ status: false })
        } else {
          this.setState({
            UserMap: update(this.state.UserMap, {
              [this.state.UserMap.indexOf(e)]: { admin: { $set: true } },
            }),
          })
        }
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }
  handleUnsetAdmin = e => {
    Account.unSetAdmin({ id: e.id })
      .then(res => {
        if (res.status === false || res.execute === false) {
          this.setState({ status: false })
        } else {
          this.setState({
            UserMap: update(this.state.UserMap, {
              [this.state.UserMap.indexOf(e)]: { admin: { $set: false } },
            }),
          })
        }
      })
      .catch(err => {
        this.setState({ status: false })
      })
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
        dataField: 'login',
        text: t('Login'),
        sort: true,
        filter: textFilter({
          placeholder: t('Enter') + '...',
        }),
      },
      {
        dataField: 'fullname',
        text: t('Full name'),
        sort: true,
        filter: textFilter({
          placeholder: t('Enter') + '...',
        }),
      },
      {
        dataField: 'mail',
        text: 'E-Mail',
        sort: true,
        filter: textFilter({
          placeholder: t('Enter') + '...',
        }),
      },
      {
        dataField: 'createdAt',
        text: t("CreatedAt"),
        sort: true,
        filter: textFilter({
          placeholder: t('Enter') + '...',
        }),
        formatter: (cell, row, rowIndex, extraData) => {
          return <p className="text-nowrap">{dateFormat(cell, 'yyyy-mm-dd HH:MM')}</p>
        },
      },
      {
        dataField: 'updatedAt',
        text: t("updatedAt"),
        sort: true,
        filter: textFilter({
          placeholder: t('Enter') + '...',
        }),
        formatter: (cell, row, rowIndex, extraData) => {
          return <p className="text-nowrap">{dateFormat(cell, 'yyyy-mm-dd HH:MM')}</p>
        },
      },
      {
        dataField: 'status',
        text: t('Status'),
        sort: true,
      },
      {
        dataField: 'admin',
        text: t('Admin'),
        sort: true,
      },
      {
        dataField: 'button',
        text: t('Function'),
        formatter: (cell, row, rowIndex, extraData) => {
          return (
            <DropdownButton variant="light" id="dropdown-basic-button" title={t("Function")}>
              <Dropdown.Item
                onClick={item => {
                  this.handleUnblock(row)
                }}
              >
                {t("Unblock")}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.handleBlock(row)
                }}
              >
                {t("Block")}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.handleDelete(row)
                }}
              >
                {t("Delete")}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.handleSetAdmin(row)
                }}
              >
                {t("Set admin")}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.handleUnsetAdmin(row)
                }}
              >
                {t("Unset admin")}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.props.history.push('/profile-' + row.id)
                }}
              >
                {t("Open")}
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
        data={this.state.UserMap}
        columns={columns}
        striped
        filter={filterFactory()}
        wrapperClasses="table-responsive table-sm shadow"
        pagination={paginationFactory()}
      />
    )
  }

  render() {
    if (this.state.status === 'wait') {
      return <></>
    } else if (this.state.status) {
      return <div className="account">{this.CreateTable()}</div>
    } else {
      return (
        <>
          <Redirect to="/" />
        </>
      )
    }
  }
}

export default withTranslation()(account_managment)
