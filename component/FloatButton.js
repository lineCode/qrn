'use strict';

var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	TouchableOpacity
} = React;

var FloatButton = React.createClass({
	render: function(){
		return (
			<TouchableOpacity onPress={this.props.onPress} style={styles.floatBtn}>
        <Image source={require("image!Public_but_post")} />
      </TouchableOpacity>
		);
	}
});

var styles = StyleSheet.create({
	floatBtn: {
		width: 70,
		height: 70,
		position: 'absolute',
		bottom: 25,
		right: 0,
		backgroundColor: 'transparent'
	}
});

module.exports = FloatButton;
