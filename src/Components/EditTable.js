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
import { Button } from "native-base";
export class EditTable extends React.Component {
    state = {
      visitNum : "Первое посещение",
      time : this.props.data.time,
      doctorId : this.props.data.doctorId,
      date : this.props.data.date,
      prim : this.props.data.prim,
      mk : this.props.data.mk,
      nvr : this.props.data.nvr,
      kab : this.props.data.kab
    };
  
    onChangeprim(txt) {
      this.setState({ prim: txt });
    }
    onChangeTime(txt) {
      this.setState({ nvr: txt });
    }
    onChangeCabinet(txt) {
      this.setState({ kab: txt });
    }
    render() {
      return (
        <Modal animationType="fade" transparent={true} visible={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View style={{ width: "75%", backgroundColor: "#f1fff0" }}>
              <View
                style={{
                  backgroundColor: "#a52a2a",
                  color: "white",
                  fontSize: 14,
                  flexDirection: "row",
                  justifyContent: "center",
                  padding: 10
                }}
              >
                <Text style={{ color: "white", fontSize: 18 }}>
                  {this.state.date + " " + this.state.time}
                </Text>
              </View>
              <View style={styles.editBoxItemView}>
                <Text style={styles.editBoxItem}>Описание:</Text>
                <TextInput
                  style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    fontSize: 16
                  }}
                  onChangeText={text => this.onChangeprim(text)}
                  value={this.state.prim}
                />
              </View>
              <View style={styles.editBoxItemView}>
                <Text style={styles.editBoxItem}>Норма (мин.)</Text>
                <TextInput
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
                <Text style={styles.editBoxItem}>№ кабинета:</Text>
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
                    justifyContent: "center",
                    backgroundColor: "black"
                  }}
                >
                  <Button
                    onPress={() => {
                      this.props.closeFun(this.state);
                    }}
                    style={{ backgroundColor: "#a52a2a" }}
                  >
                    <Text style={{ color: "white", padding: 10 }}>Сохранить</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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