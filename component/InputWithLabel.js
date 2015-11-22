'use strict';

var React = require('react-native');

var {
	StyleSheet,
	View,
	Text
} = React;

var InputWithLable = React.createClass({
	render: function(){
		return (
			<View style={styles.labelContainer}>
				<View>
					<Text style={styles.label}>{this.props.label}</Text>
				</View>
				{this.props.children}
			</View>
		);
	}
});

var styles = StyleSheet.create({
	labelContainer: {
		paddingTop: 19,
		paddingBottom: 19,
		flexDirection: 'row'
	},
	label: {
		width: 88,
		height: 15,
		fontSize: 15,
		color: '#7e8e97'
	}
});

module.exports = InputWithLable;
