import React from "react";
import { observer } from "mobx-react";
import { Menu, Dropdown, Badge } from 'antd';
import { NotificationManager } from "react-notifications";
import UserNotificationsIcon from "./user-notifications-icon";
import UserNotificationsList from "./user-notifications-list";
import UserNotificationsStore from "../../stores/user-notifications-store";

@observer
export class UserNotificationsDropdown extends React.Component {
  constructor() {
    super();
    this.store = new UserNotificationsStore();
  }

  componentDidMount() {
    this.store.loadData()
      .catch(() => { NotificationManager.error("Could not load notifications list.") });
    this.store.startAutoUpdate();
  }

  componentWillUnmount() {
    this.store.stopAutoUpdate();
  }

  onVisibleChange = (state) => {
    if (state) {
      this.store.resetCounter();
    }
  }

  getMenuContent() {
    const { t } = this.props;

    return (
      <Menu style={{width: '200px'}}>
        <UserNotificationsList userNotificationsStore={this.store} />
      </Menu>
    );
  }

  render() {
    return (
      <div className="dropdown">
        <Dropdown
          className="app-user-notifications-btn"
          overlay={this.getMenuContent()}
          trigger={['click']}
          onVisibleChange={this.onVisibleChange}
        >
          <div>
            <Badge count={this.store.messagesCount}>
              <UserNotificationsIcon color={this.props.color} style={{width: '23px'}}/>
            </Badge>
          </div>
        </Dropdown>
      </div>
    )
  }
}
