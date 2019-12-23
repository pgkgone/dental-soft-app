import * as soap from "soap-everywhere";
class Network {
  //TODO PORT SUPPORT

  static url = "http://vds.dental-soft.ru:2102/?wsdl";
  static getUrl(url,port){
    return "http://"+url+":"+port+"/?wsdl"
  }
  static async GetDates(token, id,url,port) {
    var __xmlattr = "<tokenId>" + token + "</tokenId><docId>" + id + "</docId>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetDates({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

  static async GetDocs(token, id,url,port) {
    var __xmlattr = "<tokenId>" + token + "</tokenId><docId>" + id + "</docId>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetDocs({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

  static async GetDocsAll(token, date,url,port) {
    console.log("Enter req");
    var __xmlattr =
      "<tokenId>" + token + "</tokenId><datez>" + date + "</datez>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetDocsAll({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

  static async GetTimes(token, id, date,url,port) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetTimes({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

  static async GetTimesAll(token, id, date,url,port) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetTimesAll({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

  static async GetDatesAll(token, id, date,url,port) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetDatesAll({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

  static async GetDates(token, id, date,url,port) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetDates({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }


  static async EditGrvData(token, id, date, time,mk,prim,nvr,kab,url,port) {
    if(Object.entries(mk).length === 0 && mk.constructor === Object){
      mk=""
    }
    console.log("here")
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez>"+"<timez>"+time+"</timez>"+"<mk>"+mk+"</mk>"+"<prim>"+prim+"</prim>"+"<nvr>"+nvr+"</nvr>"+"<kab>"+kab+"</kab>";
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.EditGrvData({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
          } else {
            throw "Network Error!";
          }
        });
      });
  }

  static async DeleteGrvData(token, id, date, time,url,port){
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez><timez>" +
      time +
      "</timez>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.DeleteGrvData({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }
  
  static async GetGrvData(token, id, date, time,url,port) {
    var __xmlattr =
      "<tokenId>" +
      token +
      "</tokenId><docId>" +
      id +
      "</docId><datez>" +
      date +
      "</datez><timez>" +
      time +
      "</timez>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetGrvData({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

  static async GetFio(token, id,url,port) {
    var __xmlattr = "<tokenId>" + token + "</tokenId><docId>" + id + "</docId>";
    return new Promise(resolve => {
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.GetFio({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

  static async Reserv(token, id, date, time, fio, phone, mail,url,port) {
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
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.Reserv({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }
  static async Reserv2(token, id, date, time, fio, phone, mail, dr, pol,url,port) {
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
      soap.createClient(this.getUrl(url,port), function(err, client) {
        if (err != null) throw "Create Client Error!";
        client.Reserv2({ _xml: __xmlattr }, function(err, result) {
          if (err == null) {
            resolve(result);
          } else {
            throw "Network Error!";
          }
        });
      });
    });
  }

}
module.exports = Network;
