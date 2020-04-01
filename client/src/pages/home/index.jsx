import React, { Component } from 'react'
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap'
import Slider from 'react-slick'
import { TagCloud } from 'react-tagcloud'
import { CollectionMostItem, LastAddedItem, GetAllTag } from '../../ajax/actions'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './style.scss'

export default class Home extends Component {
  state = {
    item: '',
    collection: '',
    tag: [],
  }

  componentDidMount() {
    LastAddedItem().then(item => {
      CollectionMostItem().then(collection => {
        GetAllTag().then(tag => {
          this.setState({
            collection: collection.data,
            item: item.data,
            tag: tag.data.map(e => {
              return { value: e.name, count: e.id }
            }),
          })
        })
      })
    })
  }

  CollectionMost = () => {
    const settings = {
      className: 'center',
      centerMode: true,
      infinite: true,
      slidesToShow: 1,
      speed: 500,
    }
    return (
      <Slider {...settings}>
        {Object.values(this.state.collection).map(e => {
          return (
            <Card key={e[0].id} bg="light" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Text>Collection: {e[0].name}</Card.Text>
                <Button
                  variant="outline-primary"
                  onClick={event => {
                    this.props.history.push('/collection-' + e[0].id)
                  }}
                >
                  Open collection
                </Button>
              </Card.Body>
            </Card>
          )
        })}
      </Slider>
    )
  }

  LastAddedItem = () => {
    const settings = {
      className: 'center',
      centerMode: true,
      infinite: true,
      slidesToShow: 1,
      speed: 500,
    }

    return (
      <Slider {...settings}>
        {Object.values(this.state.item).map(e => {
          return (
            <Card key={e.id} bg="light" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Text>Item: {e.name}</Card.Text>
                <Button
                  variant="outline-primary"
                  onClick={event => {
                    this.props.history.push('/item-' + e.id)
                  }}
                >
                  Open item
                </Button>
              </Card.Body>
            </Card>
          )
        })}
      </Slider>
    )
  }

  render() {
    if (!this.state.item || !this.state.collection) {
      return (
        <Row className="justify-content-center align-items-center mt-5">
          <Col xs={2}>
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      )
    }
    return (
      <Row className="justify-content-center">
        <Col xs={11}>
          Last added item:
          {this.LastAddedItem()}
        </Col>
        <Col xs={11}>
          Collection with more item:
          {this.CollectionMost()}
        </Col>
        <Col md={7}>
          tag cloud:
          <TagCloud
            minSize={12}
            maxSize={35}
            tags={this.state.tag}
            randomNumberGenerator={this.random}
            style={{ textAlign: 'center', background: 'rgb(240,240,240)', borderRadius: '25px' }}
            onClick={tag => {
              this.props.history.push('/find-' + tag.value)
            }}
          />
        </Col>
      </Row>
    )
  }
}
