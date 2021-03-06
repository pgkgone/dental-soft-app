import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ScrollView,
  TextInput
} from "react-native";
import { Button } from "native-base";
import Network from "../Utils/Networking";
import DeleteIcons from "react-native-vector-icons/Feather";
import CancelIcons from "react-native-vector-icons/Entypo";
import * as SecureStore from "expo-secure-store";
export class EditTable extends React.Component {
  state = {
    visitNum: this.props.data.prim,
    time: this.props.data.time,
    doctorId: this.props.data.doctorId,
    date: this.props.data.date,
    prim: this.props.data.visitNum,
    mk: "",
    nvr: "",
    kab: "",
    token: this.props.data.token,
    timeout:50,
    loading: true,
    url: this.props.data.url,
    port: this.props.data.port,
    deleteTime:this.props.data.time,
    isCurrentDay:(new Date().getDate() === new Date(this.props.data.date).getDate() && new Date().getMonth() === new Date(this.props.data.date).getMonth())
  };

  async getData() {
    console.log(this.state)
    return await Network.GetGrvData(
      this.state.token,
      this.state.doctorId,
      this.state.date,
      this.state.time,
      this.state.url,
      this.state.port,
      this.state.timeout
    );
  }
  
  changer(){
    if(Object.entries(this.state.fio).length != 0){
      console.log("changed")
      this.setState({visitNum:this.state.prim})
    }
  }
  async componentDidMount() {
    var p = await SecureStore.getItemAsync("timeout");
    this.setState({timeout:Number(p) });
    if(this.state.visitNum==undefined){
      this.setState({visitNum:""})
    }
    if(this.state.prim==undefined){
      this.setState({prim:""})
    }
    var response = await this.getData();
    console.log(response);
    this.setState({
      kab: response.data.kab,
      nvr: response.data.nvr.toString(),
      fio: response.data.fio==""?new Object(): response.data.fio,
      mk: response.data.mk==""?new Object():response.data.mk
    },()=>{this.changer()});

    console.log(this.state);
    this.setState({ loading: false });
  }

  onChangeprim(txt) {
    this.setState({ visitNum: txt });
  }
  onChangeTime(txt) {
    this.setState({ nvr: txt });
  }
  onChangeCabinet(txt) {
    this.setState({ kab: txt });
  }
  onChangeTimeS(txt){
    this.setState({time:txt})
  }
  render() {
    if (this.state.loading) {
      return <View></View>;
    } else
      return (
        <Modal animationType="fade" transparent={true} visible={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingTop : 8
            }}
          >
            <View style={{ width: "75%", backgroundColor: "#f1fff0" }}>
            
              <View
                style={{
                  backgroundColor: (this.state.isCurrentDay)?"#1B73B3":"#a52a2a",
                  color: "white",
                  fontSize: 14,
                  flexDirection: "row",
                  padding: 10
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                >
                  <DeleteIcons
                    name="trash"
                    size={22}
                    color={"white"}
                    onPress={() =>{this.props.deleteFunc(this.state)}}
                  />
                </View>
                <View
                  style={{
                    felx: 1,
                    alignSelf: "center",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {this.state.date + " " + this.state.time}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                >
                  <CancelIcons
                    name="cross"
                    size={26}
                    color={"white"}
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => this.props.closeFun()}
                  />
                </View>
              </View>
              <View style={{height : 'auto'}}>
              <ScrollView>
              <HiddenBox value={this.state.mk} title={"Номер карты:"}/>
              <HiddenBox value={this.state.fio} title={"ФИО:"}/>
              <View style={styles.editBoxItemView}>
                <Text style={styles.editBoxItem}>Описание: </Text>
                <TextInput
                  style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    fontSize: 16
                  }}
                  onChangeText={text => this.onChangeprim(text)}
                  value={this.state.visitNum}
                />
              </View>
              <View style={styles.editBoxItemView}>
                <Text style={styles.editBoxItem}>Время: </Text>
                <TextInput
                  style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    fontSize: 16
                  }}
                  onChangeText={text => this.onChangeTimeS(text)}
                  value={this.state.time}
                />
              </View>

              <View style={styles.editBoxItemView}>
                <Text style={styles.editBoxItem}>Норма (мин.): </Text>
                <TextInput
                keyboardType={"numeric"}
                  style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    fontSize: 16
                  }}
                  onChangeText={text => this.onChangeTime(text)}
                  value={this.state.nvr}
                />
              </View>
              <View style={styles.editBoxItemView}>
                <Text style={styles.editBoxItem}>№ кабинета: </Text>
                <TextInput
                  style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    fontSize: 16
                  }}
                  onChangeText={text => this.onChangeCabinet(text)}
                  value={this.state.kab}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  padding: 15
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <Button
                    onPress={() => {
                      this.props.saveFun(this.state);
                    }}
                    style={{ backgroundColor:(this.state.isCurrentDay)?"#1B73B3":"#a52a2a" }}
                  >
                    <Text style={{ color: "white", padding: 10 }}>
                      Сохранить
                    </Text>
                  </Button>
                </View>
              </View>
              </ScrollView>
              </View>  
            </View>
          </View>
        </Modal>
      );
  }
}
export class HiddenBox extends React.Component {
  render() {
    if((Object.entries(this.props.value).length === 0 && this.props.value.constructor === Object) ||this.props.value==="")
    {
    return (
      <View></View>
    );
        }else{
          return( <View style={styles.editBoxItemView}>
            <Text style={{fontSize : 18, color : 'gray'}}>{this.props.title}</Text>
            <TextInput
              style={{
                height: 40,
                borderBottomWidth: 1,
                borderBottomColor: "gray",
                fontSize: 16,
                color : 'gray'
              }}
              editable={false}
              value={this.props.value}
            />
          </View>);
        }
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