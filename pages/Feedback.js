'use strict';

var React = require('react-native');
var NavHeader = require('../component/NavHeader');
var settings = require("../utils/settings");

var {
	StyleSheet,
	View,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity
} = React;

var Feedback = React.createClass({
	_back: function(){
		this.props.navigator.pop();
	},
	render: function(){
		return (
			<View style={styles.container}>
				<NavHeader title="意见反馈" onPress={this._back}>
					<TouchableOpacity style={styles.saveBtn} onPress={this._submit}>
	          <Text style={styles.saveTxt}>发送</Text>
	        </TouchableOpacity>
				</NavHeader>
				<View style={styles.feedback}>
					<TextInput
						style={styles.txt}
						placeholder="请输入反馈内容"
						placeholderTextColor="#bab9a8"
						multiline={true} />
				</View>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fcfcf5',

	},
	feedback: {
		backgroundColor: '#fcfcf5',
		flex: 1
	},
	txt: {
		fontSize: 14,
		color: '#223e4d',
		paddingLeft: 14,
		paddingRight: 14,
		marginBottom: 14,
		flex: 1
	},
	saveBtn: {
		width: 44,
		height: 44,
		position: 'absolute',
		bottom: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'center'
	},
	saveTxt: {
		color: '#fff'
	}
});

module.exports = Feedback;
