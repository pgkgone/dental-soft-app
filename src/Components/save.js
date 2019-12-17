/*import React from "react";
import { Text, View, FlatList,StyleSheet,TouchableOpacity,Image } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/FontAwesome'

  /*
    this.props.data = {
        date,  дд.мм.гггг для отображения в заголовке столбца
        cells : [{
          name, - Имя Фамилия посетителя
          doctorId - id доктора
        },
        
        ...
        ]  
    }
  */


export class AdminTimeTable extends React.Component {
  state = {headerIsDrawed : false}
  constructor(props) {
    super(props);
    this.data = this.props.navigation.state.params.data; //тут должен быть вызван initialApiCall(currentDate) 
    this.props.navigation.setParams({ headerTitle: () => <NavigationHeader apiCall={(date)=>this.dateChanged(date)} /> });
    this.listOfCells = this.TableFormatter(); 
}
  //устанавливаем stacknavigation header
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('headerTitle'),
      headerStyle: {
        backgroundColor: '#a52b2a',
      },
      headerTintColor: '#fff',
    };
  };

    /*
        Сортирует врачей в алфавитном порядке 
    */
    TableFormatter(){
        return this.data.cells.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        });
    }
    //тут нужно обновлять this.listOfCells т.к дата таблицы была изменена
    dateChanged(date){
      console.log('Дата поменялась нужно вызвать Api ' + date);
    }

    /*
      должен вызываться в конструкторе и возвращать this.props.data
    */
    initialApiCall(date)
    {

    }

    componentDidMount(){
      this.setState({headerIsDrawed : true})
    }
    render() {
      if(this.state.headerIsDrawed === true)
      {
      return (

        <View style={styles.container }>
          <FlatList
            data={this.listOfCells}
            keyExtractor={item => item.doctorId}
            numColumns={1}
            style={{flex : 1, alignSelf:'stretch', backgroundColor: '#f1fff0', }}
            renderItem={({item}) => { 
              var dataToSend = {
                data : {
                  name : item.name,
                  doctorId : item.doctorId,
                  date : this.data.date
                }
              }
              return(
              <TouchableOpacity onPress={() => this.props.navigation.navigate("AdminDoctorTimeTable", dataToSend)}>
                <Cell name={item.name}/>
              </TouchableOpacity>
            );}}
          />
        </View>
      );
              } else{
                return(
                    <View style={styles.container}>

                      </View>
                );
              }
    }
}
class Cell extends React.Component{
    render(){
      return (
          <View style={{flex: 1,flexDirection: 'row',borderWidth: 0.5, borderColor: 'black', height : '100%'}}>
            <View style={{flex : 1, padding : 20, flexDirection : 'row'}}>
              <View style={{width : '90%', alignSelf : 'center', flexDirection : 'column', justifyContent : 'center'}}>
                <Text style={styles.item}>{this.props.name}</Text>
              </View>
              <View style={{alignSelf : 'center', flexDirection : 'column', justifyContent : 'center'}}>
                <Image
                  style={{width: 28, height: 28}}
                  source={require('../Resources/right-arrow.png')}
                />
              </View>
            </View>
          </View>
      );
    }
  }
//<Icon name='right' size={28} />
class NavigationHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      currentDate : new Date().toISOString()
    };
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
 
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
 
  handleDatePicked = date => {
    this.setState({currentDate : date.toISOString()})
    this.props.apiCall(date.toISOString());
    this.hideDateTimePicker();
  };
  render(){
    return(
      <View style={{ flex : 1, flexDirection : 'row', justifyContent : 'center', alignSelf : 'center'}}>
              <TouchableOpacity style={{flexDirection : 'row', justifyContent : 'center'}} onPress={()=>{ this.showDateTimePicker()}}>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                />
                <View>
                  <Text style={{color : 'white', fontSize : 20}}>{this.state.currentDate.slice(0,10).replace(/-/g,".") + "  "}</Text>
                </View>
                <View>
                  <Icon2 name='calendar' size={24} color={'white'}/>
                </View>
              </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
   flex: 1,
    borderWidth: 0.5,
    borderColor: 'black'
  },
  item: {
    color:'#509ffa', 
    textDecorationLine: 'underline',
    flex: 1,
    fontSize: 18
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
})*/