import React, {Component} from 'react';

export default class ProjectPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {privacy: 'public'};
    this.handlePrivacyRadio = this.handlePrivacyRadio.bind(this);
  }

  handlePrivacyRadio(event, {value}) {
    this.setState({privacy: value});
  }

  render() {
    return (
      <div>Porject</div>
    );
  }
}