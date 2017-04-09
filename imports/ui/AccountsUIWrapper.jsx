import React, { PureComponent } from 'react';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class AccountsUIWrapper extends PureComponent {
  componentDidMount() {
    this.view = Blaze.render(Template.loginButtons, this.container);
  }

  componentWillUnmount() {
    Blaze.remove(this.view);
  }

  render() {
    return <div id="login" ref={(div) => { this.container = div; }} />;
  }
}
