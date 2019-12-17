import * as soap from "soap-everywhere";
class Network {
  //TODO PORT SUPPORT

  static url = "http://vds.dental-soft.ru:2102/?wsdl";

  static async GetDates(token, id) {
    var __xmlattr = "<tokenId>" + token + "</tokenId><docId>" + id + "</docId>";
    return new Promise(resolve => {
      soap.createClient(this.url, function(err, client) {
        if(err!=null) throw "Create Client Error!"
        client.GetDates({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else{
            throw "Network Error!"
          }
        });
      });
    });
  }

  static async GetDocs(token, id) {
    var __xmlattr = "<tokenId>" + token + "</tokenId><docId>" + id + "</docId>";
    return new Promise(resolve => {
      soap.createClient(this.url, function(err, client) {
        if(err!=null) throw "Create Client Error!"
        client.GetDocs({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else{
            throw "Network Error!"
          }
        });
      });
    });
  }

  static async GetTimes(token, id, date) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>";
    return new Promise(resolve => {
      soap.createClient(this.url, function(err, client) {
        if(err!=null) throw "Create Client Error!"
        client.GetTimes({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else{
            throw "Network Error!"
          }
        });
      });
    });
  }

  static async GetDatesAll(token, id, date) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>";
    return new Promise(resolve => {
      soap.createClient(this.url, function(err, client) {
        if(err!=null) throw "Create Client Error!"
        client.GetDatesAll({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else{
            throw "Network Error!"
          }
        });
      });
    });
  }

  static async GetFio(token, id) {
    var __xmlattr = "<tokenId>" + token + "</tokenId><docId>" + id + "</docId>";
    return new Promise(resolve => {
      soap.createClient(this.url, function(err, client) {
        if(err!=null) throw "Create Client Error!"
        client.GetFio({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else{
            throw "Network Error!"
          }
        });
      });
    });
  }

  static async Reserv(token, id, date, time, fio, phone, mail) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>" +
      "<timez>" +
      time +
      "</timez>" +
      "<fio>" +
      fio +
      "</fio>" +
      "<cellphone>" +
      phone +
      "</cellphone>" +
      "<email>" +
      mail +
      "</email>";
    return new Promise(resolve => {
      soap.createClient(this.url, function(err, client) {
        if(err!=null) throw "Create Client Error!"
        client.Reserv({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else{
            throw "Network Error!"
          }
        });
      });
    });
  }
  static async Reserv2(token, id, date, time, fio, phone, mail, dr, pol) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>" +
      "<timez>" +
      time +
      "</timez>" +
      "<fio>" +
      fio +
      "</fio>" +
      "<cellphone>" +
      phone +
      "</cellphone>" +
      "<email>" +
      mail +
      "</email>" +
      "<dr>" +
      dr +
      "</dr>" +
      "<pol>" +
      pol +
      "</pol>";
    return new Promise(resolve => {
      soap.createClient(this.url, function(err, client) {
        if(err!=null) throw "Create Client Error!"
        client.Reserv2({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else{
            throw "Network Error!"
          }
        });
      });
    });
  }
}
module.exports = Network;