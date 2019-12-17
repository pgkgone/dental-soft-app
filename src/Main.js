import React from "react";
import { Text, View, FlatList,StyleSheet } from "react-native";
import {AdminTimeTable} from "./Components/AdminTimeTable"
export class Main extends React.Component {
  data =  {
      date : '11.12.1212',
      cells : [{
        name : 'Сидоров Сидор Сидорович',
        doctorId : '1',
      },
      {
        name : 'Сорокин Илья Петрович',
        doctorId : '2',
      },{
        name : 'Сидоров Сидор Сидорович',
        doctorId : '3',
      },
      {
        name : 'Сорокин Илья Петрович',
        doctorId : '11',
      },{
        name : 'Сидоров Сидор Сидорович',
        doctorId : '12',
      },
      {
        name : 'Сорокин Илья Петрович',
        doctorId : '13',
      },
      {
        name : 'Сидоров Сидор Сидорович',
        doctorId : '16',
      },
      {
        name : 'Сорокин Илья Петрович',
        doctorId : '17',
      },{
        name : 'Сидоров Сидор Сидорович',
        doctorId : '18',
      }
    ]  
}
    render() {
      return(this.props.navigation.navigate("AdminTimeTable", {data : this.data}));
    }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22,
    borderWidth: 0.5,
    borderColor: 'black'
  },
  item: {
    color:'blue', 
    textDecorationLine: 'underline',
    textAlign: 'center',
    flex: 0.5,
    fontSize: 13,
  },
  header: {
    color:'white',
    flexDirection: 'row',
    textAlign: 'center',
    flex: 0.5,
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
