import React from "react";
import { Text, View, FlatList,StyleSheet } from "react-native";
import {DoctorTimeTable} from './Components/DoctorTimeTable'
export class Main extends React.Component {
  data =  {
    dates : [{
      date : '11.12.1212',
      cells : [{
        visitNum : 'Первое посещение 11 12',
        name : 'Иван Иванов',
        time : '11:00',
      }
    ]  
  }
]
}
    render() {
      return (
        <DoctorTimeTable data={this.data} />
      );
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
