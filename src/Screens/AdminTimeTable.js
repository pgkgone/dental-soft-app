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
  PixelRatio,
  Alert,
  BackHandler,
  AppState,
  Platform
} from "react-native";
import { Container, Header, Body, Spinner } from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon2 from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import Network from "../Utils/Networking";
import { NavigationHeader } from "../Components/NavigationHeader";
import { Cell } from "../Components/Cell";
import { EditTable } from "../Components/EditTable";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import momentRU from 'moment/locale/ru' 
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";
export class AdminTimeTable extends React.Component {
  constructor(props) {
    super(props);
    moment.updateLocale('ru',momentRU );   
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //устанавливаем stacknavigation header
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  state = {
    refreshing: false,
    list: null,
    loading: true,
    token: this.props.navigation.state.params.data.token,
    url: this.props.navigation.state.params.data.url,
    port: this.props.navigation.state.params.data.port,
    date: this.getISODate(),
    docList: null,
    docInfo: null,
    refresher: false,
    notLoad: false,
    isCurrDay: true,
    showEditTable: false,
    timeout: 50,
    screenWidth: Math.round(Dimensions.get("window").width) * PixelRatio.get(),
    maxDocs: Math.round(
      (Math.round(Dimensions.get("window").width) * PixelRatio.get()) / 350
    )
  };

  _handleAppStateChange = nextAppState => {
    console.log(nextAppState);
    if (nextAppState === "active" && !this.state.refreshing) {
      this.setState({ refreshing: true }, () => {
        this.initialApiCall();
      });
    }
  };

  onRefresher() {
    this.setState({ refreshing: true, refresher: true });
    this.initialApiCall();
    this.setState({ refresher: false });
  }

  onLayout(e) {
    var screenWidth =
      Math.round(Dimensions.get("window").width) * PixelRatio.get();
    var maxDocs = Math.round(screenWidth / 350);
    console.log(maxDocs);
    this.setState({ maxDocs: maxDocs }, () => {
      this.generateTable();
    });
  }

  dateChangedApiCall(datesl) {
  
    console.log("ИЗМЕНИЛОСЬ НА " + datesl);
    console.log(datesl) 
    console.log(moment().format('DD.MM dd').toUpperCase())
    console.log(moment().format('YYYY-MM-DD'))
    if (
      (moment().format('YYYY-MM-DD')===moment(datesl.substr(0,datesl.indexOf("T"))).format('YYYY-MM-DD'))
    ) {
      this.setState(
        {
          date: datesl.slice(0, 10).replace(/-/g, "-"),
          refreshing: true,
          isCurrDay: true,
          notLoad:false
        },
        () => {
          this.initialApiCall();
        }
      );
    } else {
      this.setState(
        {
          date: datesl.slice(0, 10).replace(/-/g, "-"),
          refreshing: true,
          isCurrDay: false,
          notLoad:false
        },
        () => {
          this.initialApiCall();
        }
      );
    }
  }

  getISODate() {
    var date = new Date(); // Or the date you'd like converted.
    var isoDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
    return isoDate;
  }

  async getter(forUrl, ind, forDoc) {
    var pa = await Network.GetTimesAll(
      this.state.token,
      forDoc,
      forUrl,
      this.state.url,
      this.state.port,
      this.state.timeout
    ).catch(e => {
      console.log(e);
      throw e;
    });
    if (pa.rows.row[0] === undefined) {
      form = [];
      var p;
      if (Object.entries(pa.rows.row.id).length === 0) {
        p = {
          visitNum: "", //Цель визита
          time: pa.rows.row.name,
          doctorId: forDoc,
          date: forUrl,
          prim: "" //Имя пациента
        };
      } else {
        p = {
          visitNum: pa.rows.row.id.split(",")[1], //Цель визита
          time: pa.rows.row.name,
          doctorId: forDoc,
          date: forUrl,
          prim: pa.rows.row.id.split(", ")[0] //Имя пациента
        };
      }
      form.push(p);
      this.answs[ind] = form;
      return true;
    }

    var form = pa.rows.row.map(item => {
      var p = null;
      if (Object.entries(item.id).length === 0) {
        p = {
          visitNum: "", //Цель визита
          time: item.name,
          doctorId: forDoc,
          date: forUrl,
          prim: "" //Имя пациента
        };
      } else {
        p = {
          visitNum: item.id.split(",")[1], //Цель визита
          time: item.name,
          doctorId: forDoc,
          date: forUrl,
          prim: item.id.split(", ")[0] //Имя пациента
        };
      }
      return p;
    });
    this.answs[ind] = form;
    return true;
  }

  async getTimesM(formatted) {
    //this.getter(i, index).then(r=>{console.log("agaaaa");res(r)}).catch(s=>{console.log("BAD");rej(s)})
    /*
    var p = formatted.map((i, index) => {
      return new Promise((res, rej) => {
        this.getter(
          this.state.date.slice(0, 10).replace(/-/g, "-"),
          index,
          i.id
        )
          .then(e => {
            res(e);
          })
          .catch(e => {
            rej(e);
          });
      });
    });
    */
    var cdata = this.state.date.slice(0, 10).replace(/-/g, "-");
    await new Promise.all(
      formatted.map((i, index) => {
        return new Promise((res, rej) => {
          this.getter(cdata, index, i.id)
            .then(r => {
              res(r);
            })
            .catch(e => {
              rej(e);
            });
        });
      })
    )
      .then(e => {
        //console.log("ended");
      })
      .catch(r => {
        throw r;
      });
    /*
    return new Promise.all(p)
      .then(e => {
        console.log("ended");
      })
      .catch(e => {
        console.log("AAAAA");
        throw e;
      });
      */
    /*
      for(var i=0;i<p.length;i++){
        await this.getter( this.state.date.slice(0, 10).replace(/-/g, "-"),i,formatted[i].id);
      }
      */
  }

  async initialApiCall() {
    console.log("Start Loading");
    var docList = await Network.GetDocsAll(
      this.state.token,
      this.state.date.slice(0, 10).replace(/-/g, "-"),
      this.state.url,
      this.state.port,
      this.state.timeout
    ).catch(e => {
      Alert.alert(
        "Ошибка",
        "Превышен лимит ожидания ответа от сервера",
        [
          {
            text: "Попробовать снова",
            onPress: () => {
              this.initialApiCall();
            }
          }
        ],
        { cancelable: false }
      );
    });
    if (docList.rows != undefined) {
      var formatted;
      if (
        docList.rows.row[0] === undefined &&
        docList.rows.row.name === "empty"
      ) {
        //console.log("поймал");
        this.setState({ notLoad: true, loading: false, refreshing: false });
      } else {
        if (docList.rows.row[0] === undefined) {
          formatted = new Array(1);
          formatted[0] = {
            id: docList.rows.row.id,
            name: docList.rows.row.name
          };
        } else {
          formatted = docList.rows.row.map(item => {
            return { id: item.id, name: item.name };
          });
        }
        this.answs = new Array(formatted.length);
        var docData = [];
        await this.getTimesM(formatted)
          .then(re => {
            for (var i = 0; i < formatted.length; i++) {
              docData.push(this.answs[i]);
            }
            this.setState({
              docList: formatted,
              docInfo: docData,
              refreshing: false
            });
            this.setState({ loading: false });
          })
          .catch(e => {
            console.log("MAIN ERR:" + e);
            Alert.alert(
              "Ошибка",
              "Ошибка соединения с сервером",
              [
                {
                  text: "Попробовать снова",
                  onPress: () => {}
                }
              ],
              { cancelable: true }
            );
            this.initialApiCall();
          });
      }
    }
    //console.log("Получил все расписания\nТеперь время нормализовать пары");
  }

  handleBackPress = () => {
    return true;
  };

  async componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    var p = await SecureStore.getItemAsync("timeout");
    this.setState({ timeout: Number(p) });
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
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
        prim: ""
      });
    }
    for (var i = 0; i < listOfColumns.length; i++) {
      listOfColumns[i].map((item, index) => {
        var newCell = {
          key: Cells[i + listOfColumns.length * index].key,
          visitNum: item.visitNum,
          time: Object.keys(item.time).length === 0 ? "" : item.time,
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
  async saveChanges(data) {
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
    var d;
    d = await Network.EditGrvData2(
      this.state.token,
      data.doctorId,
      data.date.slice(0, 10).replace(/-/g, "-"),
      data.time,
      data.mk,
      data.visitNum,
      data.nvr,
      data.kab,
      this.state.url,
      this.state.port,
      this.state.timeout
    ).catch(e => {
      console.log("ОШИБКА");
      var msg = "";
      if (e.includes("Validation constraint violation")) {
        msg = "Неверная норма времени";
      }
      if (e.includes("<SOAP-ENV:Detail>")) {
        var index = e.indexOf("<SOAP-ENV:Detail>");
        msg = e.substr(
          index + 17,
          e.indexOf("</SOAP-ENV:Detail>") - index - 17
        );
      } else {
        if (e.includes("Нет такого")) {
          msg = "Нет такого № кабинета " + data.kab;
        } else {
          if (e.includes("Слишком большое время")) {
            msg =
              "Слишком большое время на прием, так как кто-то уже записан на следующее время, конфликтующее с текущей нормой";
          } else {
            if (e.includes("Ф.И.О.")) {
              msg = "Введите описание!";
            }
          }
        }
      }
      console.log("ОШИИИИИБКА");

      if (msg === "") msg = "Превышен лимит ожидания от сервера";
      Alert.alert("Ошибка", msg, [{ text: "OK", onPress: () => {} }], {
        cancelable: true
      });
    });
    if (d != undefined) {
      if (d.includes("STATE-OK")) {
        if (Platform.OS === "ios") {
          this.setState({ showEditTable: false, refreshing: true }, () => {
            this.iosFunc();
          });
        } else {
          Alert.alert(
            "Ок",
            "Успешно изменено, данные обновляются",
            [
              {
                text: "OK",
                onPress: () => {}
              }
            ],
            { cancelable: true }
          );
          this.setState({ showEditTable: false, refreshing: true });
          this.initialApiCall();
        }
      }
    }
  }

  async iosFunc() {
    console.log("ios");
    await new Promise(resolve => setTimeout(resolve, 850));
    Alert.alert(
      "Ок",
      "Успешно изменено, данные обновляются",
      [
        {
          text: "OK",
          onPress: () => {}
        }
      ],
      { cancelable: true }
    );
    this.initialApiCall();
  }
  showEditTable(newState) {
    this.setState(newState);
  }

  deleteCell(data) {
    Network.DeleteGrvData(
      this.state.token,
      data.doctorId,
      data.date.slice(0, 10).replace(/-/g, "-"),
      data.deleteTime,
      this.state.url,
      this.state.port,
      this.state.timeout
    );
    this.setState({ showEditTable: false });
    this.initialApiCall();
  }

  drawEditTable() {
    if (this.state.modalData === undefined) {
      console.log("Not Loaded");
    } else {
      if (this.state.showEditTable === true) {
        console.log("Clicked Cell");
        console.log(this.state.modalData);
        console.log("end");
        return (
          <EditTable
            deleteFunc={data => this.deleteCell(data)}
            closeFun={() => this.setState({ showEditTable: false })}
            saveFun={data => this.saveChanges(data)}
            data={{
              visitNum: this.state.modalData.visitNum,
              time: this.state.modalData.time,
              doctorId: this.state.modalData.doctorId,
              date: this.state.date.slice(0, 10).replace(/-/g, "-"),
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
  toFio(data) {
    var d = data.split(" ");
    return d[0] + " " + d[1][0] + "." + d[2][0];
  }
  generateHeader(data) {
    return (
      <FlatList
        data={data}
        key={data.length}
        numColumns={data.length}
        scrollEnabled={false}
        style={{
          flex: 1,
          textAlign: "center",
          backgroundColor: this.state.isCurrDay ? "#1B73B3" : "#a52b2a"
        }}
        renderItem={({ item }) => (
          <Text style={styles.header}>{this.toFio(item.name)}</Text>
        )}
      />
    );
  }

  generateTable(maxDocs) {
    if (maxDocs == null) maxDocs = this.state.maxDocs;
    var result = [];
    var i=0
    const Device = require('react-native-device-detection');
    while(i<this.state.docList.length){
      console.log(this.state.docList.length-i)
  
      if(this.state.docList.length-(i+maxDocs)===2 && Device.isTablet){
        maxDocs+=2
      } else{
        if(this.state.docList.length-(i+maxDocs)===1){
          maxDocs+=1
        }
      }

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
      const config = {
        velocityThreshold: 0.85,
        directionalOffsetThreshold: 350
      };
      result.push(
        <GestureRecognizer
        onSwipeLeft={() => this.onSwipeLeft()}
        onSwipeRight={() => this.onSwipeRight()}
        config={config}
      >
        <FlatList
          data={r}
          keyExtractor={item => item.key}
          key={partDoctor.length}
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
        </GestureRecognizer>
      );
      i+=maxDocs
    }
    return result;
  }

  refreshingSpinner() {
    if (this.state.refreshing) {
      return (
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.05)",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 8,
            zIndex: 200,
            position: "absolute"
          }}
        >
          <Spinner color="red" />
        </View>
      );
    }
  }

  referer(ref) {
    this.setState({ child: ref });
    console.log("зареферил");
  }

  onSwipeLeft() {
    console.log("You swiped left!");
    this.state.child.nextDate();
  }

  onSwipeRight(gestureState) {
    console.log("You swiped right!");
    this.state.child.prevDate();
  }

  render() {
    const config = {
      velocityThreshold: 0.4,
      directionalOffsetThreshold: 100
    };

    if (this.state.loading) {
      return (
        <Container>
          <Header
            androidStatusBarColor={this.state.isCurrDay ? "#1B73B3" : "#a52b2a"}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: this.state.isCurrDay ? "#1B73B3" : "#a52b2a",
              shadowOpacity: 0, //for ios
              borderBottomWidth: 0 //for ios
            }}
          >
            <Body
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: this.state.isCurrDay ? "#1B73B3" : "#a52b2a"
              }}
            >
              <NavigationHeader
                navigateToSettings={() =>
                  this.props.navigation.navigate("Settings")
                }
                date={this.state.date}
              />
            </Body>
          </Header>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#F1FFF0"
            }}
          >
            <Spinner color="red" />
          </View>
        </Container>
      );
    } else if (this.state.notLoad) {
      return (
        <Container>
          <Header
            androidStatusBarColor={this.state.isCurrDay ? "#1B73B3" : "#a52b2a"}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: this.state.isCurrDay ? "#1B73B3" : "#a52b2a",
              shadowOpacity: 0, //for ios
              borderBottomWidth: 0 //for ios
            }}
          >
            <Body
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: this.state.isCurrDay ? "#1B73B3" : "#a52b2a"
              }}
            >
              <NavigationHeader
                referer={ref => {
                  this.referer(ref);
                }}
                apiCall={date => this.dateChangedApiCall(date)}
                navigateToSettings={() =>
                  this.props.navigation.navigate("Settings")
                }
                date={this.state.date}
              />
            </Body>
          </Header>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#F1FFF0"
            }}
          >
            <GestureRecognizer
              onSwipeLeft={() => this.onSwipeLeft()}
              onSwipeRight={() => this.onSwipeRight()}
              config={config}
            >
              <Text style={{ fontSize: 30, textAlign: "center", color: "red" }}>
                Нет врачей на текущую дату
              </Text>
            </GestureRecognizer>
          </View>
        </Container>
      );
    } else
      return (
        <Container
          onLayout={this.onLayout.bind(this)}
          style={{ backgroundColor: "#F1FFF0" }}
        >
          <Header
            androidStatusBarColor={this.state.isCurrDay ? "#1B73B3" : "#a52b2a"}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: this.state.isCurrDay ? "#1B73B3" : "#a52b2a",
              borderBottomWidth: 0
            }}
          >
            <Body
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: this.state.isCurrDay ? "#1B73B3" : "#a52b2a"
              }}
            >
              <NavigationHeader
                referer={ref => {
                  this.referer(ref);
                }}
                apiCall={date => this.dateChangedApiCall(date)}
                navigateToSettings={() =>
                  this.props.navigation.navigate("Settings")
                }
                date={this.state.date}
              />
            </Body>
          </Header>
          {this.drawEditTable()}
          {this.refreshingSpinner()}
            <FlatList
              data={this.generateTable(this.state.maxDocs)}
              renderItem={({ item }) => item}
              refreshing={this.state.refresher}
              onRefresh={() => {
                this.onRefresher();
              }}
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
    fontSize: 15.5,
    height: 44
  }
});
