import React, { Component } from 'react'
import { Row, Col, ListGroup } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import {Collection} from '../../ajax'
import './style.scss'

class FindPage extends Component {
  state = {
    result: '',
  }

  componentDidMount() {
    Collection.search({ text: this.props.match.params.text }).then(res => {
      this.setState({ result: res.data.data })
    })
  }

  render() {
    const { t } = this.props
    return (
      <Row className="justify-content-center FindPage mt-3">
        <Col>
          <div className="h1">{t("Founded item")}:</div>
          <ListGroup className="mt-3 shadow">
            {Object.values(this.state.result).map(e => {
              return (
                <ListGroup.Item
                  key={e.id}
                  action
                  onClick={event => {
                    this.props.history.push('/item-' + e.id)
                  }}
                >
                  {e.name}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Col>
      </Row>
    )
  }
}


export default withTranslation()(FindPage)