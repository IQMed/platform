import React, {Component} from 'react';
import {Grid, Header, Segment, Form, Button} from 'semantic-ui-react';

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
    const {privacy} = this.state;
    return (
      <Grid columns={16} container>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as='h5' attached='top' block>My Projects</Header>
            <Segment attached>test</Segment>
            <Segment attached>test</Segment>
            <Segment attached='bottom'>test</Segment>
          </Grid.Column>        
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as='h5' attached='top' block>Add a new one</Header>
            <Segment attached='bottom'>
              <Form>
                <Form.Input label='Project Name' name='projectName' placeholder='Untitle' />
                <Form.Field>
                  <label>Privacy:</label>
                  <Form.Group inline>
                    <Form.Radio label='public' name='privacy' value='public' checked={privacy=='public'} onChange={this.handlePrivacyRadio} /> 
                    <Form.Radio label='private' name='privacy' value='private' checked={privacy=='private'} onChange={this.handlePrivacyRadio} /> 
                  </Form.Group>
                </Form.Field>
                <Form.TextArea label='Details' name='details' placeholder='[Optional]' rows='3' />
                <Button>Add</Button>
              </Form>
            </Segment>
          </Grid.Column>        
        </Grid.Row>
      </Grid>
    );
  }
}