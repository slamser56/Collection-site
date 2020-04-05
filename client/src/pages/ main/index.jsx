import React, { Component } from 'react'
import './main.scss'
import { Route } from 'react-router-dom'
import { Header, SideBar } from '../../components'
import { withTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import {
  AccountManage,
  Profile,
  AddCollection,
  EditCollection,
  CollectionPage,
  AddItem,
  EditItem,
  ItemPage,
  Home,
  FindPage
} from '../../pages'
import './main.scss'

class Main extends Component {

  state = {
    theme: 'light'
  }

  componentDidMount() {
    if(localStorage.getItem('theme'))
      this.setState({theme: localStorage.getItem('theme')})
  }

  ChangeTheme = (theme) => {
    this.setState({theme: theme})
    localStorage.setItem('theme', theme)
  }


  render() {
    return (
      <Container fluid className={`container-${this.state.theme}`}>
        <Container className='h-100'>
          <Header title="Collections site" />
          <Row className="mt-2">
            <SideBar ChangeTheme={this.ChangeTheme}/>
            <Col md={9} className="order-2 order-md-1">
              <Route exact path="/" component={Home} />
              <Route exact path="/account_managment" component={AccountManage} />
              <Route exact path="/profile-:id" component={Profile} />
              <Route exact path="/collection-:collection" component={CollectionPage} />
              <Route exact path="/collection-:collection/edit" component={EditCollection} />
              <Route exact path="/collection-:collection/add_item" component={AddItem} />
              <Route exact path="/item-:item" component={ItemPage} />
              <Route exact path="/item-:item/edit" component={EditItem} />
              <Route exact path="/profile-:id/add_collection" component={AddCollection} />
              <Route exact path="/find-:text" component={FindPage} />
            </Col>
            </Row>
          </Container>
      </Container>
    )
  }
}

export default withTranslation()(Main)

