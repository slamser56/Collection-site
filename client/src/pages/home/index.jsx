import React, { Component } from 'react'
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap'
import Slider from 'react-slick'
import { TagCloud } from 'react-tagcloud'
import { withTranslation } from 'react-i18next'
import {Collection, Item, Tag} from '../../ajax'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './style.scss'

const options = {
  luminosity: 'white',
  hue: 'purple',
}

class Home extends Component {
  state = {
    item: '',
    collection: '',
    tag: [],
  }

  componentDidMount() {
    Item.lastAddedItems().then(item => {
      Collection.collectionMostItems().then(collection => {
        Tag.getAllTags().then(tag => {
          this.setState({
            collection: collection.data,
            item: item.data,
            tag: tag.data.map(e => {
              return { value: e.name, count: e.id }
            }),
          })
        }).catch(err =>{
          console.log(err)
        })
      }).catch(err =>{
        console.log(err)
      })
    }).catch(err =>{
      console.log(err)
    })
  }

  CollectionMost = () => {
    const settings = {
      infinite: true,
      slidesToShow: 1,
      speed: 500,
    }
    const { t } = this.props
    return (
      <Slider className="shadow" {...settings}>
        {Object.values(this.state.collection).map(e => {
          return (
            <Card key={e[0].id} style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Text className="text-center">{t("Collection")}: {e[0].name}</Card.Text>
                <Button 
                  variant="outline-primary"
                  onClick={event => {
                    this.props.history.push('/collection-' + e[0].id)
                  }}
                >
                  {t("Open collection")}
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
      infinite: true,
      slidesToShow: 1,
      speed: 500,
    }
    const { t } = this.props
    return (
      <Slider className="shadow" {...settings}>
        {Object.values(this.state.item).map(e => {
          return (
            <Card key={e.id} style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Text className="text-center">{t("Item")}: {e.name}</Card.Text>
                <Button
                  variant="light"
                  onClick={event => {
                    this.props.history.push('/item-' + e.id)
                  }}
                >
                  {t("Open item")}
                </Button>
              </Card.Body>
            </Card>
          )
        })}
      </Slider>
    )
  }

  render() {
    const { t } = this.props
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
      <Row className="justify-content-center home mt-3">
        <Col xs={9}>
          <p>{t("Last added item")}:</p>
          {this.LastAddedItem()}
        </Col>
        <Col xs={9} className="mt-3">
        <p>{t("Collection with most item")}:</p>
          {this.CollectionMost()}
        </Col>
        <Col xs={9} className="mt-3 mb-3">
        <p>{t("tag cloud")}:</p>
          <TagCloud
            minSize={12}
            maxSize={35}
            tags={this.state.tag}
            colorOptions={options}
            randomNumberGenerator={this.random}
            style={{ textAlign: 'center' }}
            onClick={tag => {
              this.props.history.push('/find-' + tag.value)
            }}
          />
        </Col>
      </Row>
    )
  }
}

export default withTranslation()(Home)
