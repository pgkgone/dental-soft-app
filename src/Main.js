import React from "react";
import { Text } from "react-native";
import * as soap from "soap-everywhere";
import * as xml from 'react-native-xml2js'
import * as xml2 from 'react-xml-parser'
export class Main extends React.Component {
  state = {
    data: null
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

  async componentDidMount() {
    console.log("!!json!!!")
    //var url = "http://vds.dental-soft.ru:2102/?wsdl";
    
    /*let data = await fetch(url, {
      method: "POST",
      body: '<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope"><Body> <GetDates xmlns="urn:grvssl"><tokenId>555</tokenId><docId>1</docId></GetDates></Body></Envelope>'
    })
      .then(
        response => response.text()
      )
      .then(html => html);
*/
    //var url = "https://webhook.site/fc9d04fe-1695-4cac-9e88-28c77a0d742e";
    var url = "http://vds.dental-soft.ru:2102/?wsdl";
    var __xmlattr = '<tokenId>555</tokenId><docId>1</docId>';
    var args = {tokenId : '555', docId : 1};
    soap.createClient(url, function(err, client) {
        client.GetDates({_xml: __xmlattr}, function(err, result) {
            console.log(result);
        })
  });
  }

  render() {
    if (this.state.data === null) {
      return <Text> Loading </Text>;
    } else {
      return <Text> {this.state.data} </Text>;
    }
  }
}
