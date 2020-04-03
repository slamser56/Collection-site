import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Account } from '../../ajax'
import dateFormat from 'dateformat'

class account_managment extends Component {
  state = {
    verify: 'wait',
    UserMap: '',
  }

  componentDidMount() {
    Account.getAll()
      .then(res => {
        if (res.verify === false || res.admin === false) {
          this.setState({ verify: false })
        } else {
          this.setState({ UserMap: res.UserMap, verify: true })
        }
      })
      .catch(err => {
        this.setState({ verify: false })
      })
  }

  handleDelete = e => {
    let array = this.state.UserMap
    Account.delete({ login: array[e].login })
      .then(res => {
        if (res.verify === false || res.execute === false) {
          this.setState({ verify: false })
        } else {
          delete array[e]
          this.setState({ UserMap: array })
        }
      })
      .catch(err => {
        this.setState({ verify: false })
      })
  }
  handleBlock = e => {
    let array = this.state.UserMap
    Account.block({ login: array[e].login })
      .then(res => {
        if (res.verify === false || res.execute === false) {
          this.setState({ verify: false })
        } else {
          array[e].status = false
          this.setState({ UserMap: array })
        }
      })
      .catch(err => {
        this.setState({ verify: false })
      })
  }
  handleUnblock = e => {
    let array = this.state.UserMap
    Account.unBlock({ login: array[e].login })
      .then(res => {
        if (res.verify === false || res.execute === false) {
          this.setState({ verify: false })
        } else {
          array[e].status = true
          this.setState({ UserMap: array })
        }
      })
      .catch(err => {
        this.setState({ verify: false })
      })
  }
  handleSetAdmin = e => {
    let array = this.state.UserMap
    Account.setAdmin({ login: array[e].login })
      .then(res => {
        if (res.verify === false || res.execute === false) {
          this.setState({ verify: false })
        } else {
          array[e].admin = true
          this.setState({ UserMap: array })
        }
      })
      .catch(err => {
        this.setState({ verify: false })
      })
  }
  handleUnsetAdmin = e => {
    let array = this.state.UserMap
    Account.unSetAdmin({ login: array[e].login })
      .then(res => {
        if (res.verify === false || res.execute === false) {
          this.setState({ verify: false })
        } else {
          array[e].admin = false
          this.setState({ UserMap: array })
        }
      })
      .catch(err => {
        this.setState({ verify: false })
      })
  }

  CreateTable = () => {
    let table = []

    Object.values(this.state.UserMap).map(val => {
      table.push(
        <tr key={val.id} value={val.id}>
          <td className="text-nowrap">{val.id}</td>
          <td className="text-nowrap">{val.login}</td>
          <td className="text-nowrap">{val.fullname}</td>
          <td className="text-nowrap">{val.mail}</td>
          <td className="text-nowrap">{dateFormat(val.createdAt, 'yyyy-mm-dd HH:MM')}</td>
          <td className="text-nowrap">{dateFormat(val.updatedAt, 'yyyy-mm-dd HH:MM')}</td>
          <td className="text-nowrap">{val.status ? 'active' : 'block'}</td>
          <td className="text-nowrap">{val.admin ? 'yes' : '-'}</td>
          <td className="text-nowrap">
            <DropdownButton id="dropdown-basic-button" title="Function">
              <Dropdown.Item
                onClick={item => {
                  this.handleUnblock(val.id)
                }}
              >
                Unblock
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.handleBlock(val.id)
                }}
              >
                Block
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.handleDelete(val.id)
                }}
              >
                Delete
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.handleSetAdmin(val.id)
                }}
              >
                Set admin
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.handleUnsetAdmin(val.id)
                }}
              >
                Unset admin
              </Dropdown.Item>
              <Dropdown.Item
                onClick={item => {
                  this.props.history.push('/profile-' + val.id)
                }}
              >
                Open
              </Dropdown.Item>
            </DropdownButton>
          </td>
        </tr>
      )
      return table
    })
    return table
  }

  render() {
    if (this.state.verify) {
      return (
        <div className="table-responsive">
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th scope="col" className="text-nowrap">
                  Id
                </th>
                <th scope="col" className="text-nowrap">
                  Login
                </th>
                <th scope="col" className="text-nowrap">
                  Fullname
                </th>
                <th scope="col" className="text-nowrap">
                  E-mail
                </th>
                <th scope="col" className="text-nowrap">
                  Create At
                </th>
                <th scope="col" className="text-nowrap">
                  Update At
                </th>
                <th scope="col" className="text-nowrap">
                  Status
                </th>
                <th scope="col" className="text-nowrap">
                  Admin
                </th>
                <th scope="col" className="text-nowrap"></th>
              </tr>
            </thead>
            <tbody>{this.CreateTable()}</tbody>
          </table>
        </div>
      )
    } else if (this.state.verify === 'wait') {
      return <></>
    } else {
      return (
        <>
          <Redirect to="/" />
        </>
      )
    }
  }
}

export default account_managment
