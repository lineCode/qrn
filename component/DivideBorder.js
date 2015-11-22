'use strict';

var React = require('react-native');

var {
	StyleSheet,
	View,
	PixelRatio
} = React;

var DivideBorder = React.createClass({
	render: function(){
		return (
			<View style={styles.divideBorder} />
		);
	}
});

var styles = StyleSheet.create({
	divideBorder: {
		backgroundColor: '#e6e0d8',
		height: 1/PixelRatio.get()
	}
});

module.exports = DivideBorder;
