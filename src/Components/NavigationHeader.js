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
import SettingsIcon from "react-native-vector-icons/Feather";
import ArrowIcons from "react-native-vector-icons/AntDesign";
import * as Font from "expo-font";
import { Container, Header, Body } from "native-base";
import moment from "moment";
import momentRU from 'moment/locale/ru' 
//нужно указывать callback в this.porps.apiCall(date)
export class NavigationHeader extends React.Component {
  weekday = new Array(7);
  constructor(props) {
    super(props);
    moment.updateLocale('ru',momentRU );   
    this.weekday[0] = "(Вс)";
    this.weekday[1] = "(Пн)";
    this.weekday[2] = "(Вт)";
    this.weekday[3] = "(Ср)";
    this.weekday[4] = "(Чт)";
    this.weekday[5] = "(Пт)";
    this.weekday[6] = "(Сб)";
    this.state = {
      isDateTimePickerVisible: false,
      currentDate: new Date(this.props.date).toISOString(),
      refreshVar: false
    };
    console.log(this.props.date + "initial date");
    console.log(this.props.date.substr(0,this.props.date.indexOf("T")))
    console.log(moment(this.props.date.substr(0,this.props.date.indexOf("T"))).format('DD.MM dd  ',).toUpperCase())
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ refreshVar: !this.state.refreshVar });
    console.log("NEEEEEEEEEEEEEEEEEW DATE" + date.toISOString());
    this.setState({ currentDate: new Date(date).toISOString() });
    this.props.apiCall(new Date(date).toISOString());
    this.hideDateTimePicker();
  };

  nextDate() {
    if (
      this.props.hasOwnProperty("nextdate") &&
      this.props.nextdate != null &&
      this.props.nextdate.length >= 2
    ) {
      console.log("next date is" + this.props.nextdate[1]);
      console.log("date1!!" + new Date(this.state.currentDate))
      console.log("date!2" + new Date(this.props.nextdate[0]))
      if(new Date(this.state.currentDate).getDate() === new Date(this.props.nextdate[0]).getDate())
      {
        this.handleDatePicked(new Date(this.props.nextdate[1]));
      }else{
        this.handleDatePicked(new Date(this.props.nextdate[0]));
      }
      
    } else {
      var newDate = new Date(this.state.currentDate).setDate(
        new Date(this.state.currentDate).getDate() + 1
      );
      this.handleDatePicked(new Date(newDate));
    }
  }

  componentDidMount() {
    if(this.props.referer!=undefined)
    {this.props.referer(this)}
  }

  toNormal(date){
    console.log("GOT"+date)
    var date = new Date(date); // Or the date you'd like converted.
    var isoDate = new Date(
      date.getTime()
    ).toISOString();
    console.log("Cyka"+isoDate)
    isoDate=isoDate.substr(0,isoDate.indexOf('T'))
    //console.log(date.substr(0,date.toString().find('T')))
    var d=isoDate.split('-')
    return d[2]+"."+d[1]+""+this.weekday[new Date(isoDate).getDay()]+" ";
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps!=this.props && prevProps.referer===undefined){
      if(this.props.referer!=undefined){
        this.setState({currentDate:this.props.date})
        console.log(this.state.currentDate)
        {this.props.referer(this)}
      }
    }
    }


  prevDate() {
    var newDate = new Date(this.state.currentDate).setDate(
      new Date(this.state.currentDate).getDate() - 1
    );
    this.handleDatePicked(new Date(newDate));
  }
  this;
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
        <TouchableOpacity
          style={{ flexDirection: "column", justifyContent: "center" }}
          onPress={() => {
            this.props.navigateToSettings();
          }}
        >
          <SettingsIcon
            name="settings"
            color={"white"}
            size={24}
            style={{ width: 24 }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignSelf: "center",
            flex: 1
          }}
        >
          <TouchableOpacity
            style={{
              felx: 1,
              flexDirection: "column",
              justifyContent: "center",
              paddingHorizontal: 20
            }}
            onPress={() => this.prevDate()}
          >
            <ArrowIcons name="left" color={"white"} size={22} />
          </TouchableOpacity>
          <View
            style={{
              felx: 1,
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                this.showDateTimePicker();
              }}
            >
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                date={new Date(this.state.currentDate)}
              />
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 22,
                    textAlignVertical: "center"
                  }}
                >
                  {moment(this.state.currentDate.substr(0,this.state.currentDate.indexOf("T"))).format('DD.MM dd  ',).toUpperCase()}
                </Text>
              </View>
              <View>
                <Icon2 name="calendar" size={24} color={"white"} />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              felx: 1,
              flexDirection: "column",
              justifyContent: "center",
              paddingHorizontal: 20
            }}
            onPress={() => this.nextDate()}
          >
            <ArrowIcons name="right" color={"white"} size={22} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  columnCenterize: {
    flexDirection: "column",
    justifyContent: "center"
  }
});