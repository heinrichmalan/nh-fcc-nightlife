"use strict";

var Business = React.createClass({
    displayName: "Business",

    render: function render() {
        return React.createElement(
            "div",
            { className: "businessListing" },
            React.createElement(
                "div",
                { className: "businessImg" },
                React.createElement("img", { src: this.props.imgUrl })
            ),
            React.createElement(
                "div",
                { className: "details" },
                React.createElement(
                    "div",
                    { className: "busTopRow" },
                    React.createElement(
                        "span",
                        null,
                        this.props.name
                    ),
                    React.createElement(
                        "div",
                        null,
                        "Going ",
                        this.props.number
                    )
                ),
                React.createElement("div", { className: "busBotRow" })
            )
        );
    }
});

var App = React.createClass({
    displayName: "App",

    getInitialState: function getInitialState() {
        return { bars: [] };
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
                console.log(businesses);
                var list = [];

                businesses.forEach(function (business) {
                    list.push(React.createElement(Business, { name: business.name, number: 0, imgUrl: business.image_url }));
                });

                context.setState({ bars: list });
            }
        });
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "form",
                { action: "/", method: "POST", onSubmit: this.handleSubmit },
                React.createElement("input", { type: "text", name: "location", placeholder: "Where you at?", ref: "locInput" }),
                React.createElement("input", { type: "submit", value: "Submit" })
            ),
            this.state.bars
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('mount'));