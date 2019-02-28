import { observable, action, computed } from "mobx";
import { getUserLastNotifications } from "../api/notifications-api";

export default class UserNotificationsStore {
  @observable isLoading = false;
  @observable.ref items = [];
  @observable dataLength = 0;
  intervalId = null;

  startAutoUpdate() {
    this.intervalId = setInterval(() => this.loadData(), 2000);
  }

  stopAutoUpdate() {
    if (this.intervalId !== undefined &&
        this.intervalId !== null)
    {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  @action
  loadData() {
    this.isLoading = true;
    return getUserLastNotifications().then(this._setData).catch(this._handleError);
  }

  @computed
  get messagesCount() {
    return this.dataLength;
  }

  @action
  resetCounter() {
    this.dataLength = 0;
  }

  _setData = action(data => {
    this.items = data;
    this.dataLength = data.length;
    this.isLoading = false;
  });

  _handleError = action(err => {
    this.isLoading = false;
    this.items = [];
    throw new Error(err);
  });
}
