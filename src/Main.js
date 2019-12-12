import React, { Component } from "react";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
  Content
} from "native-base";
import { Alert, StyleSheet, FlatList } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import Constants from 'expo-constants';
import flatListData from '../data/flatListData'

export class Main extends React.Component {
  state = {
    data: null,
    loading: true,
    currentDate: this.getDate()
  };

  getDate(){
    var today = new Date(); 
    var dd = today.getDate(); 
    var mm = today.getMonth() + 1; 
    var yyyy = today.getFullYear(); 
    if (dd < 10) { 
        dd = '0' + dd; 
    } 
    if (mm < 10) { 
        mm = '0' + mm; 
    } 
    return dd + '.' + mm + '.' + yyyy; 
  }

  // only for DEMO CLINIC
  async login(login, pass) {
    var url =
      "https://online.dental-soft.ru/docs_test.php?ID=demo&doc_name_demo=" +
      login +
      "&doc_pass_demo=" +
      pass;
    let data = await fetch(url, {
      method: "POST"
    }).then(response => response.text());

    console.log(data.split(":"));
    if (data.includes("неправильный логин или пароль")) {
      Alert.alert(
        "Ошибка авторизации",
        "Неправильный логин или пароль",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      //filename = (await FileSystem.documentDirectory) + "tempname" + ".txt";
      //FileSystem.writeAsStringAsync(filename , data)
      ///var rez = await FileSystem.readAsStringAsync(filename);
      //console.log(rez);
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });

    this.login("alex", "123");
    console.log("!!json!!!");
    //var url = "https://webhook.site/fc9d04fe-1695-4cac-9e88-28c77a0d742e";
    var url = "http://vds.dental-soft.ru:2102/?wsdl";
    var __xmlattr = "<tokenId>555</tokenId><docId>1</docId>";
    var args = { tokenId: "555", docId: 1 };

    //soap.createClient(url, function(err, client) {
    //    client.GetDates({_xml: __xmlattr}, function(err, result) {
    //        console.log(result);
    //    })
    //});
  }
  
  render() {
    if (this.state.loading) {
      return <Text>11</Text>;
    } else {
      return (
        <Container>
          <Header style={this.styles.container}>
            <Left style={{flex:1}}>
              <Button transparent>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:1}}>
              <Title>{this.state.currentDate}</Title>
            </Body>
            <Right style={{flex:1}}>
              <Button transparent>
                <Icon name="arrow-forward" />
              </Button>
            </Right>
          </Header>
          <Content>
          </Content>
        </Container>
      );
    }
  }
  
  styles = StyleSheet.create({
    container: {
      marginTop: Constants.statusBarHeight,
    }
  })
}
