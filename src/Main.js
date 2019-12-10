import React from 'react';
import {Text} from 'react-native';
import * as soap from 'soap-everywhere'
export class Main extends React.Component {
    state = {
        data: null,
    };

    /*async componentDidMount()
    {
        let data = await fetch('https://online.dental-soft.ru/docs_test.php?ID=demo&doc_name_demo=reg&doc_pass_demo=111');
        let response = await data.text();
        this.setState({data : response});
    }*/


    /*splitStringIntoWords(str){
        console.log('ok boomer');
        let strSplitted = str.split(":");
        var url = 'http://vds.dental-soft.ru:2102';
        var args = 
            {
                tokenId: '555',
                dic_id: 1
            };
        soap.createClient(url, function(err, client) 
        {
            client.GetDatesAll (args, function(err, result)
                {
                    console.log(result);
                }
            );
        });

*/

    async componentDidMount()
    {
        console.log('ok boomer12');
        var url = 'http://vds.dental-soft.ru:2102/wsdl?wsdl';
        var args = {
            message : [
            {
                part:{
                    attributes: {
                        name : 'tokenId',
                        type : 'xsd:string',
                        valueKey: 555,
                      }
                        
                }
            },
            {
                part:{
                    attributes: {
                        name : 'docId',
                        type : 'xsd:int',
                        valueKey: 1,
                    },
                }
            }
        ]};
        soap.createClient(url, function(err, client) 
        {
            client.GetDates(args, function(err, result)
                {
                    console.log(result);
                    this.setState({data : result});
                }
            );
        });
    }

    render(){
        if(this.state.data === null)
        {
            return <Text> Loading </Text>
        }
        else
        {
            this.splitStringIntoWords(this.state.data)
            console.log(this.state.data);
            return <Text> Data </Text>
        }
    }
    
}