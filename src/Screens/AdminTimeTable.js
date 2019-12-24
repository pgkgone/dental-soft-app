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
    token: this.props.navigation.state.params.data.token,
    url: this.props.navigation.state.params.data.url,
    port: this.props.navigation.state.params.data.port,
    date: this.getISODate(),
    docList: null,
    docInfo: null,
    showEditTable: false,
    screenWidth:Math.round(Dimensions.get("window").width) * PixelRatio.get(),
    maxDocs: Math.round(Math.round(Dimensions.get("window").width) * PixelRatio.get() / 350),
  };

  onLayout(e) {
    console.log("here")
    var screenWidth =
      Math.round(Dimensions.get("window").width) * PixelRatio.get();
    var maxDocs = Math.round(screenWidth / 350);
    console.log(maxDocs)
    this.generateTable()
    this.setState({maxDocs:maxDocs})
  }

  dateChangedApiCall(datesl) {
    console.log("ИЗМЕНИЛОСЬ");
    this.setState({ date: datesl.slice(0, 10).replace(/-/g, "-") });
    this.initialApiCall();
  }

  getISODate() {
    var date = new Date(); // Or the date you'd like converted.
    var isoDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
    return isoDate;
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
              prim: "",
              doctorId: formatted[i].id
            };
          } else {
            p = {
              visitNum: item.id.split(",")[1], //Цель визита
              time: item.name,
              prim: item.id.split(", ")[0], //Имя пациента
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
    console.log(this.props)
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
        visitNum: "",
        time: "",
        prim:""
      });
    }
    for (var i = 0; i < listOfColumns.length; i++) {
      listOfColumns[i].map((item, index) => {
        var newCell = {
          key: Cells[i + listOfColumns.length * index].key,
          visitNum: item.visitNum,
          time: item.time,
          date: item.date,
          doctorId: item.doctorId,
          prim: item.prim
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
      data.mk=""
    }
    if (Object.entries(data.prim).length === 0) {
      data.prim=""
    }
    if (Object.entries(data.nvr).length === 0) {
      data.nvr=""
    }
    if (Object.entries(data.kab).length === 0) {
      data.kab=""
    }
    console.log("vivod")
    console.log(data);

    Network.EditGrvData(this.state.token,data.doctorId, data.date.slice(0, 10).replace(/-/g, "-") ,data.time,data.mk,data.visitNum,data.nvr,data.kab,this.state.url,this.state.port)
    this.setState({ showEditTable: false });
    this.initialApiCall()
  }
  showEditTable(newState) {
    this.setState(newState);
  }

  deleteCell(data){
    Network.DeleteGrvData(this.state.token,data.doctorId, data.date.slice(0, 10).replace(/-/g, "-") ,data.time,this.state.url,this.state.port)
    this.setState({ showEditTable: false });
    this.initialApiCall()
  }

  drawEditTable() {
    if (this.state.modalData === undefined) {
      console.log("Not Loaded");
    } else {
      if (this.state.showEditTable === true) {
        console.log("Clicked Cell")
        console.log(this.state.modalData)
        console.log("end")
        return (
          <EditTable
            deleteFunc={(data) => this.deleteCell(data)}
            closeFun={() => this.setState({ showEditTable: false })}
            saveFun={data => this.saveChanges(data)}
            data={{
              visitNum: this.state.modalData.visitNum,
              time: this.state.modalData.time,
              doctorId: this.state.modalData.doctorId,
              date: this.state.date.slice(0, 10).replace(/-/g, "-") ,
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

  generateTable(maxDocs) {
    if(maxDocs==null) maxDocs=this.state.maxDocs
    var result = [];
    for (var i = 0; i < this.state.docList.length; i += this.state.maxDocs) {
      var partDoctor = this.state.docList.slice(i, i + maxDocs);
      var partInfo = this.state.docInfo.slice(i, i + maxDocs);
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
                    name={item.prim}
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
                    name={item.prim}
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
        <Container onLayout={this.onLayout.bind(this)}>
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
          <FlatList
            data={this.generateTable(null)}
            renderItem={({ item }) => item}
            keyExtractor={(item, index) => index}
          />
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
