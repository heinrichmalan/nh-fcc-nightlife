"use strict";

var Business = React.createClass({
    displayName: "Business",

    handleGoing: function handleGoing(evt) {
        console.log(evt.dispatchMarker);
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "businessListing row" },
            React.createElement(
                "div",
                { className: "businessImg col-md-3" },
                React.createElement("img", { src: this.props.imgUrl })
            ),
            React.createElement(
                "div",
                { className: "details col-md-9" },
                React.createElement(
                    "div",
                    { className: "busTopRow row" },
                    React.createElement(
                        "span",
                        null,
                        this.props.name
                    ),
                    React.createElement(
                        "div",
                        { className: "btn btn-default btn-xs", onClick: this.handleGoing },
                        React.createElement("span", { ref: this.props.id, className: "glyphicon glyphicon-hand-right" }),
                        " Going ",
                        this.props.number
                    )
                ),
                React.createElement(
                    "div",
                    { className: "busBotRow row" },
                    this.props.text,
                    "..."
                )
            )
        );
    }
});

var App = React.createClass({
    displayName: "App",

    getInitialState: function getInitialState() {
        return { bars: [], businesses: [] };
    },
    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var baseUrl;
        var context = this;

        if (window.location.href.match(/localhost\:8080/) !== -1) {
            baseUrl = "";
        } else {
            baseUrl = "https://nh-fcc-nightlife.herokaupp.com";
        }

        var location = this.refs.locInput.value;
        $.ajax({
            method: 'POST',
            url: baseUrl + "/",
            data: { location: location },
            success: function success(data) {
                var parsed = JSON.parse(data);

                var businesses = parsed.businesses;
                var list = [];

                businesses.forEach(function (business, i) {
                    list.push(React.createElement(Business, { name: business.name, number: 0, imgUrl: business.image_url, text: business.snippet_text.substr(0, 70), key: i, id: i }));
                });

                context.setState({ bars: list, businesses: businesses });
            }
        });
    },
    render: function render() {
        return React.createElement(
            "div",
            { id: "app", className: "row" },
            React.createElement(
                "div",
                { className: "header row" },
                React.createElement(
                    "h2",
                    null,
                    "(c,o)-ordinate"
                ),
                React.createElement(
                    "p",
                    null,
                    "See what bars in your area are going off tonight and join the fun!"
                )
            ),
            React.createElement(
                "form",
                { action: "/", method: "POST", onSubmit: this.handleSubmit, className: "searchForm row" },
                React.createElement("input", { type: "text", name: "location", placeholder: "Where you at?", ref: "locInput" }),
                React.createElement("input", { type: "submit", value: "Submit", className: "btn btn-primary" })
            ),
            this.state.bars
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('mount'));