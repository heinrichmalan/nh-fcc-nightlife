var Business = React.createClass({
    render: function(){
        return (
            <div className="businessListing">
                <div className="businessImg">
                    <img src={this.props.imgUrl} />
                </div>
                <div className="details">
                    <div className="busTopRow">
                        <span>{this.props.name}</span>
                        <div>Going {this.props.number}</div>
                    </div>
                    <div className="busBotRow">
                    </div>
                </div>
            </div>
        )
    }
})

var App = React.createClass({
    getInitialState: function(){
        return ({bars: []});
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
                console.log(businesses);
                var list = []
                
                businesses.forEach(function(business){
                    list.push(<Business name={business.name} number={0} imgUrl={business.image_url} />)
                })
                
                context.setState({bars: list});
            }
        })
    },
    render: function(){
        return (
            <div>
                <form action="/" method="POST" onSubmit={this.handleSubmit}>
                    <input type="text" name="location" placeholder="Where you at?" ref="locInput"></input>
                    <input type="submit" value="Submit" ></input>
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