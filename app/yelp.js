var oauthSig = require('oauth-signature');
var nonce = require('nonce');
var request = require('request');

module.exports = function(set_parameters, callback) {
    var httpMethod = 'GET';
    
    var url = 'http://api.yelp.com/v3/businesses/search';
    
    var parameters = Object.assign(set_parameters);
    
    var queryString = ""
    
    var props = Object.getOwnPropertyNames(parameters);
    console.log(props)
    
   props.sort();
    
    for (var prop in props) {
        queryString += props[prop];
        queryString += "=";
        queryString += parameters[props[prop]];
        queryString += "&";
    }
    
    queryString = queryString.substring(0,queryString.length-1);
    
    var apiURL = url+"?"+queryString;

    var options = {
        url: apiURL,
        headers: {
            "Authorization": "Bearer " + "ez6_89Txowr3DnBOaNV9ZR63YER0C7djbUm6g3PUz7bgHUmXhJtl7nv3rVt_Wpe3tPDzSwQObAnge69ulGsswxciwH_631Zr9dlseJKkV4o6UCm5Uk0i3PQm7_WhW3Yx"
        }
    }
    
    request(options, function(error, response, body) {
        return callback(error, response, body);
    })
}