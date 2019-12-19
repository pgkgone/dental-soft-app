
import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon2 from "react-native-vector-icons/FontAwesome";
import SettingsIcon from "react-native-vector-icons/Feather"
import * as Font from "expo-font";
import { Container, Header, Body } from "native-base";
//нужно указывать callback в this.porps.apiCall(date)
export class NavigationHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      currentDate: new Date().toISOString()
    };
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ currentDate: date.toISOString() });
    this.props.apiCall(date.toISOString());
    this.hideDateTimePicker();
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignSelf: "center"
        }}
      >
        <TouchableOpacity style={{alignSelf : "flex-start"}} onPress={() => {this.props.navigateToSettings()}}>
          <SettingsIcon name="settings" color={"white"} size={24} style={{width : 24}}/>
        </TouchableOpacity>
        <View
          style={{ flexDirection: "row", justifyContent: "center", alignSelf : "center", flex : 1, paddingRight : 24 }}
        >
          <TouchableOpacity style={{flexDirection : "row"}} onPress={() => {this.showDateTimePicker();}}> 
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            initialValue={new Date('1995-12-17T03:24:00')}
          />
          <View>
            <Text style={{ color: "white", fontSize: 20 }}>
              {this.state.currentDate.slice(0, 10).replace(/-/g, ".") + "  "}
            </Text>
          </View>
          <View>
            <Icon2 name="calendar" size={24} color={"white"} />
          </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}