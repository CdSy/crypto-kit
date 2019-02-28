import React from "react";
import { observer } from "mobx-react";
import { format } from 'date-fns';
import { Menu } from 'antd';
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

function getMessageClassName({ level }) {
  if (level === "Error" || level === "Critical") {
    return "app-error-bg";
  }
  if (level === "Warning") {
    return "app-warning-bg";
  }
  return "";
}

@withNamespaces
@observer
class UserNotificationsList extends React.Component {
  renderItem = (item, index) => {
    const bgClassName = getMessageClassName(item);
    const className = bgClassName === "" ? "app-user-notifications-list__item" : `app-user-notifications-list__item ${bgClassName}`;
    return (
      <Menu.Item key={index}>
        <div className={className}>
          <div className="app-user-notifications-list__item-header">
            {format(new Date(item.createTs), "yyyy-MM-dd HH:mm:ss")}, {item.level}
          </div>
          <div className="app-user-notifications-list__item-message">
            {item.message}
          </div>
        </div>
      </Menu.Item>
    );
  };

  renderContent() {
    const { t } = this.props;
    const store = this.props.userNotificationsStore;

    // if (store.isLoading) {
    //     return <p className="app-user-notifications-list__info">{t('loading')}</p>;
    // }
    if (store.items.length === 0) {
      return <p className="app-user-notifications-list__info">{t('noNotifications')}</p>;
    }

    return store.items.map(this.renderItem);
  }

  render() {
    return (
      <div className="app-user-notifications-list">
        {this.renderContent()}
      </div>
    );
  }
}

export default UserNotificationsList;
