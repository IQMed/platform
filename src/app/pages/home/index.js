import React, {Component} from 'react';
import {Link} from 'react-router';
import {Grid, Header, Segment} from 'semantic-ui-react';

export default class Home extends Component {
  render() {
    return (
      <Grid centered container>
        <Grid.Row>

          <Grid.Column mobile={16} tablet={8} computer={4}>
            <Segment>
              <h5>Dashboard</h5>
              <ul>
                <li><Link to={'/project'}>Projects</Link></li>
                <li><Link to={'/profile'}>Profile</Link></li>
                <li><Link to={'/login'}>Logout</Link></li>
              </ul>
              <h5>1. Setup</h5>
              <ul>
                <li><a href="#">Device</a></li>
                <li><a href="#">Test</a></li>
              </ul>
              <h5>2. Input</h5>
              <ul>
                <li><a href="#">View</a></li>
                <li><a href="#">Import</a></li>
                <li><a href="#">Export</a></li>
                <li><a href="#">Test</a></li>
              </ul>
              <h5>3. Model</h5>
              <ul>
                <li><a href="#">####</a></li>
              </ul>
              <h5>4. Result</h5>
              <ul>
                <li><a href="#">####</a></li>
              </ul>
            </Segment>
          </Grid.Column>
          
          <Grid.Column mobile={16} tablet={8} computer={6}>
            <Header as='h5' attached='top'>My Projects</Header>
            <Segment attached='bottom'>test</Segment>
          </Grid.Column>
          
          <Grid.Column mobile={16} tablet={8} computer={6}>
            <Header as='h5' attached='top'>Public Projects</Header>
            <Segment attached='bottom'>test</Segment>
            <Header as='h5' attached='top'>Blog Updates</Header>
            <Segment attached='bottom'>test</Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
} 