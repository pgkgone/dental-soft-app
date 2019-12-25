import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  BackHandler,
  Alert,
  Modal
} from "react-native";
import { Container, Header, Body, Form, Spinner } from "native-base";
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
    refreshing: false,
    loading: true,
    dates: null,
    listOfCells: null,
    doctorId: this.props.navigation.state.params.data.doctorId, //через пропс обязательно получаем
    date: this.getISODate(),
    numColumns: Math.round(
      (Math.round(Dimensions.get("window").width) * PixelRatio.get()) / 350
    ),
    token: this.props.navigation.state.params.data.token, //через пропс обязательно получаем
    url: this.props.navigation.state.params.data.url,
    port: this.props.navigation.state.params.data.port,
    maxColumns: Math.round(
      (Math.round(
        Math.max(
          Dimensions.get("window").width,
          Dimensions.get("window").height
        )
      ) *
        PixelRatio.get()) /
        350
    )
  };

  onLayout(e) {
    var screenWidth =
      Math.round(Dimensions.get("window").width) * PixelRatio.get();
    var maxDocs = Math.round(screenWidth / 350);
    if (this.state.numColumns != maxDocs) {
      this.setState({ numColumns: maxDocs }, () => {});
    }
  }

  getISODate() {
    var date = new Date(); // Or the date you'd like converted.
    var isoDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
    return isoDate;
  }

  //Заменяем все в строках
  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  handleBackPress = () => {
    return true;
  };

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
    console.log(this.props.navigation.state.params.data.url);
    //TODO ограничитель
    //Вызываем загрузку данных, ждем и показываем экран пользователю
    await this.initApiCall();
    this.setState({ loading: false });
  }

  async initApiCall() {
    console.log("МЕНЯ ВЫЗВАЛИ");
    var times = await Network.GetDatesAll(
      this.state.token,
      this.state.doctorId,
      this.state.date.slice(0, 10).replace(/-/g, "-"),
      this.state.url,
      this.state.port
    ).catch(e => {
      Alert.alert(
        "Ошибка",
        "Превышен лимит ожидания ответа от сервера",
        [
          {
            text: "OK",
            onPress: () => {
              this.initApiCall();
            }
          }
        ],
        { cancelable: true }
      );
    });
    var formatted = times.rows.row
      .map(item => {
        return item.name;
      })
      .slice(0, this.state.maxColumns);
    //Указываем даты
    console.log("DATES:" + formatted);
    if (formatted.length < this.state.maxColumns) {
      this.setState({ maxColumns: formatted.length });
    }
    //Формируем объект, который отошлём в TableFormatter
    var data = {};
    var dates = [];
    for (var i = 0; i < formatted.length; i++) {
      var pa = await Network.GetTimesAll(
        this.state.token,
        this.state.doctorId,
        formatted[i],
        this.state.url,
        this.state.port
      ).catch(e => {
        Alert.alert(
          "Ошибка",
          "Превышен лимит ожидания ответа от сервера",
          [
            {
              text: "OK",
              onPress: () => {
                this.initApiCall();
              }
            }
          ],
          { cancelable: true }
        );
      });
      var form = pa.rows.row.map(item => {
        var p = null;
        if (Object.entries(item.id).length === 0) {
          p = {
            visitNum: "", //Цель визита
            time: item.name,
            doctorId: this.state.doctorId,
            date: formatted[i],
            name: "" //Имя пациента
          };
        } else {
          p = {
            visitNum: item.id.split(",")[1], //Цель визита
            time: item.name,
            doctorId: this.state.doctorId,
            date: formatted[i],
            name: item.id.split(", ")[0] //Имя пациента
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
    this.setState({ listOfCells: data, dates: formatted, refreshing : false });
  }

  dateChangedApiCall(datesl) {
    console.log("ИЗМЕНИЛОСЬ НА" + datesl);
    this.setState({ date: datesl.slice(0, 10).replace(/-/g, "-"), refreshing : true}, () => {
      this.initApiCall();
    });
    
  }

  constructor(props) {
    super(props);
  }
  refreshingSpinner() {
    if (this.state.refreshing) {
      return (
          <View
            style={{
              flex: 1,
              width : "100%",
              height : "100%",
              backgroundColor: "rgba(0,0,0,0.05)",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 8,
              zIndex : 200,
              position : "absolute"
            }}
          >
            <Spinner color="red" />
          </View>
      );
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        >
          <Spinner color="red" />
        </View>
      );
    } else
      return (
        <Container
          onLayout={e => {
            this.onLayout(e);
          }}
        >
          {this.refreshingSpinner()}
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
                navigateToSettings={() =>
                  this.props.navigation.navigate("Settings")
                }
                date={this.state.date}
              />
            </Body>
          </Header>
          <Table
            data={this.state.listOfCells}
            numColumns={this.state.numColumns}
            headerData={this.state.dates}
            doctorId={this.state.doctorId}
            token={this.state.token}
            url={this.state.url}
            port={this.state.port}
            update={() => {
              this.initApiCall();
            }}
          ></Table>
        </Container>
      );
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    numColumns: this.props.numColumns,
    data: this.props.data,
    headerData: this.props.headerData,
    loading: true,
    showEditTable: false,
    doctorId: this.props.doctorId,
    token: this.props.token,
    url: this.props.url,
    port: this.props.port
  };

  seEditTable() {
    this.setState({
      showEditTable: false
    });
  }

  //эта функция вызывается после нажатия на кнопку сохранить
  saveChanges(data) {
    if (Object.entries(data.mk).length === 0) {
      data.mk = "";
    }
    if (Object.entries(data.prim).length === 0) {
      data.prim = "";
    }
    if (Object.entries(data.nvr).length === 0) {
      data.nvr = "";
    }
    if (Object.entries(data.kab).length === 0) {
      data.kab = "";
    }
    console.log("vivod");

    Network.EditGrvData2(
      this.state.token,
      data.doctorId,
      data.date.slice(0, 10).replace(/-/g, "-"),
      data.time,
      data.mk,
      data.visitNum,
      data.nvr,
      data.kab,
      this.state.url,
      this.state.port
    );
    this.setState({ showEditTable: false });
    this.props.update();
  }
  showEditTable(newState) {
    this.setState(newState);
  }

  deleteCell(data) {
    console.log(data);
    Network.DeleteGrvData(
      this.state.token,
      this.state.doctorId,
      data.date.slice(0, 10).replace(/-/g, "-"),
      data.time,
      this.state.url,
      this.state.port
    ).catch(e => {
      Alert.alert(
        "Ошибка",
        "Превышен лимит ожидания ответа от сервера",
        [
          {
            text: "OK",
            onPress: () => {
              this.deleteCell(data);
            }
          }
        ],
        { cancelable: true }
      );
    });
    this.setState({ showEditTable: false });
    this.props.update();
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  drawEditTable() {
    if (this.state.modalData === undefined) {
      console.log("Not Loaded");
    } else {
      if (this.state.showEditTable === true) {
        console.log("Clicked Cell");
        return (
          <EditTable
            deleteFunc={data => this.deleteCell(data)}
            closeFun={() => this.setState({ showEditTable: false })}
            saveFun={data => this.saveChanges(data)}
            data={{
              visitNum: this.state.modalData.visitNum,
              time: this.state.modalData.time,
              doctorId: this.state.doctorId,
              date: this.state.modalData.date.slice(0, 10).replace(/-/g, "-"),
              prim: this.state.modalData.name,
              token: this.state.token,
              url: this.state.url,
              port: this.state.port
            }}
          />
        );
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("updated");
    if (prevProps.numColumns != this.props.numColumns) {
      console.log("SETTED");
      this.setState({ numColumns: this.props.numColumns });
    }
    if (prevProps.data != this.props.data) {
      console.log("SETTED");
      this.setState({
        data: this.props.data,
        headerData: this.props.headerData
      });
    }
  }

  init() {
    console.log("Я вызван 1");
    return (
      <FlatList
        data={this.state.headerData
          .slice(0, this.state.numColumns)
          .map(item => {
            var dataArr = { key: item };
            return dataArr;
          })}
        numColumns={this.state.numColumns}
        style={{ flex: 1, alignSelf: "stretch", backgroundColor: "#a52b2a" }}
        renderItem={({ item }) => (
          <Text style={styles.header}>
            {this.replaceAll(item.key, "-", ".")}
          </Text>
        )}
      />
    );
  }

  TableFormatter(data) {
    console.log("Я вызван 2");
    var Cells = [];
    var listOfColumns = data.map(item => item.cells);
    var longestArray = Math.max.apply(
      null,
      listOfColumns.map(item => item.length)
    );
    for (var i = 0; i < longestArray * data.length; i++) {
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
  componentDidMount() {
    console.log("ЗАМАУНЧЕН");
    this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return <View></View>;
    } else
      return (
        <View style={styles.container}>
          {this.drawEditTable()}
          <FlatList
            key={this.state.numColumns}
            data={this.TableFormatter(
              this.state.data.dates.slice(0, this.state.numColumns)
            )}
            keyExtractor={item => item.key}
            numColumns={this.state.numColumns}
            ListHeaderComponent={this.init()}
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
