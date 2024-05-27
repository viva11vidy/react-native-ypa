export default {
  appConfig: {
    // apiUrl: 'http://localhost:3040/api/',
    // apiUrl: 'http://192.168.0.164:3040/api/',
    // apiUrl: 'https://ypa.dtsdev.xyz:3000/api/',
    apiUrl: 'https://ypacademy.co.uk:3000/api/',
  },

  get(key) {
    return this[key];
  },

  getError(error){
    // console.log('dfgdgd', error.response);
    
    var errMsg = '';

    try {
      if (error.response) {
        /*
        * The request was made and the server responded with a
        * status code that falls out of the range of 2xx
        */
        // console.log(error.response.status);
        // console.log(error.response.data);
        if(typeof error.response.data == 'string' && this.isJsonString(error.response.data)) {
          error.response.data = JSON.parse(error.response.data);
        }

        if(typeof error.response.data == 'object') {
          var errorData = null;
          if(typeof error.response.data['errors'] != typeof undefined) {
            errorData = error.response.data['errors'];
            
          } else if(typeof error.response.data['error'] != typeof undefined) {
            errorData = error.response.data['error'];
          }
          if(errorData) {
            if(typeof errorData[0] != 'string'){
              if(typeof errorData[0].msg == 'string'){
                errMsg = errorData[0].msg;
              } else {
                if(typeof errorData[0].msg.alias != typeof undefined) {
                  errMsg = errorData[0].msg.alias;
                }
              }
            } else {
              errMsg = errorData;  
            }
          }
        } else {
          errMsg = error.toJSON().message;
        }
      } else if (error.request) {
        /*
        * The request was made but no response was received, `error.request`
        * is an instance of XMLHttpRequest in the browser and an instance
        * of http.ClientRequest in Node.js
        */
        // console.log(error.request);
        errMsg = error.toJSON().messsage;
      } else {
        // Something happened in setting up the request and triggered an Error
        // console.log('Error', error.message);
        errMsg = error.toJSON().messsage;
      }
    } catch(err) {
      
    }

    
    return errMsg;
  },

  isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  },

  getCountryShortNameFromLongName(longName) {
    let shortName = 'IN';
    let countries = [
      {shortName: 'IN', longName: 'India'},
      {shortName: 'IN', longName: 'india'},
      {shortName: 'IN', longName: 'IND'},
      {shortName: 'IN', longName: 'IN'},
      {shortName: 'AE', longName: 'United Arab Emirates'},
      {shortName: 'AE', longName: 'united arab emirates'},
      {shortName: 'AE', longName: 'UAE'},
      {shortName: 'AE', longName: 'AE'},
      {shortName: 'QA', longName: 'Qatar'},
      {shortName: 'QA', longName: 'qatar'},
      {shortName: 'QA', longName: 'QAT'},
      {shortName: 'QA', longName: 'QA'},
      {shortName: 'OM', longName: 'Oman'},
      {shortName: 'OM', longName: 'oman'},
      {shortName: 'OM', longName: 'OMN'},
      {shortName: 'OM', longName: 'OM'},
    ];
    let selectedIndex = countries.findIndex(country => country.longName == longName);
    if(selectedIndex !== -1) {
      shortName = countries[selectedIndex].shortName;
    }
    return shortName;
  },

  getCurrencyFromCountryShortName(shortName) {
    let currency = 'INR';
    let countries = [
      {shortName: 'IN', currency: 'INR'},
      {shortName: 'AE', currency: 'AED'},
      {shortName: 'QA', currency: 'QAR'},
      {shortName: 'OM', currency: 'OMR'},
    ];
    let selectedIndex = countries.findIndex(country => country.shortName == shortName);
    if(selectedIndex !== -1) {
      currency = countries[selectedIndex].currency;
    }
    return currency;
  },

  getCountry(addrComponents) {
    for (var i = 0; i < addrComponents.length; i++) {
      if (addrComponents[i].types.includes("country")) {
        return {short_name: addrComponents[i].short_name, long_name: addrComponents[i].long_name};
      }
    }
    return false;
  },

  getArea(addrComponents) {
    addrComponents.reverse();
    let areaParts = ['', ''];
    for (var i = 0; i < addrComponents.length; i++) {
      if (addrComponents[i].types.includes("administrative_area_level_1")) {
        areaParts[1] = addrComponents[i].short_name;
      }
      if (addrComponents[i].types.includes("administrative_area_level_2")) {
        areaParts[1] = addrComponents[i].long_name;
      }
      if (addrComponents[i].types.includes("locality")) {
        areaParts[0] = addrComponents[i].long_name;
      }
      if (addrComponents[i].types.includes("sublocality")) {
        areaParts[0] = addrComponents[i].long_name;
      }
      if (addrComponents[i].types.includes("neighborhood")) {
        areaParts[0] = addrComponents[i].long_name;
      }
    }
    if(areaParts[0] == 0) {
      areaParts.shift();
    }
    return areaParts.join(', ').trim();
  },

  getDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  },



}




