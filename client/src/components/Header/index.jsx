import React from 'react'
import { FindBar } from '../../components'
import { Col, Row } from 'react-bootstrap'
import './header.scss'

const Header = ({ title }) => {
  return (
    <Row className={`justify-content-between bar`}>
      <Col xs={12} sm={7}>
        <div className="text-wrap text-center h1 mt-3 mb-3">{title}</div>
      </Col>
      <Col xs={12} sm={5}>
        <FindBar />
      </Col>
    </Row>
  )
}

export default Header
