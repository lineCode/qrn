'use strict';

var React = require('react-native');
var NavHeader = require('../component/NavHeader');
var utilsMixin = require('../utils/utilsMixin');
var ExpandingTextInput = require("../component/ExpandingTextInput");
var UtilsFunctions = require('../utils/functions');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var settings = require('../utils/settings');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
	AlertIOS,
	PixelRatio,
	ActivityIndicatorIOS,
	Dimensions
} = React;

var Comments = React.createClass({
	getInitialState: function(){
		return {
			content: "",
			isImgLoading: false,
			added: 0,
			image: [],
			keyboardSpace: 0,
		};
	},
	updateKeyboardSpace: function(frames) {
		if (frames.end){
			this.setState({keyboardSpace: frames.end.height});
		}
	},
	_hideKeyboard: function(){
		this.refs.textInput.blur();
	},
	resetKeyboardSpace: function() {
		this.setState({keyboardSpace: 0});
	},
	componentDidMount: function() {
		KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
		KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
	},
	componentWillUnmount: function() {
		KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
		KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
	},
	componentWillMount: function(){
		console.log(settings.serverAddress + "/core/api/discussions/draft/" + this.props.draftId + "/");
		if (this.props.draftId !== undefined){
			this.setState({isLoadingDraft: true});
			fetch(settings.serverAddress + "/core/api/discussions/draft/" + this.props.draftId + "/")
			.then(res => {
				console.log(res);
				if(res.status < 300 && res.status >= 200){
					this.setState({isLoadingDraft: false});
					return res.json()
				}
			})
			.then(res => {
				console.log(res);
				this.setState({
					content: res.content,
					image: res.image_urls===""?[]:res.image_urls.split(","),
				});
			})
			.done();
		}
	},
	_back: function(){
		if(this.state.content === "" && this.state.image.length === 0){
			this.props.navigator.pop();
			return
		}
		AlertIOS.alert(
		"保存草稿",
		'评论还没发布，是否保存成草稿',
			[
				{text: '取消', onPress: () =>
					{
						console.log('取消 Pressed!')
					}
				},
				{text: '不保存', onPress: () =>
					{
						this.props.navigator.pop();
					}
				},
				{text: '保存', onPress: () =>
					{
						this._save();
						console.log('保存 Pressed!')
					}
				},
			]
		)
	},
	_post: function(){
	if (this.props.draftId !== undefined){
		console.log("发表草稿啦");
		var postAddress = settings.serverAddress + "/api/core/discussion/" + this.props.draftId + "/post-draft/";
		var postMethod = "PUT"
	}else{
		console.log("新的发表东西呢")
		var postAddress = settings.serverAddress + "/api/core/discussion/create/";
		var postMethod = "POST"
	}
    fetch(postAddress, {method: postMethod, 
   	headers: this.props.draftId !== undefined ? {'Content-Type': 'application/x-www-form-urlencoded'} : null,
    body:UtilsFunctions.object2form({
				topic: this.props.topicId,
				content: this.state.content,
				image_urls: this.state.image.join(",")
      })
    })
    .then((res) => {
			console.log(res);
			return res.json()
		})
    .then((resJson) => {
			AlertIOS.alert("发表成功");
			console.log(resJson);
			this.props.navigator.pop();
    })
    .catch(e => {console.log(e);})
    .done();
  },
	_save: function(){
		if (this.props.draftId !== undefined){
			console.log("修改已有的草稿啦");
			var postAddress = settings.serverAddress + "/api/core/discussion/" + this.props.draftId + "/post-draft/?draft=";
			var postMethod = "PUT"
		}else{
			console.log("建立新的草稿呢")
			var postAddress = settings.serverAddress + "/api/core/discussion/create/?draft=";
			var postMethod = "POST"
		}
		fetch(postAddress, {method: postMethod, 
	   	headers: this.props.draftId !== undefined ? {'Content-Type': 'application/x-www-form-urlencoded'} : null,
		body:UtilsFunctions.object2form({
				topic: this.props.topicId,
				content: this.state.content,
				image_urls: this.state.image.join(",")
			})
		})
		.then((res) => {
			console.log(res);
			return res.json()
		})
		.then((resJson) => {
			AlertIOS.alert(
				null,
				'保存草稿成功',
				[{text:'确定', onPress:() => this.props.navigator.pop()}]
			);
			console.log(resJson);
		})
		.catch(e => {console.log(e);})
		.done();
	},
	_addImg: function(){
		var options = {
			title: '请选择图片',
			cancelButtonTitle: '取消',
			takePhotoButtonTitle: '拍照',
			chooseFromLibraryButtonTitle: '从相册选取',
			maxWidth: 400,
			maxHeight: 400,
			quality: 1,
			allowsEditing: false,
			noData: false,
			storageOptions: {
				skipBackup: true,
				path: 'images'
			}
		};
		UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
			if(didCancel){
				console.log('User cancelled image picker');
			}
			else{
				this.setState({isImgLoading: true});
				if(response.customButton){
					console.log('User tapped custom button: ', response.customButton);
				}
				else{
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
						this.state.image.push(resJson.material);
						this.setState({
							added: this.state.added + 1,
						});
						this.setState({isImgLoading: false});
						AlertIOS.alert(
							null,
							'图片上传成功',
							[{text: '好的'}]);
						}
					)
					.catch(e => {console.log(e);})
					.done();
				}
			};
		});
	},
	render: function(){
		var addImgContent;
		addImgContent = this.state.image.map((e) => {
				console.log(e);
				return <Image
					style={styles.imgAdded}
					source={{uri: e}}
					resizeMode={Image.resizeMode.stretch} />
		});
		return (
			<View style={styles.container}>
				<NavHeader onPress={this._back} title="发起讨论">
					<TouchableOpacity style={styles.saveBtn}>
	          <Text style={styles.saveTxt} onPress={this._post}>发布</Text>
	        </TouchableOpacity>
				</NavHeader>

				<View style={styles.postContent}>
{					// <ExpandingTextInput
					// 	style={styles.postTxt}
					// 	placeholder="话题内容"
					// 	onChangeText={(text) => {this.setState({content: text})}}
					// 	placeholderTextColor="#bab9a8"
					// 	/>
					}
					<TextInput
						style={styles.contentTxt}
						placeholder="回复内容"
						value={this.state.content}
						ref="textInput"
						onChangeText={(text) => {this.setState({content: text})}}
						placeholderTextColor="#bab9a8"
						multiline={true} />
				</View>
				{
					this.state.keyboardSpace === 0?
					<View style={{height: 85.5}}/>:
					<View style={{height: this.state.keyboardSpace}}/>
				}
				{
					this.state.keyboardSpace === 0?
					null:
					<View style={{position: "absolute", bottom: this.state.keyboardSpace + 10, right: 10}}>
						<TouchableOpacity onPress={this._hideKeyboard}>
							<Image source={require("image!but_jianpan")} />
						</TouchableOpacity>
					</View>
				}
				<View style={styles.addImg}>
					<View style={styles.addImgLabel}>
						<Text style={styles.addImgLabelTop}>插入图片</Text>
						<Text style={styles.addImgLabelBottom}>（最多4张）</Text>
					</View>
					{addImgContent}
					{
						this.state.isImgLoading
						?
						<View style={{width: 65.5, height: 65.5, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#f7f4f1", borderWidth: 0.5, borderColor: "#bab9a8"}}>
							<ActivityIndicatorIOS color="#bab9a8"/>
						</View>
						:
						<TouchableOpacity onPress={this._addImg}>
							<Image style={styles.addimgBtn} source={require('image!Posts_but_Add_pic')} />
						</TouchableOpacity>
					}
				</View>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fcfcf5',
		flex: 1
	},
	postContent: {
		paddingLeft: 14,
		paddingRight: 14,
		paddingTop: 5,
		paddingBottom: 5,
		flex: 1
	},
	postTxt: {
		color: '#223d4e',
		fontSize: 14,
		fontWeight: 'bold'
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
	addImg: {
		position: "absolute",
		bottom: 0,
		right: 0,
		left: 0,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#fff',
		flexDirection: 'row',
		borderTopWidth: 1/PixelRatio.get(),
		borderTopColor: '#D5C5BB',
		alignItems: 'center'
	},
	addImgLabel: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 5
	},
	addImgLabelTop: {
		fontSize: 13,
		color: '#bbb4b5'
	},
	addImgLabelBottom: {
		fontSize: 12,
		color: '#bbb4b5',
		opacity: 0.5
	},
	contentTxt: {
		color: '#223d4e',
		fontSize: 14,
		paddingRight: 14,
		flex: 1
	},
	addimgBtn: {
		width: (Dimensions.get('window').width - 113)/4,
		height: (Dimensions.get('window').width - 113)/4,
		marginRight: 10
	},
	imgAdded: {
		width: (Dimensions.get('window').width - 113)/4,
		height: (Dimensions.get('window').width - 113)/4,
		marginRight: 10
	},
});

module.exports = Comments;
