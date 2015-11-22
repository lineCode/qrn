'use strict';

var React = require('react-native');
var DivideBorder = require('../component/DivideBorder');
var NavHeader = require('../component/NavHeader');
var settings = require("../utils/settings");
var DivideBorder = require("../component/DivideBorder");

var {
	StyleSheet,
	View,
	Text,
	Image,
	SwitchIOS,
	ScrollView,
	TouchableHighlight,
	AsyncStorage
} = React;

var SwitchOff = React.createClass({
	getInitialState: function(){
		return {
			trueSwitchIsOn: true,
			falseSwitchIsOn: false,
		};
	},
	render: function(){
		return (
			<View>
				<SwitchIOS
					style={styles.theSwitch}
					onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
					value={this.state.falseSwitchIsOn} />
			</View>
		);
	}
});

var SwitchOn = React.createClass({
	getInitialState: function(){
		return {
			trueSwitchIsOn: true,
			falseSwitchIsOn: false,
		};
	},
	render: function(){
		return (
			<View>
				<SwitchIOS
				  style={styles.theSwitch}
					onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
					value={this.state.trueSwitchIsOn} />
			</View>
		);
	}
});

var Setting = React.createClass({
	_settingAccount: function(){
		this.props.navigator.push({id:'settingAccount'});
	},
	_settingPassword: function(){
		this.props.navigator.push({id:'settingPassword'});
	},
	_settingBaby: function(){
		this.props.navigator.push({id:'register02', fromSetting: true});
	},
	_goBlackList: function(){
		this.props.navigator.push({id:'blackList'});
	},
	_goFeedback: function(){
		this.props.navigator.push({id:'feedback'});
	},
	_goAbout: function(){
		this.props.navigator.push({id:'aboutMengya'});
	},
	_back: function(){
		this.props.navigator.pop();
	},
	_logout: function(){
		fetch(settings.serverAddress + "/api/user/logout/").then((res) => {
			console.log(res);
			if(res.status === 200){
				console.log(res);
				AsyncStorage.setItem("isLogin", "false").done();
				this.props.navigator.push({id: "home"}, 0);
			}
		}).done();
	},
	render: function(){
		console.log(this.props.avatar);
		return (
			<View style={styles.container}>
				<NavHeader title="设置" onPress={this._back} />
				<ScrollView style={styles.scrollView} automaticallyAdjustContentInsets={false}>
					<View style={styles.group}>
						<Text style={styles.subTitle}>账号设置</Text>
						<DivideBorder />
						<View style={styles.list}>
						  <TouchableHighlight
						  	onPress={this._settingAccount}
						  	underlayColor="#fff">
								<View style={styles.item}>
									<Image style={styles.avatar} source={this.props.avatar?this.props.avatar:require('image!avatar')} />
									<Text style={styles.txt}>{this.props.nickname}</Text>
									<Image style={styles.arrowRight} source={require('image!arrowRight')} />
								</View>
							</TouchableHighlight>
						</View>

						<DivideBorder />
						<View style={styles.list}>
						  <TouchableHighlight
						  	onPress={this._settingPassword}
						  	underlayColor="#fff">
								<View style={styles.item}>
									<Text style={styles.txt}>修改密码</Text>
									<Image style={styles.arrowRight} source={require('image!arrowRight')} />
								</View>
							</TouchableHighlight>
						</View>
						<DivideBorder />

						<View style={styles.list}>
						  <TouchableHighlight
						  	onPress={this._settingBaby}
						  	underlayColor="#fff">
								<View style={styles.item}>
									<Text style={styles.txt}>修改宝宝信息</Text>
									<Image style={styles.arrowRight} source={require('image!arrowRight')} />
								</View>
							</TouchableHighlight>
						</View>
						<DivideBorder />
{
						// <View style={styles.list}>
						//   <TouchableHighlight
						//   	onPress={this._settingAddress}
						//   	underlayColor="#fff">
						// 		<View style={styles.item}>
						// 			<Text style={styles.txt}>修改地址</Text>
						// 			<Image style={styles.arrowRight} source={require('image!arrowRight')} />
						// 		</View>
						// 	</TouchableHighlight>
						// </View>
						// <DivideBorder />
}
					</View>
					<View style={styles.group}>
						<Text style={styles.subTitle}>应用设置</Text>
						<DivideBorder />
						<View style={styles.list}>
							<View style={styles.item}>
								<Text style={styles.txt}>消息推送</Text>
								<SwitchOn />
							</View>
							<DivideBorder />
							<View style={styles.item}>
								<Text style={styles.txt}>不接受陌生人私信</Text>
								<SwitchOff />
							</View>
						</View>
						<DivideBorder />
					</View>
					<View style={styles.group}>
						<DivideBorder />
						<View style={styles.list}>
							<TouchableHighlight
								onPress={this._goBlackList}
								underlayColor="#fff">
								<View style={styles.item}>
									<Text style={styles.txt}>黑名单</Text>
									<Image style={styles.arrowRight} source={require('image!arrowRight')} />
								</View>
							</TouchableHighlight>
							<DivideBorder />
							<TouchableHighlight
								onPress={this._goFeedback}
								underlayColor="#fff">
								<View style={styles.item}>
									<Text style={styles.txt}>意见反馈</Text>
									<Image style={styles.arrowRight} source={require('image!arrowRight')} />
								</View>
							</TouchableHighlight>
							<DivideBorder />
							<TouchableHighlight
								onPress={this._goAbout}
								underlayColor="#fff">
								<View style={styles.item}>
									<Text style={styles.txt}>关于小萌芽</Text>
									<Image style={styles.arrowRight} source={require('image!arrowRight')} />
								</View>
							</TouchableHighlight>
							<DivideBorder />
						</View>
						<DivideBorder />
						<View style={styles.group}>
							<DivideBorder />
							<View style={[styles.list,{paddingLeft: 0}]}>
								<TouchableHighlight
									onPress={this._logout}
									underlayColor="#fff">
									<View style={styles.item}>
										<Text style={[styles.txt, {textAlign: "center"}]}>注销</Text>
									</View>
								</TouchableHighlight>
							</View>
							<DivideBorder />
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scrollView: {
		backgroundColor: '#fcfcf5'
	},
	group: {
		marginTop: 18,
	},
	subTitle: {
		fontSize: 13,
		color: '#bab9a8',
		marginLeft: 14,
		marginBottom: 8
	},
	list: {
		backgroundColor: '#fff',
		// borderTopWidth: 0.5,
		// borderTopColor: '#e6e0d8',
		// borderBottomWidth: 0.5,
		// borderBottomColor: '#e6e0d8',
		paddingLeft: 14
	},
	item: {
		height: 53,
		flexDirection: 'row',
		alignItems: 'center'
	},
	avatar: {
		width: 30,
		height: 30,
		borderRadius: 15,
		marginRight: 10
	},
	txt: {
		fontSize: 15,
		color: '#223e4d',
		flex: 1,
	},
	arrowRight: {
		width: 7,
		height:11,
		marginRight: 14
	},
	theSwitch: {
		marginRight: 14
	}
});

module.exports = Setting;
