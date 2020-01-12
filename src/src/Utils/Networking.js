import { Alert } from "react-native";
class Network {
  //TODO PORT SUPPORT

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static timeout = 16000;
  static getUrl(url, port) {
    return "http://" + url + ":" + port;
  }

  static async GetDocsAll(token, date, url, port, timeout) {
    //await this.sleep(timeout);
    var body ='<?xml version="1.0" encoding="UTF-8"?>\r\n<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:grvssl" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:GetDocsAll><tokenId xsi:type="xsd:string">'+token+'</tokenId><datez xsi:type="xsd:string">'+date+'</datez></ns1:GetDocsAll></SOAP-ENV:Body></SOAP-ENV:Envelope>\r\n';
    console.log(body);
    const axios = require("axios");
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: this.getUrl(url, port),
        timeout: 15000, // Wait for 15 seconds
        data: body,
        headers: {
          "User-Agent": "PHP-SOAP/7.0.33-0+deb9u6",
          Host: url + ":" + port,
          "Connection":"Keep-Alive",
          "Content-Type":"text/xml; charset=utf-8",
          "SOAPAction": "",
          "Content-Length": body.length
        }
      })
        .then(response => {
          var d = response.data;
          var index = d.indexOf("<rows>");
          var parsed = d.substr(index, d.indexOf("</rows>") - index + 7);
          var xml2js = require("xml2js");
          var parser = new xml2js.Parser({ explicitArray: false });
          parser.parseString(parsed, function(err, result) {
            resolve(result);
          });
        })
        .catch(error => {
          reject(new Error("Error"));
        });
    });
  }

  static async GetTimesAll(token, id, date, url, port, timeout, tryc=0) {
    //await this.sleep(timeout);
    var body ='<?xml version="1.0" encoding="UTF-8"?>\r\n<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:grvssl" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:GetTimesAll><tokenId xsi:type="xsd:string">'+token+'</tokenId><docId xsi:type="xsd:int">'+id+'</docId><datez xsi:type="xsd:string">'+date+'</datez></ns1:GetTimesAll></SOAP-ENV:Body></SOAP-ENV:Envelope>\r\n';
    console.log(date)
    const axios = require("axios");
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: this.getUrl(url, port),
        timeout: 5000, // Wait for 5 seconds
        data: body,
        headers: {
          "User-Agent": "PHP-SOAP/7.0.33-0+deb9u6",
          Host: url + ":" + port,
          "Connection":"Keep-Alive",
          "Content-Type":"text/xml; charset=utf-8",
          "SOAPAction": "",
          "Content-Length": body.length
        }
      })
        .then(response => {
          console.log("gotted response")
          var d = response.data;
          if(d===undefined|| d===null) reject(new Error("err"))
          var index = d.indexOf("<rows>");
          var parsed = d.substr(index, d.indexOf("</rows>") + 7 - index);
          var xml2js = require("xml2js");
          var parser = new xml2js.Parser({ explicitArray: false });
          parser.parseString(parsed, function(err, result) {
            if(err!=null){
              console.log(response.data)
            reject(err)
            }
            resolve(result);
          });
        })
        .catch(error => {
          console.log("ОШИБКА-"+error)
          if(error.toString().includes("Request failed with status code 400")||error.toString().includes("timeout") ){
            if(tryc<=3){
              console.log("Поймал и дал шанс")
              resolve(this.GetTimesAll(token, id, date, url, port, timeout, tryc+1))
            } else{
              reject(error);
            }
          } else{
            reject(error)
          }
        });
    });
  }

  static async GetDatesAll(token, id, date, url, port, timeout) {
    //await this.sleep(timeout)await this.sleep(timeout);

  
    var body ='<?xml version="1.0" encoding="UTF-8"?>\r\n<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:grvssl" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:GetDatesAll><tokenId xsi:type="xsd:string">'+token+'</tokenId><docId xsi:type="xsd:int">'+id+'</docId><datez xsi:type="xsd:string">'+date+'</datez></ns1:GetDatesAll></SOAP-ENV:Body></SOAP-ENV:Envelope>\r\n';
      console.log(body)
    const axios = require("axios");
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: this.getUrl(url, port),
        timeout: 15000, // Wait for 15 seconds
        data: body,
        headers: {
          "User-Agent": "PHP-SOAP/7.0.33-0+deb9u6",
          Host: url + ":" + port,
          "Connection":"Keep-Alive",
          "Content-Type":"text/xml; charset=utf-8",
          "SOAPAction": "",
          "Content-Length": body.length
        }
      })
        .then(response => {
          var d = response.data;
          var index = d.indexOf("<rows>");
          var parsed = d.substr(index, d.indexOf("</rows>") - index + 7);
          var xml2js = require("xml2js");
          var parser = new xml2js.Parser({ explicitArray: false });
          parser.parseString(parsed, function(err, result) {
            resolve(result);
          });
        })
        .catch(error => {
          reject(new Error("Error"));
        });
    });
  }

  static async EditGrvData2(
    token,
    id,
    date,
    time,
    mk,
    prim,
    nvr,
    kab,
    url,
    port,
    timeout
  ) {
    //await this.sleep(timeout);
    var body =
      '<?xml version="1.0" encoding="UTF-8"?>\r\n<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope"><Body><EditGrvData xmlns="urn:grvssl"><tokenId>' +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez><timez>" +
      time +
      "</timez><mk>" +
      mk +
      "</mk><prim>" +
      prim +
      "</prim><nvr>" +
      nvr +
      "</nvr><kab>" +
      kab +
      "</kab></EditGrvData></Body></Envelope>\r\n";

    console.log(body);
    const axios = require("axios");
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: this.getUrl(url, port),
        timeout: 15000, // Wait for 15 seconds
        data: body,
        headers: {
          "User-Agent": "PHP-SOAP/7.0.33-0+deb9u6",
          Host: url + ":" + port,
          "Connection":"Keep-Alive",
          "Content-Type":"text/xml; charset=utf-8",
          "SOAPAction": "",
          "Content-Length": body.length
        }
      })
        .then(response => {
          var d = response.data;
          console.log(d)
          resolve(d);
        })
        .catch((error) => {
          console.log(error.response.data)
          var d = error.response.data;
          reject(d);
          });
    });
  }

  static async DeleteGrvData(token, id, date, time, url, port, timeout) {
    //await this.sleep(timeout);
    var body =
      '<?xml version="1.0" encoding="UTF-8"?>\r\n<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope"><Body><DeleteGrvData xmlns="urn:grvssl"><tokenId>' +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez><timez>" +
      time +
      "</timez></DeleteGrvData></Body></Envelope>\r\n";
    console.log(body);

    console.log(body);
    const axios = require("axios");
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: this.getUrl(url, port),
        timeout: 15000, // Wait for 15 seconds
        data: body,
        headers: {
          "User-Agent": "PHP-SOAP/7.0.33-0+deb9u6",
          Host: url + ":" + port,
          "Connection":"Keep-Alive",
          "Content-Type":"text/xml; charset=utf-8",
          "SOAPAction": "",
          "Content-Length": body.length
        }
      })
        .then(response => {
          var d = response.data;
          if (d.includes("STATE-OK")) {
            Alert.alert(
              "Ок",
              "Успешно изменено, данные обновляются",
              [{ text: "OK", onPress: () => {} }],
              { cancelable: true }
            );
          } else {
            Alert.alert(
              "Ошибка",
              "Невозможно удалить запись",
              [{ text: "OK", onPress: () => {} }],
              { cancelable: true }
            );
          }
          resolve(d);
        })
        .catch((error) => {
          console.log(error)
          var d = error.response.data;
          if (d.includes("STATE-OK")) {
            Alert.alert(
              "Ок",
              "Успешно изменено, данные обновляются",
              [{ text: "OK", onPress: () => {} }],
              { cancelable: true }
            );
          } else {
            Alert.alert(
              "Ошибка",
              "Невозможно удалить запись или превышен лимит ожидания ответа от сервера",
              [{ text: "OK", onPress: () => {} }],
              { cancelable: true }
            );
          }
          reject(new Error("Error"));
        });
    });
 
  }

  static async GetGrvData(token, id, date, time, url, port, timeout) {
    //await this.sleep(timeout);
    var body =
      '<?xml version="1.0" encoding="UTF-8"?>\r\n<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope"><Body><GetGrvData xmlns="urn:grvssl"><tokenId>' +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez><timez>" +
      time +
      "</timez></GetGrvData></Body></Envelope>\r\n";
    console.log(body);
    const axios = require("axios");
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: this.getUrl(url, port),
        timeout: 15000, // Wait for 15 seconds
        data: body,
        headers: {
          "User-Agent": "PHP-SOAP/7.0.33-0+deb9u6",
          Host: url + ":" + port,
          "Connection":"Keep-Alive",
          "Content-Type":"text/xml; charset=utf-8",
          "SOAPAction": "",
          "Content-Length": body.length
        }
      })
        .then(response => {
          var d = response.data;
          var index = d.indexOf('coding">');
          console.log(index);
          console.log(d.indexOf("</ns:grvdata>"));
          var parsed = d.substr(
            index + 8,
            d.indexOf("</ns:grvdata>") - index - 8
          );
          console.log(parsed);
          var xml2js = require("xml2js");
          var parser = new xml2js.Parser({ explicitArray: false });
          parsed = "<data>" + parsed + "</data>";
          parser.parseString(parsed, function(err, result) {
            resolve(result);
          });
        })
        .catch(error => {
          reject(new Error("Error"));
        });
    });
  }
}
module.exports = Network;
