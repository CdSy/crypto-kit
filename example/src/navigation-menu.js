import React, { Component } from 'react'
import { NavLink, withRouter } from "react-router-dom";
import { Menu, Button } from 'antd';

const SubMenu = Menu.SubMenu;

class NavigationMenu extends Component {
  render () {
    const { location } = this.props;

    return (
      <Menu
        selectedKeys={[location.pathname]}
        mode="inline"
        theme="light"
      >
        <Menu.Item key="/user-notifications">
          <NavLink to="/user-notifications" activeClassName="selected">User notifications</NavLink>
        </Menu.Item>
        <SubMenu key="/terminal" title={<div>Terminal</div>}>
          <Menu.Item key="/terminal/active-orders">
            <NavLink to="/terminal/active-orders" activeClassName="selected">Active orders</NavLink>
          </Menu.Item>
          <Menu.Item key="/terminal/positions">
            <NavLink to="/terminal/positions" activeClassName="selected">Positions</NavLink>
          </Menu.Item>
          <Menu.Item key="/terminal/delayed-orders">
            <NavLink to="/terminal/delayed-orders" activeClassName="selected">Delayed orders</NavLink>
          </Menu.Item>
          <Menu.Item key="/terminal/transactions">
            <NavLink to="/terminal/transactions" activeClassName="selected">Transactions</NavLink>
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default withRouter(NavigationMenu);
