import React, { Component } from 'react'
import './main.scss'
import { Route } from 'react-router-dom'
import { Header, SideBar } from '../../components'
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

class Main extends Component {
  render() {
    return (
      <div className="container">
        <Header title="Collections site" />
        <div className="row mt-2">
          <SideBar />
          <div className="col-md-9 order-2 order-md-1">
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
          </div>
        </div>
      </div>
    )
  }
}

export default Main
