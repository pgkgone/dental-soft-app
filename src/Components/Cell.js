import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
export class Cell extends React.Component {
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
              justifyContent: "center"
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