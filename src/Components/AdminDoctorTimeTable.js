import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  TextInput
} from "react-native";
import { EditTable} from "./EditTable"
import { Button } from "native-base";

/*

    входные параметры 
  
    this.props.navigation.state.params.data (в конструкторе заменяется на this.data) = {
        name : 'Сидоров',
        doctorId : '123',
        date : 'date' 
    }

    time : [Time<string>] = GetTimesAll(token, this.data.docId, this.data.date)
    listOfCells = time.map((item) => {
      apiData = GetGrvData(token, this.data.docId, this.data.date, item);
      /
        apiData = {
          mk- номер карты
          prim - примечание
          nvr – норма времени на приём
          kab - № кабинета
        }
      /
      data = {
        visitNum : "Первое посещение", - "?константно "1-е посещение" если есть prim?"
        time : item,
        doctorId : this.data.doctorId,
        date : this.data.date,
        prim : apiData.prim,
        mk : apiData.mk,
        nvr : apiData.nvr,
        kab : apiData.kab
      }
      return data;
    })
    
    API вызовы
    dateChangedApiCall
  */

export class AdminDoctorTimeTable extends React.Component {
  state = {
    showEditTable: false
  };

  constructor(props) {
    super(props);
    //this.listOfCells = initialAPICall()
    this.listOfCells = [{
      visitNum : "Первое посещение",
      time : '11:30',
      doctorId : '505',
      date : 2019-12-12,
      prim : 'asdfsdf',
    },
    {
      visitNum : "Первое посещение",
      time : '12:00',
      doctorId : '505',
      date : 2019-12-12,
      prim : 'asda',
    }]
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.data.name,
      headerStyle: {
        backgroundColor: "#a52b2a"
      },
      headerTintColor: "#fff"
    };
  };

  seEditTable() {
    this.setState({
      showEditTable: false
    });
  }

  //эта функция вызывается после нажатия на кнопку сохранить
  saveChanges(data) {
    this.setState({ showEditTable: false });
    console.log(data);
  }
  
  initialAPICall(){

  }
  showEditTable(newState) {
    this.setState(newState);
  }
  drawEditTable() {
    dataToTable = this.state.modalData //тут нужно вызвать Api
    if (this.state.showEditTable === true) {
      return (
        <EditTable
          closeFun={(data) => this.saveChanges(data)}
          data = {dataToTable}
        />
      );
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.drawEditTable()}
        <FlatList
          data={this.listOfCells}
          keyExtractor={item => item.time}
          numColumns={1}
          style={{ flex: 1, alignSelf: "stretch", backgroundColor: "#f1fff0" }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showEditTable: true,
                    modalData : item
                  })
                }
              >
                <Cell
                  name={item.prim}
                  time={item.time}
                  visitNum={item.visitNum}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}
class Cell extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          borderWidth: 0.5,
          borderColor: "black"
        }}
      >
        <View
          style={{
            width: "30%",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 40
          }}
        >
          <View>
            <Text style={styles.item}>{this.props.time}</Text>
          </View>
        </View>
        <View style={{ width: "70%", flexDirection: "column" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end",
              paddingTop: 12,
              paddingBottom: 5
            }}
          >
            <Text style={styles.item}>{this.props.name}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingBottom: 12,
              paddingTop: 5
            }}
          >
            <Text style={styles.item}>{this.props.visitNum}</Text>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "black"
  },
  item: {
    color: "#509ffa",
    textDecorationLine: "underline",
    flex: 1,
    fontSize: 18
  },
  editBoxItemView: {
    padding: 10
  },
  editBoxItem: {
    fontSize: 18
  }
});
