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
  TextInput
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
    passCode: ""
  };

  onChangePassCode(v) {
    if (this.state.isOldDevice) {
      //DEMO CODE 1111
      this.setState({ passCode: v });
      if (v.length == 4) {
        if (v == "1111") {
          this.state.authenticated = true;
          console.log("готов к переходу");
        } else {
          Alert.alert(
            "Ошибка авторизации",
            "Неправильный логин или пароль",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
          this.setState({ passCode: "" });
        }
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
          passCode: "1111" // рили код ставим
        });
      } else {
        this.setState({
          failedCount: this.state.failedCount + 1
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  async componentDidMount() {
    await Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    

    this.clearState(); //working
    if (await LocalAuthentication.hasHardwareAsync()) {
      this.setState({ isOldDevice: false });
      if (Platform.OS === "android") {
        this.setModalVisible(!this.state.modalVisible);
      } else {
        this.scanFingerPrint();
      }
    }
    console.log(this.state.isOldDevice);
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <View></View>;
    } else {
      return (
        <Container>
          <Header style={styles.container}>
            <Body style={{ flex: 1 }}>
              <Title>Auth</Title>
            </Body>
            <Right style={{ flex: 1 }}></Right>
          </Header>
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
              <View style={styles.passcodeEnter}>
                <TextInput
                  secureTextEntry={true}
                  style={styles.textBox}
                  keyboardType="numeric"
                  maxLength={4}
                  autoFocus={true}
                  value={this.state.passCode}
                  secureTextEntry
                  onChangeText={v => {
                    this.onChangePassCode(v);
                  }}
                />
              </View>
              <View style={styles.circleBlock}>
                <View
                  style={[
                    styles.circle,
                    this.state.passCode.length >= 1 && styles.circleFill
                  ]}
                ></View>
                <View
                  style={[
                    styles.circle,
                    this.state.passCode.length >= 2 && styles.circleFill
                  ]}
                ></View>
                <View
                  style={[
                    styles.circle,
                    this.state.passCode.length >= 3 && styles.circleFill
                  ]}
                ></View>
                <View
                  style={[
                    styles.circle,
                    this.state.passCode.length >= 4 && styles.circleFill
                  ]}
                ></View>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onShow={this.scanFingerPrint}
            >
              <View style={styles.modal}>
                <View style={styles.innerContainer}>
                  <Text>Sign in with fingerprint</Text>
                  <Image
                    style={{ width: 128, height: 128 }}
                    source={require("../assets/fingerprint.png")}
                  />
                  {this.state.failedCount > 0 && (
                    <Text style={{ color: "red", fontSize: 14 }}>
                      Failed to authenticate, press cancel and try again.
                    </Text>
                  )}
                  <TouchableHighlight
                    onPress={async () => {
                      LocalAuthentication.cancelAuthenticate();
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        fontSize: 16,
                        paddingBottom: 14
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </Content>
        </Container>
      );
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
  }
});
module.exports = Lock;
