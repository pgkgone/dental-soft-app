import React from "react";
import {
  Text,
  ScrollView,
  Switch,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Picker,
  Platform
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import { Container, Header, Content, Form, Right } from "native-base";
import EditIcon from "react-native-vector-icons/Feather";
import * as SecureStore from "expo-secure-store";

export class Settings extends React.Component {
  state = {
    useLockScreen: false,
    lockScreenMethod: "touchid",
    password: "",
    isLoading: true
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
  async componentDidMount() {
    var usedLock = await SecureStore.getItemAsync("locking");
    if (usedLock != null && usedLock == "1") {
      this.setState({ useLockScreen: true });
    }
    var type = await SecureStore.getItemAsync("blocktype");
    if (type != null) {
      if (type != "touchid") {
        this.setState({ lockScreenMethod: "password" });
      }
    }
    this.setState({ isLoading: false });
  }

  callbacker() {
    console.log(this.state.useLockScreen);
    if (!this.state.useLockScreen) {
      SecureStore.deleteItemAsync("locking");
      SecureStore.deleteItemAsync("blocktype");
      SecureStore.deleteItemAsync("lockpass");
    } else {
      console.log("Setting touch id");
      if (this.state.lockScreenMethod == "touchid") {
        SecureStore.setItemAsync("blocktype", "touchid");
        SecureStore.setItemAsync("locking", "1");
      }
    }
  }
  switched() {
    console.log("switched");
    console.log(this.state.useLockScreen);
    this.setState({ useLockScreen: !this.state.useLockScreen }, () => {
      this.callbacker();
    });
  }
  async onLogOut() {
    await SecureStore.deleteItemAsync("loginpass");
    await SecureStore.deleteItemAsync("cid");
    await SecureStore.deleteItemAsync("locking");
    await SecureStore.deleteItemAsync("blocktype");
    await SecureStore.deleteItemAsync("lockpass");
    return this.props.navigation.navigate("Login", { extra: "LOGOUT" });
  }

  changedMethod(data) {
    console.log("changed method");
    if (data == "touchid") {
      SecureStore.setItemAsync("blocktype", "touchid");
      SecureStore.setItemAsync("locking", "1");
    } else
      Alert.alert(
        "Информация!",
        "Введите пароль в поле ниже выбора метода",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );

    console.log("changed and setted");
  }

  render() {
    if (this.state.isLoading) {
      return <View></View>;
    } else var lsm = "Нет";
    if (this.state.LockScreenMethod == "password") {
      lsm = "Пароль";
    }
    if (this.state.LockScreenMethod == "touchid") {
      lsm = "Touch Id";
    }
    var LSM;
    if (Platform.OS === "ios") {
      LSM = (
        <LockScreenMethodIOS
          useLockScreen={this.state.useLockScreen}
          lockScreenMethod={lsm}
          onSwitchCallBack={method => {
            this.setState({ lockScreenMethod: method });
            this.changedMethod(method);
          }}
        />
      );
    } else {
      LSM = (
        <LockScreenMethod
          useLockScreen={this.state.useLockScreen}
          lockScreenMethod={this.state.LockScreenMethod}
          onSwitchCallBack={method => {
            this.setState({ lockScreenMethod: method });
            this.changedMethod(method);
          }}
        />
      );
    }
    return (
      <ScrollView
        style={{
          flexDirection: "column",
          backgroundColor: "#f1fff0",
          flex: 1
        }}
      >
        <Divider text={"Настройки приложения"} />
        <EditClinicId id={""} />
        <Divider text={"Настройки конфиденциальности"} />
        <LockScreenStateSwitcher
          useLockScreen={this.state.useLockScreen}
          onSwitchCallBack={() => {
            this.setState({ useLockScreen: !this.state.useLockScreen });
            this.switched();
          }}
        />
        {LSM}
        <SetPassword
          useLockScreen={this.state.useLockScreen}
          lockScreenMethod={this.state.lockScreenMethod}
          password={this.state.password}
          onSwitchCallBack={pass => this.setState({ password: pass })}
          activated={false}
        />
        <Divider text={"Настройки пользователя"} />
        <LogOut onLogOut={() => this.onLogOut()} />
      </ScrollView>
    );
  }
}

class LogOut extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: 20,
          paddingBottom: 30
        }}
      >
        <TouchableOpacity onPress={() => this.props.onLogOut()}>
          <Text style={{ color: "#a52a2a", fontSize: 30 }}>
            Выйти из аккаунта
          </Text>
        </TouchableOpacity>
      </View>
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
        <Text
          style={{
            color: "grey",
            fontSize: 20,
            borderBottomWidth: 0.5,
            textAlign: "left"
          }}
        >
          {this.props.text}
        </Text>
      </View>
    );
  }
}
class EditClinicId extends React.Component {
  state = {
    showIcon: true
  };
  onFocusProcessor() {
    this.setState({ showIcon: false });
  }

