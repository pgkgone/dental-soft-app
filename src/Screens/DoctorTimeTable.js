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
export class DoctorTimeTable extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  state = {
    showEditTable: false
  };

  initApiCall() {
    this.data = {
      dates: [
        {
          date: "11.12.1212",
          cells: [
            {
              visitNum: "Первое посещение 11 12",
              name: "Иван Иванов",
              time: "11:00",
              date: "11.12.1212"
            },
            {
              visitNum: "Первое посещение",
              name: "Иван Иванов",
              time: "11:00",
              date: "11.12.1212"
            },
            {
              visitNum: "Первое посещение 11 12",
              name: "Иван Иванов",
              time: "11:00",
              date: "11.12.1212"
            },
            {
              visitNum: "Первое посещение",
              name: "Иван Иванов",
              time: "11:00",
              date: "11.12.1212"
            }
          ]
        },
        {
          date: "12.13.1212",
          cells: [
            {
              visitNum: "Первое посещение 12 13",
              name: "Иван Иванов",
              time: "11:00",
              date: "11.12.1212"
            }
          ]
        },
        {
          date: "10.13.1212",
          cells: [
            {
              visitNum: "Первое посещение 12 13",
              name: "Иван Иванов",
              time: "11:00",
              date: "11.12.1212"
            },
            {
              visitNum: "Первое посещение 12 13",
              name: "Иван Иванов",
              time: "11:00",
              date: "11.12.1212"
            }
          ]
        }
      ]
    };
  }

  dateChangedApiCall(date) {
    console.log("Дата поменялась нужно вызвать Api " + date);
  }
  /*
    this..data = {
      dates : [{
        date,  дд.мм.гггг для отображения в заголовке столбца
        cells : [{
          visitNum, - Номер посещения
          name, - Имя Фамилия посетителя
          time - время визита
        },
        ...
        ]  
      },
        ...
      ]
    }
  */
  constructor(props) {
    super(props);
    //this.data = this.initApiCall()
    this.initApiCall();
    this.tableHeader = (
      <FlatList
        data={this.data.dates.map(item => {
          var dataArr = { key: item.date };
          return dataArr;
        })}
        numColumns={this.data.dates.length}
        style={{ flex: 1, alignSelf: "stretch", backgroundColor: "#a52b2a" }}
        renderItem={({ item }) => <Text style={styles.header}>{item.key}</Text>}
      />
    );
    this.listOfCells = this.TableFormatter();
  }
  /*
        Метод приводящий массив json'ов к нужному виду (массив чередующихся по неделям ячеек)
    */
  TableFormatter() {
    var Cells = [];
    var listOfColumns = this.data.dates.map(item => item.cells);
    var longestArray = Math.max.apply(
      null,
      listOfColumns.map(item => item.length)
    );
    for (var i = 0; i < longestArray * this.data.dates.length; i++) {
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
          date : item.date
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
    this.setState({ showEditTable: false });
    console.log("saved")
  }
  showEditTable(newState) {
    this.setState(newState);
  }
  drawEditTable() {
    dataToTable = this.state.modalData;// нужно вызвать Api
    // dataToTable = {
    //   visitNum : "Первое посещение", - "?константно "1-е посещение" если есть prim?"
    //   time : item,
    //   doctorId : this.data.doctorId,
    //   date : this.data.date,
    //   prim : apiData.prim,
    //   mk : apiData.mk,
    //   nvr : apiData.nvr,
    //   kab : apiData.kab
    // }
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
              date={new Date("1995-12-17T03:24:00")}
            />
          </Body>
        </Header>
        {this.drawEditTable()}
        <View style={styles.container}>
          <FlatList
            data={this.listOfCells}
            keyExtractor={item => item.key}
            numColumns={this.data.dates.length}
            ListHeaderComponent={this.tableHeader}
            style={{
              flex: 1,
              alignSelf: "stretch",
              backgroundColor: "#f1fff0"
            }}
            renderItem={({ item }) => {
              if (item.time === "") {
                return (<View
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
                </View>);
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
