import React from "react";
import {
  Text,
  ScrollView,
  Switch,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Container, Header, Content, Picker, Form, Right } from "native-base";
import EditIcon from "react-native-vector-icons/Feather";
export class Settings extends React.Component {
  state = {
    useLockScreen: false,
    lockScreenMethod: "touchid",
    password: ""
  };
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Настройки",
      headerStyle: {
        backgroundColor: "#a52b2a"
      },
      headerTintColor: "#fff"
    };
  };
  async componentDidMount() {}

  render() {
    return (
      <ScrollView
        style={{ flexDirection: "column", backgroundColor: "#f1fff0", flex: 1 }}
      >
        <Divider text={"Настройки приложения"} />
        <EditClinicId id={"555"} />
        <Divider text={"Настройки конфиденциальности"} />
        <LockScreenStateSwitcher
          useLockScreen={this.state.useLockScreen}
          onSwitchCallBack={() =>
            this.setState({ useLockScreen: !this.state.useLockScreen })
          }
        />
        <LockScreenMethod
          useLockScreen={this.state.useLockScreen}
          lockScreenMethod={this.state.lockScreenMethod}
          onSwitchCallBack={method =>
            this.setState({ lockScreenMethod: method })
          }
        />
        <SetPassword
          useLockScreen={this.state.useLockScreen}
          lockScreenMethod={this.state.lockScreenMethod}
          password={this.state.password}
          onSwitchCallBack={pass => this.setState({ password: pass })}
          activated={false}
        />
      </ScrollView>
    );
  }
}
class Divider extends React.Component {
  render() {
    return (
      <View
        style={{
          paddingLeft: 20,
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 20,
          borderBottomColor: "grey"
        }}
      >
        <Text style={{ color: "grey", fontSize: 20, borderBottomWidth: 0.5 }}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}
class EditClinicId extends React.Component {
  state = {
    id: this.props.id,
    showIcon: true
  };
  onFocusProcessor() {
    this.setState({ showIcon: false });
  }

  onEndEditingProcessor() {
    this.setState({ showIcon: true });
  }

  render() {
    if (this.state.showIcon === true) {
      return (
        <View style={{ padding: 20, flexDirection: "row" }}>
          <View style={{ flex: 1.5 }}>
            <Text style={{ fontSize: 20 }}>ID Клиники:</Text>
          </View>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <TextInput
                value={this.state.id}
                style={{ fontSize: 20 }}
                onChangeText={data => this.setState({ id: data })}
                onFocus={() => this.onFocusProcessor()}
                onEndEditing={() => this.onEndEditingProcessor()}
              />
            </View>
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <EditIcon name="edit-2" size={20} color={"grey"}/>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ padding: 20, flexDirection: "row" }}>
          <View style={{ flex: 1.5 }}>
            <Text style={{ fontSize: 20 }}>ID Клиники:</Text>
          </View>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <TextInput
                value={this.state.id}
                keyboardType={"numeric"}
                style={{ fontSize: 20 }}
                onChangeText={data => this.setState({ id: data })}
                onFocus={() => this.onFocusProcessor()}
                onEndEditing={() => this.onEndEditingProcessor()}
              />
            </View>
            <View
              style={{ flexDirection: "column", justifyContent: "center" }}
            ></View>
          </View>
        </View>
      );
    }
  }
}
class LockScreenStateSwitcher extends React.Component {
  render() {
    return (
      <View style={{ flexDirection: "row", padding: 20 }}>
        <View
          style={{
            flex: 1.5,
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <View>
            <Text style={{ fontSize: 20 }}>Lock Screen</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: "grey" }}>
              Ауификация при повтроном входе в приложение
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.5,
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
        >
          <Switch
            onValueChange={() => this.props.onSwitchCallBack()}
            value={this.props.useLockScreen}
          />
        </View>
      </View>
    );
  }
}
class LockScreenMethod extends React.Component {
  render() {
    if (this.props.useLockScreen == false) {
      return (
        <View style={{ flexDirection: "row", padding: 20 }}>
          <View
            style={{
              flex: 1.5,
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <View>
              <Text style={{ fontSize: 20 }}>Метод авторизации</Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <Picker
              note
              mode="dropdown"
              enabled={false}
              style={{ width: 120 }}
              selectedValue={this.props.lockScreenMethod}
              onValueChange={itemValue =>
                this.props.onSwitchCallBack(itemValue)
              }
            >
              <Picker.Item
                style={{ textAlign: "center" }}
                label="Пароль"
                value="password"
              />
              <Picker.Item
                style={{ textAlign: "center" }}
                label="Touch ID"
                value="touchid"
              />
            </Picker>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row", padding: 20 }}>
          <View
            style={{
              flex: 1.5,
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <View>
              <Text style={{ fontSize: 20 }}>Метод авторизации</Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <Picker
              note
              mode="dropdown"
              textStyle={{ color: "black" }}
              style={{ width: 120, color: "black" }}
              selectedValue={this.props.lockScreenMethod}
              onValueChange={itemValue =>
                this.props.onSwitchCallBack(itemValue)
              }
            >
              <Picker.Item
                style={{ textAlign: "center" }}
                label="Пароль"
                value="password"
              />
              <Picker.Item
                style={{ textAlign: "center" }}
                label="Touch ID"
                value="touchid"
              />
            </Picker>
          </View>
        </View>
      );
    }
  }
}
class SetPassword extends React.Component {
  state = {
    activated: false,
    edited: false,
    password: "", //считывать из глобального стейта
    placeholder: "0000"
  };

  inputProcessor(val) {
    if (val.length !== 4) {
      this.setState({ placeholder: val });
    } else {
      this.setState({
        password: val,
        placeholder: "0000",
        activated: false,
        edited: false
      });
      console.log("пароль установлен!" + val);
    }
  }

  focusProcessor() {
    this.setState({ activated: true, placeholder: "", edited: true });
  }

  onEndEditingProcessor(val) {
    this.setState({ activated: false, placeholder: "0000" });
  }

  render() {
    if (
      this.props.useLockScreen === true &&
      this.props.lockScreenMethod === "password" &&
      this.state.password === ""
    ) {
      return (
        <View
          style={{
            elevation: 1,
            position: "relative",
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 20,
            backgroundColor: "#e2f2e1",
            paddingBottom: 20
          }}
        >
          <View
            style={{ flexDirection: "column", justifyContent: "flex-start" }}
          >
            <View>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                Введите пароль
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: "grey" }}>
                Пароль должен состоять из 4х цифр
              </Text>
            </View>
            <View style={{ paddingTop: 5, paddingBottom: 10 }}>
              <TextInput
                secureTextEntry={true}
                когда
                закончится
                отладка
                снять
                комментирование
                value={this.state.placeholder}
                maxLength={4}
                keyboardType={"numeric"}
                onFocus={() => this.focusProcessor()}
                onChangeText={val => this.inputProcessor(val)}
                onEndEditing={() => this.onEndEditingProcessor()}
                style={{
                  fontSize: 40,
                  textAlign: "center",
                  backgroundColor: "#f8fcf7"
                }}
              />
            </View>
          </View>
        </View>
      );
    } else if (
      this.props.useLockScreen === true &&
      this.props.lockScreenMethod === "password"
    ) {
      return (
        <View
          style={{
            elevation: 1,
            position: "relative",
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 20,
            backgroundColor: "#e2f2e1",
            paddingBottom: 20
          }}
        >
          <View
            style={{ flexDirection: "column", justifyContent: "flex-start" }}
          >
            <View>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                Пароль установлен!
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: "grey" }}>
                для смены пароля введите его еще раз
              </Text>
            </View>
            <View style={{ paddingTop: 5, paddingBottom: 10 }}>
              <TextInput
                secureTextEntry={true}
                когда
                закончится
                отладка
                снять
                комментирование
                value={this.state.placeholder}
                maxLength={4}
                keyboardType={"numeric"}
                onFocus={() => this.focusProcessor()}
                onChangeText={val => this.inputProcessor(val)}
                onEndEditing={() => this.onEndEditingProcessor()}
                style={{
                  fontSize: 40,
                  textAlign: "center",
                  backgroundColor: "#f8fcf7"
                }}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}
