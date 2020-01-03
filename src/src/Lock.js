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
  View
} from "native-base";
import {
  Alert,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Image,
  Platform,
  TextInput,
  TouchableOpacity
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";

export class Lock extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    authenticated: false,
    modalVisible: false,
    failedCount: 0,
    isOldDevice: true,
    passCode: "",
    type: this.props.type,
    truePass: this.props.passCode,
    func: this.props.func,
    text:"Войдите с помощью отпечатка пальца прикоснувшись к сканнеру"
  };

  inputProcessor(v) {
    this.setState({ passCode: v });
    if (v.length == 4) {
      if (v == this.state.truePass) {
        this.state.authenticated = true;
        this.setState({ passCode: "" });
        console.log("готов к переходу");
        this.state.func();
      } else {
        Alert.alert(
          "Ошибка авторизации",
          "Неправильный код разблокировки",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        this.setState({ passCode: "" });
      }
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  clearState = () => {
    this.setState({ authenticated: false, failedCount: 0 });
  };

  scanFingerPrint = async () => {
    try {
      let results = await LocalAuthentication.authenticateAsync();
      if (results.success) {
        this.setState({
          modalVisible: false,
          authenticated: true,
          failedCount: 0,
          passCode: "1111",
          text:"Успех!"
        });
        this.state.func();
      } else {
        Alert.alert(
          "Ошибка авторизации",
          "Невозможно войти с данным отпечатком пальца",
          [{ text: "OK", onPress: () => this.scanFingerPrint() }],
          { cancelable: false }
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  async componentDidMount() {
    await Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    console.log("Auth type" + this.state.type);
    if (await LocalAuthentication.hasHardwareAsync()) {
      this.setState({ isOldDevice: false });
      console.log("STATE:"+this.state.type)
      if (this.state.type != "password") {
        this.scanFingerPrint();
      }
    }
    console.log(this.state.isOldDevice);
    this.setState({ loading: false });
    console.log(this.state.type);
  }

  render() {
    if (this.state.loading) {
      return <View></View>;
    } else {
      if (this.state.type == "touchid") {
        return (
          <Container>
            <Content style={{ backgroundColor: "#F1FFF0" }}>
              <View style={styles.codeWrapper}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    alignSelf: "center",
                    marginBottom: 17,
                    textAlign:'center'
                  }}
                >
                  {this.state.text}
                </Text>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-start"
                  }}
                >
                  <Image
                    style={{ width: 128, height: 128, alignSelf:'center' }}
                    source={require("../assets/finger.png")}
                  />
                  <View style={{ paddingTop: 10 }}>
                    <TouchableOpacity onPress={() => this.props.standart()}>
                      <Text
                        style={{
                          color: "grey",
                          fontSize: 15,
                          alignSelf: "center",
                          marginTop: 22
                        }}
                      >
                        Войти стандартно
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Content>
          </Container>
        );
      } else {
        return (
          <Container>
            <Content style={{ backgroundColor: "#F1FFF0" }}>
              <View style={styles.codeWrapper}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    alignSelf: "center",
                    marginBottom: 17
                  }}
                >
                  Введите пароль:
                </Text>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-start"
                  }}
                >
                  <View style={{ paddingTop: 10 }}>
                    <TextInput
                      secureTextEntry={true}
                      value={this.state.passCode}
                      maxLength={4}
                      autoFocus={true}
                      keyboardType={"numeric"}
                      onChangeText={val => this.inputProcessor(val)}
                      style={{
                        fontSize: 40,
                        textAlign: "center",
                        backgroundColor: "#f8fcf7"
                      }}
                    />
                    <TouchableOpacity onPress={() => this.props.standart()}>
                      <Text
                        style={{
                          color: "grey",
                          fontSize: 15,
                          alignSelf: "center",
                          marginTop: 22
                        }}
                      >
                        Войти стандартно
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Content>
          </Container>
        );
      }
    }
  }
}
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    marginTop: "90%",
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center"
  },
  innerContainer: {
    marginTop: "30%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    alignSelf: "center",
    fontSize: 40,
    paddingTop: 20
  },
  container: {
    marginTop: Constants.statusBarHeight,
    backgroundColor: "#A52B2A"
  },
  pad: {
    paddingTop: 75,
    margin: 5
  },
  backButton: {
    display: "flex",
    left: 10,
    top: 30,
    position: "absolute",
    zIndex: 9999,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 90,
    paddingTop: 40
  },
  codeWrapper: {
    marginTop: 21,
    position: "relative"
  },
  passcodeEnter: {
    height: "100%",
    opacity: 0,
    position: "absolute",
    width: "100%",
    zIndex: 9
  },
  textBox: {
    fontSize: 60,
    letterSpacing: 15,
    textAlign: "center"
  },
  circleBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  circle: {
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#A52B2A",
    height: 25,
    marginLeft: 23,
    marginRight: 23,
    width: 25
  },
  circleFill: {
    backgroundColor: "#A52B2A",
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#A52B2A",
    height: 25,
    marginLeft: 23,
    marginRight: 23,
    width: 25
  },
  buttonStyle: {
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A52B2A"
  },
  textButtonStyle: {
    fontSize: 22
  }
});
module.exports = Lock;
