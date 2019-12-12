import React from "react";
import { Text, View, FlatList,StyleSheet } from "react-native";
export class DoctorTimeTable extends React.Component {

  /*
    this.props.data = {
      dates : [{
        date,  дд.мм.гггг для отображения в заголовке столбца
        cells : [(
          visitNum, - Номер посещения
          name, - Имя Фамилия посетителя
          time - время визита
        ),
        ...
        ]  
      },
        ...
      ]
    }
  */
    constructor(props) {
        super(props);
        this.tableHeader = <FlatList 
            data = {
                this.props.data.dates.map(
                    (item) => 
                        {
                            var dataArr = {key : item.date};
                            return dataArr
                        }
                )
            }
            numColumns={this.props.data.dates.length}
            style={{flex : 1, alignSelf:'stretch', backgroundColor:'#a52b2a'}}
            renderItem={
                ({item}) => (
                    <Text style={styles.header} >{item.key}</Text>
                )
            }
        />;
        this.listOfCells = this.TableFormatter();
    }
    /*
        Метод приводящий массив json'ов к нужному виду (массив чередующихся по неделям ячеек)
    */
    TableFormatter(){
        var Cells = [];
        var listOfColumns = this.props.data.dates.map((item) => item.cells);
        var longestArray = Math.max.apply(null, listOfColumns.map((item) => item.length));
        for(var i = 0; i < longestArray * this.props.data.dates.length; i++)
        {
            Cells.push(
                {
                    key : i,
                    name : '',
                    visitNum : '',
                    time : ''
                }
            )
        }
        for(var i = 0; i < listOfColumns.length; i++)
        {
            listOfColumns[i].map(
                (item,index) => 
                    {
                        var newCell = {
                            key : Cells[i + (listOfColumns.length)*index].key,
                            name : item.name,
                            visitNum : item.visitNum,
                            time : item.time
                        }
                        Cells[i + (listOfColumns.length)*index] = newCell
                    }
            );
        }
        return Cells;
    }

    render() {
      return (
        <View style={styles.container }>
          <FlatList
            data={this.listOfCells}
            keyExtractor={item => item.key}
            numColumns={this.props.data.dates.length}
            ListHeaderComponent={this.tableHeader} 
            style={{flex : 1, alignSelf:'stretch', backgroundColor: '#f1fff0', }}
            renderItem={({item}) => <Cell name={item.name} time={item.time} visitNum={item.visitNum} />}
          />
        </View>
      );
    }
}
class Cell extends React.Component{
    render(){
      return (
        <View style={{flex: 1,flexDirection: 'row',borderWidth: 0.5, borderColor: 'black'}}>
          <View style={{width:'30%',flexDirection: 'column', justifyContent: 'center', }}>
            <View>
              <Text style={styles.item}>{this.props.time}</Text>
            </View>
          </View>
          <View style={{width:'70%',flexDirection: 'column'}}>
            <View style={{flex: 1, flexDirection: 'column',justifyContent: 'flex-end', paddingTop: 12, paddingBottom: 5}}>
                <Text style={styles.item}>{this.props.name}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'column',justifyContent: 'flex-start', paddingBottom:12, paddingTop : 5}}>
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

//Example Data
/*
    data =  {
    dates : [{
      date : '11.12.1212',
      cells : [{
        visitNum : 'Первое посещение 11 12',
        name : 'Иван Иванов',
        time : '11:00',
      },
      {
        visitNum : 'Первое посещение',
        name : 'Иван Иванов',
        time : '11:00',
      },
      {
        visitNum : 'Первое посещение 11 12',
        name : 'Иван Иванов',
        time : '11:00',
      },
      {
        visitNum : 'Первое посещение',
        name : 'Иван Иванов',
        time : '11:00',
      }
    ]  
  },
  {
    date : '12.13.1212',
    cells : [{
      visitNum : 'Первое посещение 12 13',
      name : 'Иван Иванов',
      time : '11:00',
    }
  ]  
},
{
  date : '10.13.1212',
  cells : [{
    visitNum : 'Первое посещение 12 13',
    name : 'Иван Иванов',
    time : '11:00',
  },
  {
    visitNum : 'Первое посещение 12 13',
    name : 'Иван Иванов',
    time : '11:00',
  }
]  
}
  ]
}
*/