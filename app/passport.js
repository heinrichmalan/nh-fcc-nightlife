var process = require('process');
var TwitterStrategy = require('passport-twitter').Strategy;
var flash = require('connect-flash');
var Users = require('../model/users.js');

module.exports = function(app, passport) {
    
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
    
    passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new TwitterStrategy({
        consumerKey: "tVemD40OqPZS7V1crdZCuGsKU",
        consumerSecret: process.env.TWITKEY,
        callbackURL: "/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, cb) {
            process.nextTick(function(){
                Users.findOne({'twitter.id': profile.id}, function(err, user){
                    
                    if(err) return cb(err);
                    
                    if(user) {
                        console.log(user);
                        return cb(null, user);
                    } else {
                        var newUser = new Users();
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;
                        
                        newUser.save(function(err){
                            if (err) throw err;
                            return cb(null, newUser);
                        })
                    }
                })
            })
        })
    );
    
}