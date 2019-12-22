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
import { EditTable } from "../Components/EditTable";
import { Button } from "native-base";
import Network from "../Utils/Networking";
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
  constructor(props) {
    super(props);
  }

  state = {
    showEditTable: false,
    date: this.props.navigation.state.params.data.date
      .slice(0, 10)
      .replace(/-/g, "-"),
    doctorId: this.props.navigation.state.params.data.doctorId,
    listOfCells: null,
    loading: true
  };

  async componentDidMount() {
    await this.initialApiCall();
    this.setState({ loading: false });
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
  async saveChanges(data) {
    console.log(data)
    //Network.EditGrvData("555",data.doctorId, data.date,data.time,data.mk,data.prim,data.nvr,data.kab)
    console.log("cyka")
    this.setState({ showEditTable: false });
    this.initialApiCall()
  }
  deleteCell() {

  }

  async initialApiCall() {
    var response = await Network.GetTimesAll(
      "555",
      this.state.doctorId,
      this.state.date
    );
    console.log(response);
    this.data = response.rows.row.map(item => {
      var p = null;
      if (Object.entries(item.id).length === 0) {
        p = {
          visitNum: "",
          time: item.name,
          doctorId: this.state.doctorId,
          date: this.state.date,
          prim: ""
        };
      } else {
        p = {
          visitNum: item.id.split(",")[1],
          time: item.name,
          doctorId: this.state.doctorId,
          date: this.state.date,
          prim: item.id.split(", ")[0]
        };
      }
      return p;
    });
    this.setState({ listOfCells: this.data });
  }
  showEditTable(newState) {
    this.setState(newState);
  }


  drawEditTable() {
    if(this.state.modalData === undefined){
      console.log("a")
    } else{
      if (this.state.showEditTable === true) {
        return (
          <EditTable
            deleteFunc={() => this.deleteCell()}
            closeFun={() => this.setState({ showEditTable: false })}
            saveFun={(data) => this.saveChanges(data)}
            data={{
              visitNum:this.state.modalData.visitNum,
              time:this.state.modalData.time,
              doctorId:this.state.doctorId,
              date:this.state.modalData.date,
              prim:this.state.modalData.prim,
              token:"555"
            }}
          />
        );
      }
    }
  }

  render() {
    if (this.state.loading) {
      return <View></View>;
    } else
      return (
        <View style={styles.container}>
          {this.drawEditTable()}
          <FlatList
            data={this.state.listOfCells}
            keyExtractor={item => item.time}
            numColumns={1}
            style={{
              flex: 1,
              alignSelf: "stretch",
              backgroundColor: "#f1fff0"
            }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      showEditTable: true,
                      modalData: item
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
