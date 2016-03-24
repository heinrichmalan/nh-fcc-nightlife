"use strict";

var Business = React.createClass({
    displayName: "Business",

    getInitialState: function getInitialState() {
        return { className: this.props.className, going: this.props.going, imGoing: this.props.imGoing };
    },
    handleGoing: function handleGoing(evt) {
        var context = this;
        var cookieValue = "location=" + this.props.getLoc();
        document.cookie = cookieValue;

        $.ajax({
            url: "/going/" + this.props.id,
            crossOrigin: true,
            success: function success(data) {
                if (data.substring(0, 4) === "http") {
                    window.location = data;
                } else {
                    context.props.updateGoing();
                    var newImGoing;
                    var newGoing;
                    var newClass;

                    if (context.state.imGoing === 1) {
                        newImGoing = 0;
                        newGoing = context.state.going - 1;
                        newClass = "glyphicon glyphicon-hand-right";
                    } else {
                        newImGoing = 1;
                        newGoing = context.state.going + 1;
                        newClass = "glyphicon glyphicon-thumbs-up";
                    }

                    context.setState({ className: newClass, going: newGoing, imGoing: newImGoing });
                }
            }
        });
    },
    render: function render() {
        var url = "/going/" + this.props.id;
        return React.createElement(
            "div",
            { className: "businessListing row" },
            React.createElement(
                "div",
                { className: "businessImg col-md-3" },
                React.createElement(
                    "a",
                    { href: this.props.url, target: "_blank" },
                    React.createElement("img", { src: this.props.imgUrl })
                )
            ),
            React.createElement(
                "div",
                { className: "details col-md-9" },
                React.createElement(
                    "div",
                    { className: "busTopRow row" },
                    React.createElement(
                        "a",
                        { href: this.props.url, target: "_blank" },
                        React.createElement(
                            "span",
                            null,
                            React.createElement(
                                "b",
                                null,
                                this.props.name
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "btn btn-default btn-xs", onClick: this.handleGoing },
                        React.createElement("span", { ref: this.props.id, className: this.state.className }),
                        " Going ",
                        this.state.going
                    )
                ),
                React.createElement(
                    "div",
                    { className: "busBotRow row" },
                    React.createElement(
                        "a",
                        { href: this.props.url, target: "_blank" },
                        React.createElement(
                            "i",
                            null,
                            this.props.text,
                            "..."
                        )
                    )
                )
            )
        );
    }
});

var App = React.createClass({
    displayName: "App",

    componentDidMount: function componentDidMount() {
        var context = this;
        var cookie = document.cookie;
        var location = String(cookie).substr(9);
        document.cookie = "location=; expires=Thu, 01 Jan 1970 00:00:01 UTC";

        if (location !== "") {
            this.refs.locInput.value = location;
            context.getBusinesses(context, location);
        }
    },
    getInitialState: function getInitialState() {
        return { bars: [], businesses: [], going: [], imGoing: [] };
    },
    getLocation: function getLocation() {
        return this.refs.locInput.value;
    },
    updateGoing: function updateGoing(index) {
        var newImGoing = this.state.imGoing;
        var newGoing = this.state.going;
        var context = this;

        if (newImGoing[index]) {
            newImGoing[index] = false;
            newGoing[index] - 1;
        } else {
            newImGoing[index] = true;
            newGoing[index] + 1;
        }

        this.setState({ going: newGoing, imGoing: newImGoing });
    },
    generateList: function generateList() {
        var list = [];
        var context = this;

        this.state.businesses.forEach(function (business, i) {
            var className = "";
            if (context.state.imGoing[i]) {
                className = "glyphicon glyphicon-thumbs-up";
            } else {
                className = "glyphicon glyphicon-hand-right";
            }

            list.push(React.createElement(Business, { name: business.name, imgUrl: business.imgUrl, text: business.snippetText, url: business.url, key: i, index: i, id: business.id, going: context.state.going[i], imGoing: context.state.imGoing[i], updateGoing: context.updateGoing, className: className, getLoc: context.getLocation }));
        });

        context.setState({ bars: list });
    },
    getBusinesses: function getBusinesses(context, loc) {
        var baseUrl;
        var context = this;

        var location = loc;

        if (window.location.href.match(/localhost\:8080/) !== -1) {
            baseUrl = "";
        } else {
            baseUrl = "https://nh-fcc-nightlife.herokaupp.com";
        }

        $("#loading").css("display", "block");
        $.ajax({
            method: 'POST',
            url: baseUrl + "/",
            data: { location: location },
            success: function success(data) {
                var parsed = JSON.parse(data);

                var businesses = parsed.yelpData.businesses;
                console.log(parsed.going);
                console.log(parsed.imGoing);
                var list = [];

                businesses.forEach(function (business, i) {
                    var name = business.name;
                    var snippetText = "";
                    var imgUrl = business.image_url;
                    var url = business.url;
                    var id = business.id;

                    if (business.snippet_text !== undefined) {
                        snippetText = business.snippet_text.substr(0, 70);
                    }

                    list.push({ name: name, snippetText: snippetText, imgUrl: imgUrl, id: id, url: url });
                });

                context.setState({ businesses: list, going: parsed.going, imGoing: parsed.imGoing }, function () {

                    $("#loading").css("display", "none");
                    context.generateList();
                });
            }
        });
    },
    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var context = this;

        var location = this.refs.locInput.value;
        context.getBusinesses(context, location);
    },
    render: function render() {
        var bars = this.state.bars;
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
            React.createElement(
                "div",
                { id: "loading" },
                React.createElement("i", { className: "fa fa-spinner fa-spin fa-3x" })
            ),
            bars
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('mount'));