import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Signup } from '../../components'
import { Account } from '../../ajax'

class Registration extends Component {
  state = {
    status: false,
  }

  componentDidMount() {
    Account.verify()
      .then(res => {
        this.setState({ status: res.status })
      })
      .catch(err => {
        this.setState({ status: false })
      })
  }

  render() {
    if (this.state.status) {
      return <Redirect to="/" />
    } else {
      return (
        <div className="container">
          <Signup />
        </div>
      )
    }
  }
}

export default Registration
