import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { SignInForm } from '../../components'

class SideBar extends Component {
  state = {
    id: '',
    admin: '',
  }

  updateData = value => {
    this.setState({ id: value.id, admin: value.admin })
  }

  render() {
    return (
      <div className="col-12 col-md-3 order-1 order-md-2 justify-content-center">
        <div className="col border">
          <SignInForm updateData={this.updateData} />
          <ul className="nav flex-column mt-2">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Main
              </Link>
            </li>
            {this.state.admin && (
              <li className="nav-item">
                <Link to="/account_managment" className="nav-link">
                  Account Managment
                </Link>
              </li>
            )}
            {this.state.id ? (
              <li className="nav-item">
                <Link className="nav-link" to={'/profile-' + this.state.id}>
                  My profile
                </Link>
              </li>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    )
  }
}

export default SideBar
