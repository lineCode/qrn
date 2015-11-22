'use strict';

var React = require('react-native');
var InputWithLable = require('../component/InputWithLabel');
var DivideBorder = require('../component/DivideBorder');
var NavHeader = require('../component/NavHeader');
var settings = require("../utils/settings");
var UtilsFunctions = require('../utils/functions');

var {
	StyleSheet,
	View,
	Text,
	TextInput,
	Image,
	ScrollView,
	TouchableOpacity,
	AlertIOS
} = React;

var SettingPassword = React.createClass({
	getInitialState: function(){
		return {
			password: null,
			newpwd: null,
			newpwd2: null,
		};
	},
	_back: function(){
		this.props.navigator.pop();
	},
	_save: function(){
		if (this.state.newpwd !== this.state.newpwd2){
			alert("两次密码输入不一致，请重新输入");
			return 
		}
		if (this.state.newpwd.length < 6){
			alert("请输入六位或者六位以上秘密");
			return
		}
	    fetch(settings.serverAddress + "/api/user/password/change/", {method: "PUT",
	    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
	    body:UtilsFunctions.object2form({
	    	password: this.state.password,
	    	newpwd: this.state.newpwd
	      })
	    })
	    .then((res) => {
			console.log(res);
			if(res.status === 200){
				AlertIOS.alert(
				null,
				"密码修改成功",
				  [
				    {text: '确认', onPress: () =>
						{
	         				this.props.navigator._popN(2);
						}
					},
				  ]
				)
			}
			return res.json()
		})
		.then((res) => {
			console.log(res);
			if(res["detail"]){
				alert(res["detail"][0]);
			}

		})
		.done();

	},
	render: function(){
		console.log(this.props.navigator)
		return (
				<View style={styles.container}>
					<NavHeader title="密码设置" onPress={this._back}>
						<TouchableOpacity style={styles.saveBtn} onPress={this._save}>
				        	<Text style={styles.saveTxt}>保存</Text>
				        </TouchableOpacity>
					</NavHeader>
					<ScrollView style={styles.scrollView}>
						<View style={styles.inputGroup}>
							<InputWithLable label="旧密码">
								<TextInput
									placeholder="6位数以上密码"
									placeholderTextColor="#bab9a8"
									password={true}
									onChangeText={(text) => {this.setState({password: text})}}
									style={styles.inputTxt} />
							</InputWithLable>
							<DivideBorder />
							<InputWithLable label="新密码">
								<TextInput
									placeholder="6位数以上密码"
									placeholderTextColor="#bab9a8"
									password={true}
									onChangeText={(text) => {this.setState({newpwd: text})}}
									style={styles.inputTxt} />
							</InputWithLable>
							<DivideBorder />
							<InputWithLable label="重复新密码">
								<TextInput
									placeholder="6位数以上密码"
									placeholderTextColor="#bab9a8"
									password={true}
									onChangeText={(text) => {this.setState({newpwd2: text})}}
									style={styles.inputTxt} />
							</InputWithLable>
						</View>
					</ScrollView>
				</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fcfcf5',
		flex: 1
	},
	scrollView: {
		backgroundColor: '#fcfcf5',
		paddingTop: 10
	},
	setAvatar: {
		paddingLeft: 14,
		height: 100,
		flexDirection: 'row',
	},
	label: {
		paddingTop: 44
	},
	txt: {
		width: 88,
		fontSize: 15,
		color: '#7e8e97'
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50
	},
	inputGroup: {
		marginTop: 20,
		backgroundColor: '#fff',
		borderTopWidth: 0.5,
		borderTopColor: '#e6e0d8',
		borderBottomWidth: 0.5,
		borderBottomColor: '#e6e0d8',
		paddingLeft: 14
	},
	inputTxt: {
		flex: 1,
		height: 15,
		fontSize: 15,
		color: '#223e4d',
		paddingRight: 14
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

module.exports = SettingPassword;

