var yelp = require('./yelp.js');
var Events = require('../model/events.js');

module.exports = function(app,passport){
    app.get('/', function(req, res){
        res.render('home');
    })
    
    app.post('/', function(req, res){
        var location = req.body.location;
        
        var getData = function(location){
            
            yelp({term: "bar", location: location}, function(error, response, body){
                var yelpData = JSON.parse(body);
                if(error){ 
                    res.status(500);
                    res.end();
                } else if (yelpData['error']) {
                    getData(location);
                } else {
                    res.status(200);
                    var going = [];
                    var imGoing = [];
                    var finished = 0;
                    
                    var date = new Date();
                    var day = date.getDate();
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    
                    var dateString = day+"-"+month+"-"+year;
                    
                    for(var i = 0;i<yelpData.businesses.length;i++){
                        going.push(0);
                        imGoing.push(0);
                    }
                    
                    yelpData.businesses.forEach(function(business,i){
                        var index = i;
                        Events.findOne({business: business.id, date:dateString}, function(err, event){
                            if (err){
                                
                            }
                            
                            if(event){
                                going[index] = event.attendees.length;
                                if(req.user) {
                                    event.attendees.indexOf(req.user._id) !== -1 ? imGoing[index]=1 : imGoing[index]=0;
                                } else {
                                    imGoing[index] = 0;
                                }
                            } else {
                                going[index] = 0;
                                imGoing[index] = 0;
                            }
                            
                            finished++;
                            
                            if(finished === yelpData.businesses.length){
                                res.send(JSON.stringify({yelpData: yelpData,going:going,imGoing: imGoing}));
                            }
                        })
                    })
                    
                }
            })
        }
        
        if(location !== ""){
            getData(location);    
        }
        
    })
    
    app.get('/going/:busId', function(req, res){
        if (req.user){
            
            var date = new Date();
            var day = date.getDate();
            var month = date.getMonth();
            var year = date.getFullYear();
            
            var dateString = day+"-"+month+"-"+year;
            
            Events.findOne({date: dateString, business: req.params.busId}, function(err, event){
                if(err){
                    res.status(500);
                    res.end();   
                }
                
                if(event){
                    var index = event.attendees.indexOf(req.user._id);
                    
                    if(index === -1){
                        event.attendees.push(req.user._id);
                    } else {
                        event.attendees.splice(index,1);
                    }
                    
                    event.save(function(){
                        res.status(200);
                        res.end();
                    });
                } else {
                    var newEvent = new Events();
                    newEvent.date = dateString;
                    newEvent.business = req.params.busId;
                    newEvent.attendees = [req.user._id];
                    
                    newEvent.save(function(err){
                        if(err){
                            res.status(500);
                            res.end();
                        } else {
                            res.send(JSON.stringify({going: 1}));
                        }
                    });
                }
            })
        } else {
            
            var baseUrl;

            switch(app.get('env')){
                case 'development':
                    baseUrl = "http://localhost:8080";
                    break;
                case 'production':
                    baseUrl = "https://nh-fcc-nightlife.herokuapp.com";
                    break;
                default:
                    throw new Error('Unknown execution environment: ' + app.get('env'));
            }
            
            req.session.goingId = req.params.busId;
            res.contentType('application/json');
            var data = JSON.stringify(baseUrl +'/auth/twitter');
            res.header('Content-Length', data.length);
            res.end(data);
        }
    });
    
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', 
        passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/'})
    );
}