  onEndEditingProcessor() {
    this.setState({ showIcon: true });
    if (!isNaN(this.state.id)) {
      SecureStore.setItemAsync("timeout", this.state.id);
    } else {
      Alert.alert(
        "Ошибка",
        "Интервал запроса может быть только числом",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      this.setState({ id: "" });
    }
  }

  async componentDidMount() {
    var timeout = await SecureStore.getItemAsync("timeout");
    if (timeout != null) {
      this.setState({ id: timeout });
    } else {
      this.setState({ id: 50 });
    }
  }

  render() {
    if (this.state.showIcon === true) {
      return (
        <View style={{ padding: 20, flexDirection: "row" }}>
          <View style={{ flex: 1.5 }}>
            <Text style={{ fontSize: 20 }}>Интервал запросов:</Text>
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
                keyboardType={"numeric"}
                value={this.state.id}
                style={{ fontSize: 20 }}
                onChangeText={data => this.setState({ id: data })}
                onFocus={() => this.onFocusProcessor()}
                onEndEditing={() => this.onEndEditingProcessor()}
              />
            </View>
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <EditIcon name="edit-2" size={20} color={"grey"} />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ padding: 20, flexDirection: "row" }}>
          <View style={{ flex: 1.5 }}>
            <Text style={{ fontSize: 20 }}>Интервал запросов</Text>
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
                keyboardType={"numeric"}
                value={this.state.id}
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
              Аутентификация при входе в приложение
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
              minWidth: 100,
              maxWidth: 130,
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <Picker
              mode="dropdown"
              enabled={false}
              style={{ width: 120, color: "gray" }}
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
              minWidth: 100,
              maxWidth: 130,
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <Picker
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
class LockScreenMethodIOS extends React.Component {
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
              minWidth: 100,
              maxWidth: 130,
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <ModalSelector
              data={[
                { key: 1, label: "Пароль", value: "password" },
                { key: 2, label: "Touch Id", value: "touchid" }
              ]}
              selectStyle={{ borderWidth: 0 }}
              disabled={true}
              initValue={this.props.lockScreenMethod}
              style={{ borderWidth: 0, color: "black", borderColor: "black" }}
              onChange={option => {
                this.props.onSwitchCallBack(option.value);
              }}
            />
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
              minWidth: 100,
              maxWidth: 130,
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <ModalSelector
              data={[
                { key: 1, label: "Пароль", value: "password" },
                { key: 2, label: "Touch Id", value: "touchid" }
              ]}
              initValueTextStyle={{ color: "black", borderWidth: 0 }}
              selectStyle={{ borderWidth: 0 }}
              initValue={this.props.lockScreenMethod}
              onChange={option => {
                this.props.onSwitchCallBack(option.value);
              }}
            />
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
    val = val.replace(/[^0-9]/g, "");
    if (val.length !== 4) {
      this.setState({ placeholder: val });
    } else {
      SecureStore.setItemAsync("lockpass", val);
      SecureStore.setItemAsync("locking", "1");
      SecureStore.setItemAsync("blocktype", "password");
      console.log("setted lockpass:" + val);
      this.setState({
        password: val,
        placeholder: "0000",
        activated: false,
        edited: false
      });
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
