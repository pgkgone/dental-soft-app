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
  Toast
} from "native-base";
import { Alert, StyleSheet, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import fetch from "./Utils/fetchWithTimeout";
import Network from "./Utils/Networking";
import Lock from "./Lock";

export class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    username: "",
    password: "",
    first: false,
    cid: "",
    canAutoAuth: false,
    isLocked: false,
    lockingType: null,
    lockingPass: "9871"
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Авторизация",
      headerStyle: {
        backgroundColor: "#a52b2a"
      },
      headerTintColor: "#fff"
    };
  };

  async login() {
    console.log("Пробую авторизоваться")
    if (
      this.state.username == "" ||
      this.state.password == "" ||
      this.state.cid == ""
    ) {
      Alert.alert(
        "Неверные данные для входа",
        "Пожалуйста, заполните все поля корректно",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return;
    }
    var url =
      "https://online.dental-soft.ru/docs_test.php?ID=" +
      this.state.cid +
      "&doc_name_demo=" +
      this.state.username +
      "&doc_pass_demo=" +
      this.state.password;
    console.log(url);
    let data = await fetch(
      url,
      {
        method: "POST"
      },
      5000
    )
      .then(response => response.text())
      .catch(err => {
        Alert.alert(
          "Ошибка авторизации",
          "Нет соединения с сервером!",
          [{ text: "Попробовать снова", onPress: () => {this.tryAutoAuth()} }],
          { cancelable: false }
        );
      });
    //var u = new User(data)
    //console.log(u.getToken())
    if (
      data.includes("неправильный логин или пароль") ||
      data.includes("не указано имя пользователя") ||
      !data.includes(":") ||
      data.includes("Нет")
    ) {
      var cid = await SecureStore.getItemAsync("cid");
      if (cid == null) {
        this.setState({ first: true });
      } else {
        this.setState({ first: true });
        this.setState({ cid: cid });
      }
      Alert.alert(
        "Ошибка авторизации",
        "Неправильные данные для входа",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      await SecureStore.setItemAsync(
        "loginpass",
        this.state.username + ":" + this.state.password
      );
      await SecureStore.setItemAsync("data", data);
      if (this.state.first) {
        await SecureStore.setItemAsync("cid", this.state.cid);
      }
      console.log("ok auth");
      var d = data.split(":");
      console.log(d);
      if (d[0] == "registry") {
        //GOTO REGISTRY SCREEN
        console.log("Перед нами администратор");
        return this.props.navigation.navigate("AdminTimeTable", {data:{token:d[4],url:d[2], port:d[3]}});
      } else {
        //GOTO DOCTOR SCREEN
        console.log("Перед нами доктор");
        return this.props.navigation.navigate("DoctorTimeTable",  {data:{token:d[4],url:d[2], port:d[3], doctorId:d[1]}});
      }

      //Если вдруг пригодится читать из файла
      //filename = (await FileSystem.documentDirectory) + "tempname" + ".txt";
      //FileSystem.writeAsStringAsync(filename , data)
      ///var rez = await FileSystem.readAsStringAsync(filename);
    }
  }

  //Проверяем существование сохраненного логина и пароля
  async checkSavedLoginPass() {
    var d = await SecureStore.getItemAsync("loginpass");
    if (d != null) {
      if (d.includes(":")) {
        var parsed = d.split(":");
        this.setState({ username: parsed[0], password: parsed[1] });
        console.log("heeeeee")
        this.tryAutoAuth()
        console.log("here")
      }
    }
  }

  //Проверяем на первый запуск, по необходимости запрашиваем у пользователя id клиники
  async isFirstLaunch() {
    var cid = await SecureStore.getItemAsync("cid"); //clinic id
    //Если первый запуск, то он равен null
    if (cid == null) {
      this.setState({ first: true });
    } else {
      this.setState({ cid: cid });
    }
  }
  async tryAutoAuth() {
    console.log("autologin")
    this.login()
  }
  async componentWillUnmount() {
    console.log("unmount");
  }

  async autoAuthAfterLock(){
    console.log("вызван")
    await this.isFirstLaunch();
    await this.checkSavedLoginPass();
  }
  async checkForLock() {
    var d = await SecureStore.getItemAsync("locking");
    if (d == "1") {
      var type = await SecureStore.getItemAsync("blocktype");
      console.log(type);
      if (type == "password") {
        var pass = await SecureStore.getItemAsync("lockpass");
        console.log(pass);
        this.setState({
          lockingType: "password",
          lockingPass: pass,
          isLocked: true
        });
      } else {
        this.setState({ lockingType: "touchid", isLocked: true });
      }
      return true;
    }
  }
  async componentDidMount() {
    console.log("запуск логина");
    await Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    if (!(await this.checkForLock())) {
      await this.isFirstLaunch();
      await this.checkSavedLoginPass();
      //this.tryAutoAuth();
    }

    this.setState({ loading: false });
  }
  async standart(){
    await this.isFirstLaunch();
    this.setState({username:"", password:"", isLocked:false})
  }
  render() {
    if (this.state.loading) {
      return <View></View>;
    } else {
      if (this.state.isLocked) {
        return (
          <Lock
            type={this.state.lockingType}
            passCode={this.state.lockingPass}
            func={() => this.autoAuthAfterLock()}
            standart={()=>this.standart()}
          ></Lock>
        );
      } else
        return (
          <Container>
            <Content style={this.styles.content} padder>
              <Form>
                <Item floatingLabel>
                  <Label>Имя пользователя</Label>
                  <Input
                    onChangeText={v => this.setState({ username: v })} //(v)=>this.setState({"username":v}
                    value={this.state.username}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Пароль</Label>
                  <Input
                    value={this.state.password}
                    secureTextEntry
                    onChangeText={v => this.setState({ password: v })}
                  />
                </Item>
                {this.state.first ? (
                  <Item floatingLabel>
                    <Label>ID клиники</Label>
                    <Input
                      value={this.state.cid}
                      onChangeText={v => this.setState({ cid: v })}
                    />
                  </Item>
                ) : (
                  <View></View>
                )}
                <Button
                  transparent
                  last
                  style={this.styles.loginBtn}
                  onPress={() => this.login()}
                >
                  <Text style={this.styles.loginText}>Вход</Text>
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
      backgroundColor: "#F1FFF0",
      marginTop: 5
    },
    loginBtn: {
      marginTop: 12,
      alignSelf: "center"
    },
    loginText: {
      fontSize: 19
    }
  });
}
module.exports = Login;
