import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Text, Left, Body, Right, Button, Icon, Title } from 'native-base';
import * as Font from 'expo-font';
import Expo from "expo";
import { StatusBar } from "react-native";
export class DoctorTableScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading: true };
      }

    async componentWillMount() {
        await Expo.Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });
        this.setState({ loading: false });
      }

    render() {
        if (this.state.loading) {
            
        return (
            
          <Container>
            <Header style={{ backgroundColor: '#a52a2a'}}>
                <Left style={{
      flex:1,

}}>
                    <Button transparent>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body style={{flex:1,justifyContent: 'center', alignItems: 'center'}}>
                    <Title>11.05.2020</Title>
                    
                </Body>
                <Right style={{
      flex:1,

}}>
                    <Button transparent>
                        <Icon name='arrow-forward' />
                    </Button>
                </Right>
            </Header>
            <Content style={{backgroundColor: '#f0fff0', color: '#007bff'}}>
              <List>
                <ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem>
                <ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem><ListItem>
                  <Text style={{color: '#007bff', textDecorationLine:'underline'}}>Simon Mignolet</Text>
                </ListItem>
              </List>
            </Content>
          </Container>
        );}
      }
  }