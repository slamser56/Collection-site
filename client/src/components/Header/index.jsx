import React from 'react'
import { FindBar } from '../../components'

import './header.scss'

const Header = ({ title }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <span className="navbar-brand text-wrap h1">{title}</span>
        <FindBar/>
    </nav>
  )
}

export default Header
