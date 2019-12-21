import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { Container, Header, Body } from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon2 from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import Network from '../Utils/Networking'
import {NavigationHeader} from "../Components/NavigationHeader"
/*

    формат данных для вывода

    listOfCells = [{
          name, - Имя Фамилия доктора
          doctorId - id доктора
        },
        
        ...
        ]  
    
    пример реализации

    var arrayOfDocID : [doc_id] = GetDocsAll(token, date)
    var listOfCells = arrayOfDocID.map((item) => {
        data = {
          doctorId : item,
          name :  GetFio(token, item) //async?
        }
      });

    API интеграция

    initialApiCall(date) - вызов API на сегодняшнюю дату
    dateChangedApiCall(date) - callback для datepicker'a вызывает API при изменении даты пользователем

    по клику на ячейку вызывается AdminDoctorTimeTable с параметрами name (используется для быстрого рендера header'a), data, doctorId
  */

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
  state={
    listOfCells:null,
    curr_date:new Date().toISOString()
  }
  /*
        Сортирует врачей в алфавитном порядке 
    */

  TableFormatter() {
    return this.data.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  /*
      тут нужно обновлять this.listOfCells т.к дата таблицы была изменена
      !возможно не будет обновлять т.к. не является переменной state'a!
    */
  dateChangedApiCall(date) { 
    console.log("Дата поменялась нужно вызвать Api " + date);
    this.setState({curr_date:date})
    console.log(this.state.curr_date)
    this.initialApiCall(date.slice(0, 10).replace(/-/g, "-"))
  }

  /*
      должен вызываться в конструкторе и возвращать this.props.data
    */
   async initialApiCall(date) {
    var response =await Network.GetDocsAll("555",date)
    this.data = response.rows.row.map((item) => {data={doctorId:item.id, name:item.name};return data})
    this.setState({listOfCells:this.TableFormatter()})  
  }


  async componentDidMount() {
    await Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    console.log("test")
    await this.initialApiCall(this.state.curr_date.slice(0, 10).replace(/-/g, "-"))
    this.setState({ loading: false });
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
            <NavigationHeader date={this.state.curr_date} apiCall={date => this.dateChangedApiCall(date)} navigateToSettings={() => this.props.navigation.navigate("Settings")}/>
          </Body>
        </Header>
        <View style={styles.container}>
          <FlatList
            data={this.state.listOfCells}
            keyExtractor={item => item.doctorId}
            numColumns={1}
            style={{
              flex: 1,
              alignSelf: "stretch",
              backgroundColor: "#f1fff0"
            }}
            renderItem={({ item }) => {
              var dataToSend = {
                data: {
                  name: item.name,
                  doctorId: item.doctorId,
                  date: this.state.curr_date
                }
              };
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate(
                      "AdminDoctorTimeTable",
                      dataToSend
                    )
                  }
                >
                  <Cell name={item.name} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Container>
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
          borderColor: "black",
          height: "100%"
        }}
      >
        <View style={{ flex: 1, padding: 20, flexDirection: "row" }}>
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Text style={styles.item}>{this.props.name}</Text>
          </View>
          <View
            style={{
              alignSelf: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Image
              style={{ width: 28, height: 28 }}
              source={require("../Resources/right-arrow.png")}
            />
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
  }
});
