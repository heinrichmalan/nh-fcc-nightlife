var yelp = require('./yelp.js');

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('home');
    })
    
    app.post('/', function(req, res){
        var location = req.body.location;
        
        yelp({term: "bar", location: location}, function(error, response, body){
            if(error){ 
                res.status(500);
                res.end();
            }
            
            res.status(200);
            res.send(body);
        })
    })
}