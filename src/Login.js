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
  Content,
  Form,
  Item,
  Input,
  Label,
} from "native-base";
import { Alert, StyleSheet, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
export class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    username: "reg",
    password: "111"
  };

  async componentDidMount() {
    await Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <View></View>;
    } else {
      return (
        <Container>
          <Header style={this.styles.header}>
            <Left style={{ flex: 1 }}></Left>
            <Body style={{ flex: 1 }}>
              <Title style={this.styles.title}>Авторизация</Title>
            </Body>
            <Right style={{ flex: 1 }}></Right>
          </Header>
          <Content style={this.styles.content}>
            <Form>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input
                  onChangeText={v => this.setState({ username: v })} //(v)=>this.setState({"username":v}
                  value={this.state.username}
                />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input value={this.state.password} secureTextEntry
                 onChangeText={v => this.setState({ password: v })} />
              </Item>
              <Button
                transparent
                last
                style={this.styles.loginBtn}
                onPress={async () => {
                  var url =
                    "https://online.dental-soft.ru/docs_test.php?ID=demo&doc_name_demo=" +
                    this.state.username +
                    "&doc_pass_demo=" +
                    this.state.password;
                  let data = await fetch(url, {
                    method: "POST"
                  }).then(response => response.text())
                  .catch( err => {
                    Alert.alert(
                        "Ошибка авторизации",
                        "Нет соединения с сервером!",
                        [
                          { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                      );
                  });

                  console.log(data.split(":"));
                  if (data.includes("неправильный логин или пароль")) {
                    Alert.alert(
                      "Ошибка авторизации",
                      "Неправильный логин или пароль",
                      [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                      ],
                      { cancelable: false }
                    );
                  } else {
                    await SecureStore.setItemAsync("data", data)
                    console.log(await SecureStore.getItemAsync("data"))
                    //filename = (await FileSystem.documentDirectory) + "tempname" + ".txt";
                    //FileSystem.writeAsStringAsync(filename , data)
                    ///var rez = await FileSystem.readAsStringAsync(filename);
                    //console.log(rez);
                  }
                }}
              >
                <Text style={this.styles.loginText}>LOGIN</Text>
              </Button>
            </Form>
          </Content>
        </Container>
      );
    }
  }

  styles = StyleSheet.create({
    header: {
      marginTop: Constants.statusBarHeight,
      backgroundColor: "#A52B2A"
    },
    title: {
      color: "#ffffff"
    },
    content: {
      backgroundColor: "#F1FFF0"
    },
    loginBtn: {
      marginTop: 12,
      alignSelf: "center"
    },
    loginText: {
      fontSize: 15
    }
  });
}
module.exports = Login;
