var oauthSig = require('oauth-signature');
var nonce = require('nonce');
var request = require('request');

module.exports = function(set_parameters, callback) {
    var httpMethod = 'GET';
    
    var url = 'http://api.yelp.com/v2/search';
    
    var required_parameters = {
        oauth_consumer_key: "8KlxvTw9Xu72M3GD9TEE9w",
        oauth_nonce: (nonce())(),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: (nonce())().toString().substr(0,10),
        oauth_token: "r9NxiRJfTsmEPAmBpASG44m4n_6iUmU6",
        oauth_version: '1.0'
    };
    
    var parameters = Object.assign(set_parameters, required_parameters);
    
    //console.log(parameters);
    
    var consumerSecret = process.env.CONSKEY;
    var tokenSecret = process.env.TOKKEY;
    
    var signature = oauthSig.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, {encodeSignature: false});
    
    
    parameters.oauth_signature = signature;
    
    var queryString = ""
    
    var props = Object.getOwnPropertyNames(parameters);
    
   props.sort();
    
    for (var prop in props) {
        queryString += props[prop];
        queryString += "=";
        queryString += parameters[props[prop]];
        queryString += "&";
    }
    
    queryString = queryString.substring(0,queryString.length-1);
    
    var apiURL = url+"?"+queryString;
    
    request(apiURL, function(error, response, body) {
        return callback(error, response, body);
    })
}