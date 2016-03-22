var Business = React.createClass({
    handleGoing: function(evt){
        console.log(evt.dispatchMarker);
    },
    render: function(){
        return (
            <div className="businessListing row">
                <div className="businessImg col-md-3">
                    <img src={this.props.imgUrl} />
                </div>
                <div className="details col-md-9">
                    <div className="busTopRow row">
                        <span>{this.props.name}</span>
                        <div className="btn btn-default btn-xs" onClick={this.handleGoing}><span ref={this.props.id} className="glyphicon glyphicon-hand-right"></span> Going {this.props.number}</div>
                    </div>
                    <div className="busBotRow row">
                        {this.props.text}...
                    </div>
                </div>
            </div>
        )
    }
})

var App = React.createClass({
    getInitialState: function(){
        return ({bars: [], businesses: []});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var baseUrl;
        var context = this;
        
        if(window.location.href.match(/localhost\:8080/) !== -1) {
            baseUrl = "";
        } else {
            baseUrl = "https://nh-fcc-nightlife.herokaupp.com";
        }
        
        var location = this.refs.locInput.value;
        $.ajax({
            method: 'POST',
            url: baseUrl+"/",
            data: {location: location},
            success: function(data){
                var parsed = JSON.parse(data);
                
                var businesses = parsed.businesses;
                var list = []
                
                businesses.forEach(function(business,i){
                    list.push(<Business name={business.name} number={0} imgUrl={business.image_url} text={business.snippet_text.substr(0,70)} key={i} id={i}/>)
                })
                
                context.setState({bars: list, businesses: businesses});
            }
        })
    },
    render: function(){
        return (
            <div id="app" className="row">
                <div className="header row">
                    <h2>(c,o)-ordinate</h2>
                    <p>See what bars in your area are going off tonight and join the fun!</p>
                </div>
                <form action="/" method="POST" onSubmit={this.handleSubmit} className="searchForm row">
                    <input type="text" name="location" placeholder="Where you at?" ref="locInput"></input>
                    <input type="submit" value="Submit" className="btn btn-primary"></input>
                </form>
                {this.state.bars}
            </div>
        )
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('mount')
)