import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  PixelRatio
} from "react-native";
import { Container, Header, Body } from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon2 from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import Network from "../Utils/Networking";
import { NavigationHeader } from "../Components/NavigationHeader";
import { Cell } from "../Components/Cell";
import { EditTable } from "../Components/EditTable";

export class AdminTimeTable extends React.Component {
  constructor(props) {
    super(props);
    var screenWidth =
      Math.round(Dimensions.get("window").width) * PixelRatio.get();
    var maxDocs = Math.round(screenWidth / 350);
    this.state = {
      list: null,
      loading: true,
      token: "555",
      url: "vds.dental-soft.ru",
      port: "2102",
      date: new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "-"),
      width: screenWidth,
      maxDocs: maxDocs,
      docList: null,
      docInfo: null,
      showEditTable: false
    };

    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e) {
    var screenWidth =
      Math.round(Dimensions.get("window").width) * PixelRatio.get();
    var maxDocs = Math.round(screenWidth / 350);
    this.setState({
      width: screenWidth,
      maxDocs: maxDocs
    });
  }

  //устанавливаем stacknavigation header
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };

  state = {
    list: null,
    loading: true,
    token: "555",
    url: "vds.dental-soft.ru",
    port: "2102",
    date: new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "-"),
    width: 0,
    maxDocs: 2,
    docList: null,
    docInfo: null,
    showEditTable: false
  };
  maxDocsCalc() {
    return Math.round(this.state.width / 350);
  }
  dateChangedApiCall(datesl) {
    console.log("ИЗМЕНИЛОСЬ");
    this.setState({ date: datesl.slice(0, 10).replace(/-/g, "-") });
    this.initialApiCall();
  }

  async initialApiCall() {
    console.log("Start Loading");
    var docList = await Network.GetDocsAll(
      this.state.token,
      this.state.date.slice(0, 10).replace(/-/g, "-"),
      this.state.url,
      this.state.port
    );

    var formatted = docList.rows.row.map(item => {
      return { id: item.id, name: item.name };
    });
    console.log(docList);
    console.log("Получил список докторов \nПолучаю расписание для них");
    var docData = [];
    for (var i = 0; i < formatted.length; i++) {
      var response = await Network.GetTimesAll(
        this.state.token,
        formatted[i].id,
        this.state.date.slice(0, 10).replace(/-/g, "-"),
        this.state.url,
        this.state.port
      ).catch(err => {
        console.log(err);
      });

      docData.push(
        response.rows.row.map(item => {
          var p = null;
          if (Object.entries(item.id).length === 0) {
            p = {
              visitNum: "", //Цель визита
              time: item.name,
              name: "",
              doctorId: formatted[i].id
            };
          } else {
            p = {
              visitNum: item.id.split(",")[1], //Цель визита
              time: item.name,
              name: item.id.split(", ")[0], //Имя пациента
              doctorId: formatted[i].id
            };
          }
          return p;
        })
      );
    }
    console.log("Получил все расписания\nТеперь время нормализовать пары");
    this.setState({ docList: formatted, docInfo: docData });
    this.setState({ loading: false });
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    await this.initialApiCall();
  }

  TableFormatter(data) {
    var Cells = [];
    var listOfColumns = data.dates.map(item => item.cells);
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
          date: item.date,
          doctorId: item.doctorId
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

  /*
EditGrvData(string tokenId, doc_id, datez, timez, mk, prim, nvr, kab); - редактируем запись на приём
к врачу doc_id на дату datez, и время timez
где
mk- номер карты
prim - примечание
nvr – норма времени на приём
kab - № кабинета
  */
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
    console.log(data);

    Network.EditGrvData(
      this.state.token,
      data.doctorId,
      data.date,
      data.time,
      data.mk,
      data.prim,
      data.nvr,
      data.kab,
      this.state.url,
      this.state.port
    );
    this.setState({ showEditTable: false });
    this.initialApiCall();
  }
  showEditTable(newState) {
    this.setState(newState);
  }

  deleteCell(data) {
    Network.DeleteGrvData(
      this.state.token,
      data.doctorId,
      data.date,
      data.time,
      this.state.url,
      this.state.port
    );
    this.setState({ showEditTable: false });
    this.initApiCall();
  }

  drawEditTable() {
    if (this.state.modalData === undefined) {
      console.log("Not Loaded");
    } else {
      if (this.state.showEditTable === true) {
        return (
          <EditTable
            deleteFunc={() => this.deleteCell()}
            closeFun={() => this.setState({ showEditTable: false })}
            saveFun={data => this.saveChanges(data)}
            data={{
              visitNum: this.state.modalData.visitNum,
              time: this.state.modalData.time,
              doctorId: this.state.modalData.doctorId,
              date: this.state.date,
              prim: this.state.modalData.prim,
              token: this.state.token,
              url: this.state.url,
              port: this.state.port
            }}
          />
        );
      }
    }
  }

  generateHeader(data) {
    return (
      <FlatList
        data={data}
        numColumns={data.length}
        scrollEnabled={false}
        style={{ flex: 1, textAlign: "center", backgroundColor: "#a52b2a" }}
        renderItem={({ item }) => (
          <Text style={styles.header}>{item.name}</Text>
        )}
      />
    );
  }

  generateTable() {
    var result = [];
    for (var i = 0; i < this.state.docList.length; i += this.state.maxDocs) {
      var partDoctor = this.state.docList.slice(i, i + this.state.maxDocs);
      var partInfo = this.state.docInfo.slice(i, i + this.state.maxDocs);
      var data = {};
      var dates = [];
      for (var j = 0; j < partDoctor.length; j++) {
        dates.push({
          date: partDoctor[j].name,
          cells: partInfo[j]
        });
      }
      data.dates = dates;
      var r = this.TableFormatter(data);
      result.push(this.generateHeader(partDoctor));
      console.log("!!!!!" + partDoctor.length);
      result.push(
        <FlatList
          data={r}
          keyExtractor={item => item.key}
          numColumns={partDoctor.length}
          ListHeaderComponent={this.tableHeader}
          scrollEnabled={false}
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
      );
    }
    return result;
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
                navigateToSettings={() =>
                  this.props.navigation.navigate("Settings")
                }
                date={this.state.date}
              />
            </Body>
          </Header>
          {this.drawEditTable()}
          <View /*onLayout={this.onLayout}*/>
            <FlatList
              data={this.generateTable()}
              renderItem={({ item }) => item}
              keyExtractor={(item, index) => index}
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
