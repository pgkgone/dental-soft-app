import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Container, Header, Body, Form } from "native-base";
import { NavigationHeader } from "../Components/NavigationHeader";
import { Cell } from "../Components/Cell";
import { EditTable } from "../Components/EditTable";
import Network from "../Utils/Networking";
export class DoctorTimeTable extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  state = {
    showEditTable: false,
    loading: true,
    dates: null,
    listOfCells: null,
    doctorId: 4,
    date: new Date().toISOString(),
    numColumns: 3
  };

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  async componentDidMount() {
    //TODO ограничитель
    await this.initApiCall();
    this.setState({ loading: false });
  }

  async initApiCall() {
    var times = await Network.GetDatesAll(
      "555",
      this.state.doctorId,
      this.state.date.slice(0, 10).replace(/-/g, "-")
    );
    var formatted = times.rows.row
      .map(item => {
        return this.replaceAll(item.name, "-", ".");
      })
      .slice(0, this.state.numColumns);
    console.log(formatted);
    this.tableHeader = (
      <FlatList
        data={formatted.map(item => {
          var dataArr = { key: item };
          return dataArr;
        })}
        numColumns={formatted.length}
        style={{ flex: 1, alignSelf: "stretch", backgroundColor: "#a52b2a" }}
        renderItem={({ item }) => <Text style={styles.header}>{item.key}</Text>}
      />
    );

    this.setState({ dates: formatted });
    var data = {};
    var dates = [];
    for (var i = 0; i < formatted.length; i++) {
      var pa = await Network.GetTimesAll(
        "555",
        this.state.doctorId,
        formatted[i]
      );
      var form = pa.rows.row.map(item => {
        var p = null;
        if (Object.entries(item.id).length === 0) {
          p = {
            visitNum: "",
            time: item.name,
            doctorId: this.state.doctorId,
            date: formatted[i],
            name: ""
          };
        } else {
          p = {
            visitNum: item.id.split(",")[1],
            time: item.name,
            doctorId: this.state.doctorId,
            date: formatted[i],
            name: item.id.split(", ")[0]
          };
        }
        return p;
      });
      dates.push({
        date: formatted[i],
        cells: form
      });
    }
    data.dates = dates;
    this.setState({ listOfCells: this.TableFormatter(data) });
  }

  dateChangedApiCall(datesl) {
    this.setState({ date: datesl.slice(0, 10).replace(/-/g, "-") });
    this.initApiCall();
  }
  constructor(props) {
    super(props);
  }
  /*
        Метод приводящий массив json'ов к нужному виду (массив чередующихся по неделям ячеек)
    */
  TableFormatter(data) {
    console.log("cyka");
    var Cells = [];
    var listOfColumns = data.dates.map(item => item.cells);
    console.log("here");
    var longestArray = Math.max.apply(
      null,
      listOfColumns.map(item => item.length)
    );
    for (var i = 0; i < longestArray * data.dates.length; i++) {
      Cells.push({
        key: i,
        name: "",
        visitNum: "",
        time: ""
      });
    }
    for (var i = 0; i < listOfColumns.length; i++) {
      listOfColumns[i].map((item, index) => {
        var newCell = {
          key: Cells[i + listOfColumns.length * index].key,
          name: item.name,
          visitNum: item.visitNum,
          time: item.time,
          date: item.date
        };
        Cells[i + listOfColumns.length * index] = newCell;
      });
    }
    return Cells;
  }

  seEditTable() {
    this.setState({
      showEditTable: false
    });
  }

  //эта функция вызывается после нажатия на кнопку сохранить
  saveChanges(data) {
    console.log(data)
    Network.EditGrvData("555",data.doctorId, data.date,data.time,data.mk,data.prim,data.nvr,data.kab)
    console.log("cyka")
    this.setState({ showEditTable: false });
    this.initApiCall()
  }
  showEditTable(newState) {
    this.setState(newState);
  }
  drawEditTable() {
    console.log(this.state.modalData)
    console.log("Clicked")
    if(this.state.modalData === undefined){
      console.log("a")
    } else{
      if (this.state.showEditTable === true) {
        return (
          <EditTable
            closeFun={(data) => this.saveChanges(data)}
            data={{
              visitNum:this.state.modalData.name,
              time:this.state.modalData.time,
              doctorId:this.state.doctorId,
              date:this.state.modalData.date,
              prim:this.state.modalData.visitNum,
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
        <Container>
          <Header
            androidStatusBarColor="#a52b2a"
            style={{
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "#a52b2a"
            }}
          >
            <Body
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "#a52b2a"
              }}
            >
              <NavigationHeader
                apiCall={date => this.dateChangedApiCall(date)}
                navigateToSettings={() => this.props.navigation.navigate("Settings")}
                date={this.state.date}
              />
            </Body>
          </Header>
          {this.drawEditTable()}
          <View style={styles.container}>
            <FlatList
              data={this.state.listOfCells}
              keyExtractor={item => item.key}
              numColumns={this.state.dates.length}
              ListHeaderComponent={this.tableHeader}
              style={{
                flex: 1,
                alignSelf: "stretch",
                backgroundColor: "#f1fff0"
              }}
              renderItem={({ item }) => {
                if (item.time === "") {
                  return (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        borderWidth: 0.5,
                        borderColor: "black"
                      }}
                    >
                      <Cell
                        name={item.name}
                        time={item.time}
                        visitNum={item.visitNum}
                      />
                    </View>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        borderWidth: 0.5,
                        borderColor: "black"
                      }}
                      onPress={() =>
                        this.setState({
                          showEditTable: true,
                          modalData: item
                        })
                      }
                    >
                      <Cell
                        name={item.name}
                        time={item.time}
                        visitNum={item.visitNum}
                      />
                    </TouchableOpacity>
                  );
                }
              }}
            />
          </View>
        </Container>
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
    textAlign: "center",
    flex: 0.5,
    fontSize: 13
  },
  header: {
    color: "white",
    flexDirection: "row",
    textAlign: "center",
    flex: 0.5,
    padding: 10,
    fontSize: 18,
    height: 44
  }
});

//Example Data
/*
    data =  {
    dates : [{
      date : '11.12.1212',
      cells : [{
        visitNum : 'Первое посещение 11 12',
        name : 'Иван Иванов',
        time : '11:00',
      },
      {
        visitNum : 'Первое посещение',
        name : 'Иван Иванов',
        time : '11:00',
      },
      {
        visitNum : 'Первое посещение 11 12',
        name : 'Иван Иванов',
        time : '11:00',
      },
      {
        visitNum : 'Первое посещение',
        name : 'Иван Иванов',
        time : '11:00',
      }
    ]  
  },
  {
    date : '12.13.1212',
    cells : [{
      visitNum : 'Первое посещение 12 13',
      name : 'Иван Иванов',
      time : '11:00',
    }
  ]  
},
{
  date : '10.13.1212',
  cells : [{
    visitNum : 'Первое посещение 12 13',
    name : 'Иван Иванов',
    time : '11:00',
  },
  {
    visitNum : 'Первое посещение 12 13',
    name : 'Иван Иванов',
    time : '11:00',
  }
]  
}
  ]
}
*/
