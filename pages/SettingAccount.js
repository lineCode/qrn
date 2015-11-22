'use strict';

var React = require('react-native');
var InputWithLable = require('../component/InputWithLabel');
var DivideBorder = require('../component/DivideBorder');
var NavHeader = require('../component/NavHeader');
var settings = require("../utils/settings");
var UtilsFunctions = require('../utils/functions');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;


var {
	StyleSheet,
	View,
	Text,
	TextInput,
	AlertIOS,
	ActivityIndicatorIOS,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight
} = React;

var SettingAccount = React.createClass({
	getInitialState: function(){
		return {
			avatar_url: null,
			nickname: "",
			about: "",
		};
	},
	componentDidMount: function(){
		this._fetch();
	},
	_uploadAvatar: function(){
		var options = {
		title: '请选择投降', // specify null or empty string to remove the title
		cancelButtonTitle: '取消',
		takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
		chooseFromLibraryButtonTitle: '从相册选取', // specify null or empty string to remove this button
		maxWidth: 400,
		maxHeight: 400,
		customButtons: {},
		quality: 1,
		allowsEditing: true, // Built in iOS functionality to resize/reposition the image
		noData: false, // Disables the base64 `data` field from being generated.
		storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
			skipBackup: true, // image will NOT be backed up to icloud
			path: 'images' // will save image at /Documents/images rather than the root
			}
		};
		UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
			if (didCancel) {
		        console.log('User cancelled image picker');
			}
			else {
				this.setState({isAvatarLoading: true});
			if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				var source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

				fetch(settings.serverAddress + "/api/upload/upload/", {method: "POST", body:
			    UtilsFunctions.object2form({
			        "media": 0,
			        'base64': source.uri,
			      }),
			    })
			    .then((res) => {
						console.log(res);
						return res.json();
					})
			    .then((resJson) => {
					console.log(resJson);
					this.setState({
					avatar_url: resJson.material
				});
					this.setState({isAvatarLoading: false});
					AlertIOS.alert(
						null,
						'头像上传成功',
						[{text: '好的'}]);
			      }
			    )
			    .catch(e => {console.log(e);})
			    .done();
        }
      }
    });
	},
	_fetch: function(){
	    fetch(settings.serverAddress + "/api/core/info/setting/")
	    .then((res) => {
	      return res.json();
	    })
	    .then((resJson) => {
	      console.log(resJson);
	      this.setState({
	        avatar_url: resJson.avatar_url,
	        nickname: resJson.nickname,
	        about: resJson.about
	      });
	    })
	    .catch(e => {
	      console.log(e);
	    })
	    .done();
	},
	_save: function(){
	    fetch(settings.serverAddress + "/api/core/info/setting/", {method: "PATCH",headers:{'Content-Type': 'application/x-www-form-urlencoded'}, body:
	      UtilsFunctions.object2form({
	        avatar_url: this.state.avatar_url,
	        nickname: this.state.nickname,
	        about: this.state.about
	      })
	    })
	    .then((res) => {
	      console.log(res);
	      return res.json();
	    })
	    .then((resJson) => {
	      console.log(resJson);
	    if(resJson.succ === true){
			AlertIOS.alert(
			null,
			"修改成功",
			  [
			    {text: '确认', onPress: () =>
					{
         				this.props.navigator._popN(2);
					}
				},
			  ]
			)
		}else{
			alert("修改失败，请重试");
		}

	    })
	    .catch(e => {
	      console.log(e);
	    })
	    .done();
	},
	_back: function(){
		this.props.navigator.pop();
	},
	render: function(){
		return (
				<View style={styles.container}>
					<NavHeader title="账号设置" onPress={this._back}>
						<TouchableOpacity style={styles.saveBtn} onPress={this._save}>
							<Text style={styles.saveTxt}>保存</Text>
						</TouchableOpacity>
					</NavHeader>
					<ScrollView style={styles.scrollView}>
						<View style={styles.setAvatar}>
							<View style={styles.label}>
								<Text style={styles.txt}>设置头像</Text>
							</View>
							<TouchableOpacity onPress={this._uploadAvatar}>
								{this.state.isAvatarLoading?
								<View style={[styles.avatar, {backgroundColor: "#48b8a7", justifyContent: "center", alignItems: "center", flexDirection: "row"}]} >
									<ActivityIndicatorIOS color="white"/><Text style={{color: "white"}}>上传中</Text>
								</View>
								:
								<Image style={styles.avatar} source={this.state.avatar_url?{uri: this.state.avatar_url}:require('image!avatar')}/>
								}
							</TouchableOpacity>
						</View>
						<View style={styles.inputGroup}>
							<InputWithLable label="昵称">
								<TextInput
									placeholder="设置昵称"
									placeholderTextColor="#bab9a8"
									color="#7e8e97"
									value={this.state.nickname}
									onChangeText={(text) => {this.setState({nickname: text})}}
									style={styles.inputTxt} />
							</InputWithLable>

							<DivideBorder />

							<InputWithLable label="签名">
								<TextInput
									placeholder="设置签名"
									placeholderTextColor="#bab9a8"
									color="#7e8e97"
									value={this.state.about}
									onChangeText={(text) => {this.setState({about: text})}}
									style={styles.inputTxt} />
							</InputWithLable>

							<DivideBorder />

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
		paddingTop: 30
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
	txtNavigation:{
		flex: 1,
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
	},
	list: {
		backgroundColor: '#fff',
		// borderTopWidth: 0.5,
		// borderTopColor: '#e6e0d8',
		// borderBottomWidth: 0.5,
		// borderBottomColor: '#e6e0d8',
	},
	item: {
		height: 53,
		flexDirection: 'row',
		alignItems: 'center'
	},
	arrowRight: {
		width: 7,
		height:11,
		marginRight: 14
	},
});

module.exports = SettingAccount;

