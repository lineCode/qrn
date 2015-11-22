'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var NavHeader = require('../component/NavHeader');
var utilsMixin = require('../utils/utilsMixin');
var UtilsFunctions = require('../utils/functions');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var Modal = require('react-native-modalbox');
var settings = require("../utils/settings");
var LoadingPage = require("../component/LoadingPage");
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var Animatable = require('react-native-animatable');

var {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TextInput,
	AlertIOS,
	PixelRatio,
	ActivityIndicatorIOS
} = React;

var LabelItem = React.createClass({
	render: function(){
		return (
			<View style={styles.ageItemContainer}>
				<TouchableWithoutFeedback onPressOut={this.props.onPress}>
					{
						this.props.checked?
							<Text style={[styles.labelTxt, {color: "#faa531", fontSize: 12, lineHeight: 20, borderColor: "#faa531"}]}>{this.props.title}</Text>
						:
							<Text style={[styles.labelTxt, this.props.style]}>{this.props.title}</Text>
					}
				</TouchableWithoutFeedback>
			</View>
		);
	}
});

var AgeItem = React.createClass({
	render: function(){
		return (
			<View style={styles.ageItemContainer}>
				<TouchableWithoutFeedback onPressOut={this.props.onPress}>
					{
						this.props.checked?
							<Text style={[styles.ageTxt, {color: "#faa531", fontSize: 12, lineHeight: 20, borderColor: "#faa531"}]}>{this.props.title}</Text>
							:
							<Text style={[styles.ageTxt, this.props.style]}>{this.props.title}</Text>
					}
				</TouchableWithoutFeedback>
			</View>
		);
	}
});

var PostPage = React.createClass({
	getInitialState: function(){
		return {
			month_tag: 1,
			tags: "",
			title: "",
			content: "",
			cover: "",
			isTipShow: true, //保存草稿提示
			image: [],
			allLab: [
								// ["亲子教育",false],
								// ["营养饮食",false],
								// ["成长发育",false],
								// ["辣妈攻略",false],
								// ["家庭",false],
								// ["睡眠",false],
								// ["护理",false],
								// ["出行",false],
								// ["母乳奶粉",false],
								// ["绘本游戏",false],
								// ["好物分享",false],
								// ["其他",false]
								"亲子教育","营养饮食","成长发育","辣妈攻略","家庭","睡眠","护理","出行","母乳奶粉","绘本游戏","好物分享","其他"
							],
			allAge: [
								// ["备孕",false],
								// ["孕期",false],
								// ["0-6月",false],
								// ["6月-1岁",false],
								// ["0-1岁",false],
								// ["0-3岁",false],
								// ["1-3岁",false],
								// ["1-6岁",false],
								// ["3-6岁",false]
								"备孕","孕期","0-6个月","6个月-1岁","0-1岁","0-3岁","1-3岁","1-6岁","3-6岁"
							],
			addedLab: [],
			addedAge: [],
			added: 0,
			isCoverLoading: false,
			isImgLoading: false,
			isLoadingDraft: false,
			isPosting: false,
			keyboardSpace: 0,
		};
	},
	updateKeyboardSpace: function(frames) {
		if (frames.end){
			this.setState({keyboardSpace: frames.end.height});
		}
	},
	_hideKeyboard: function(){
		this.refs.textInput1.blur();
		this.refs.textInput2.blur();
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
		if (this.props.draftId !== undefined){
			this.setState({isLoadingDraft: true});
			fetch(settings.serverAddress + "/core/api/topics/draft/" + this.props.draftId + "/")
			.then(res => {
				if(res.status < 300 && res.status >= 200){
					this.setState({isLoadingDraft: false});
					return res.json()
				}
			})
			.then(res => {
				console.log(res);
				this.setState({
					title: res.title,
					content: res.content,
					cover: res.cover,
					image: res.image_urls===""?[]:res.image_urls.split(","),
					addedAge: [res.month_tag],
					addedLab: res.tags
				});
			})
			.done();
		}
	},
	_LabInAdded: function(title){
		return this.state.addedLab.indexOf(title) === -1 ? false : true
	},
	_AgeInAdded: function(title){
		return this.state.addedAge.indexOf(title) === -1 ? false : true
	},
	_addLabItem: function(title){
		if(this.state.addedLab.indexOf(title) === -1){
			if(this.state.addedLab.length > 2){
				AlertIOS.alert("请勿添加三个以上的标签");
				return false;
			}
			var tmp = this.state.addedLab.slice();
			tmp.push(title);
			this.setState({
				addedLab: tmp
			});
		}else{
			var tmp = this.state.addedLab.slice();
			UtilsFunctions.removeA(tmp, title);
			this.setState({
				addedLab: tmp
			});
		}

	},
	_addAgeItem: function(title){
		if(this.state.addedAge.indexOf(title) === -1){
			var tmp = this.state.addedAge.slice();
			tmp.pop();
			tmp.push(title);
			this.setState({
				addedAge: tmp
			});
		}else{
			var tmp = this.state.addedAge.slice();
			UtilsFunctions.removeA(tmp, title);
			this.setState({
				addedAge: tmp
			});
		}
	},
	_back: function(){
		if(this.state.title === "" && this.state.content === "" && this.state.image.length === 0){
			this.props.navigator.pop();
			return
		}
		AlertIOS.alert(
	  "保存草稿",
	  '话题还没发布，是否保存成草稿',
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
		// this.props.navigator.pop();
		this.setState({isTipShow: true});
	},
	_post: function(){
	this.setState({isPosting: true})
	if (this.props.draftId !== undefined){
		console.log("发表草稿啦");
		var postAddress = settings.serverAddress + "/api/core/topic/" + this.props.draftId + "/post-draft/";
		var postMethod = "PUT"
	}else{
		console.log("新的发表东西呢")
		var postAddress = settings.serverAddress + "/api/core/topic/create/";
		var postMethod = "POST"
	}
	console.log(postAddress);
    fetch(postAddress, {method: postMethod,
   	headers: this.props.draftId !== undefined ? {'Content-Type': 'application/x-www-form-urlencoded'} : null,
    body:UtilsFunctions.object2form({
        month_tag: this.state.addedAge.join(","),
				tags: this.state.addedLab.join(","),
				title: this.state.title,
				content: this.state.content,
				cover: this.state.cover,
				image_urls: this.state.image.join(",")
      })
    })
    .then((res) => {
			console.log(res);
			return res.json()
		})
    .then((resJson) => {
			this.setState({isPosting: false})
			AlertIOS.alert(
				null,
				'发表成功',
				[{text:'确定', onPress:() => {
					this.props.navigator.replace({id: "topicPage", passProps: {pageId: resJson.pk}});
					console.log('ok');
				}}]
			);
			console.log(resJson);
    })
    .then(this.setState({isTipShow: true}))
    .catch(e => {console.log(e);})
    .done();
  },
	_save: function(){
	if (this.props.draftId !== undefined){
		console.log("修改已有的草稿啦");
		var postAddress = settings.serverAddress + "/api/core/topic/" + this.props.draftId + "/post-draft/?draft=";
		var postMethod = "PUT"
	}else{
		console.log("建立新的草稿呢")
		var postAddress = settings.serverAddress + "/api/core/topic/create/?draft=";
		var postMethod = "POST"
	}
    fetch(postAddress, {method: postMethod,
   	headers: this.props.draftId !== undefined ? {'Content-Type': 'application/x-www-form-urlencoded'} : null,
	body:UtilsFunctions.object2form({
        month_tag: this.state.addedAge.join(","),
				tags: this.state.addedLab.join(","),
				title: this.state.title,
				content: this.state.content,
				cover: this.state.cover,
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
    .then(this.setState({isTipShow: true}))
    .catch(e => {console.log(e);})
    .done();
  },
	_uploadCover: function(){
		var options = {
      title: '请选择封面', // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '从相册选取', // specify null or empty string to remove this button
      maxWidth: 400,
      maxHeight: 400,
	  customButtons: {
	    'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
	  },
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
				this.setState({isCoverLoading: true});
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
							cover: resJson.material
	          });
						this.setState({isCoverLoading: false});
						AlertIOS.alert(
							null,
							'封面上传成功',
							[{text: '好的'}]);
			      }
			    )
			    .catch(e => {console.log(e);})
			    .done();
        }
      }
    });
	},
	_openModalLabel: function(id){
		this._hideKeyboard();
		this.refs.modalBoxLabel.open();
	},
	_openModalAge: function(id) {
		this._hideKeyboard();
    this.refs.modalBoxAge.open();
  },
	_closeModal: function(refsname) {
		this.refs[refsname].close();
	},
  _closeTip: function(){
  	this.setState({isTipShow: false});
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
		if(this.state.isLoadingDraft){
			return (
				<LoadingPage />
			);
		}
		var addImgContent;
		addImgContent = this.state.image.map((e) => {
				console.log(e);
				return <Image
					style={styles.imgAdded}
					source={{uri: e}}
					resizeMode={Image.resizeMode.stretch} />
		});
		// }
		return (
			<View style={styles.container}>
				<NavHeader onPress={this._back} title="发起话题">
					<TouchableOpacity style={styles.saveBtn} onPress={this._post}>
						{
							this.state.isPosting
							?
							<Text style={styles.saveTxt}>发布中</Text>
							:
		          			<Text style={styles.saveTxt}>发布</Text>
						}
			        </TouchableOpacity>
				</NavHeader>
				
				{
					this.state.keyboardSpace === 0
					?
						this.state.isCoverLoading
						?
						<View style={[styles.uploadCover]}>
							<View style={{flexDirection: "row", alignItems: "center"}}>
								<ActivityIndicatorIOS color="white"/>
								<Text style={[styles.txtLight, styles.uploadTitle, {marginTop: 0, marginBottom: 0}]}>上传中</Text>
							</View>
						</View>
						:
						<TouchableOpacity style={styles.uploadCover} onPress={this._uploadCover}>
							<Image source={require('image!Posts_but_Upload')} />
							<Text style={[styles.txtLight, styles.uploadTitle]}>上传话题封面</Text>
							<Text style={[styles.txtLight, styles.uploadTips]}>请尽量保证话题封面图片的长宽比为2:1</Text>
							<Image
								style={this.state.cover ? styles.uploadImg : null}
								source={this.state.cover ? {uri: this.state.cover} : null}
							 />
						</TouchableOpacity>
					:
					null
				}
				
				{
				// {this.state.isCoverLoading
				// ?
				// <View style={styles.uploadCover}>
				// 	<View style={{flexDirection: "row", alignItems: "center"}}>
				// 		<ActivityIndicatorIOS color="white"/>
				// 		<Text style={[styles.txtLight, styles.uploadTitle, {marginTop: 0, marginBottom: 0}]}>上传中</Text>
				// 	</View>
				// </View>
				// :
				// <TouchableOpacity onPress={this._uploadCover}>
				// 	<Animatable.View style={styles.uploadCover}>
				// 	<Image source={require('image!Posts_but_Upload')} />
				// 	<Text style={[styles.txtLight, styles.uploadTitle]}>上传话题封面</Text>
				// 	<Text style={[styles.txtLight, styles.uploadTips]}>请尽量保证话题封面图片的长宽比为2:1</Text>
				// 	<Image
				// 		style={this.state.cover ? styles.uploadImg : null}
				// 		source={this.state.cover ? {uri: this.state.cover} : null}
				// 	 />
				// 	</Animatable.View>
				// </TouchableOpacity>
				// }
				}
				<View style={styles.labelContainer}>
					<View style={styles.addLabel}>
						<Text style={styles.labelTitle}>标签</Text>
						<View style={styles.labelGroup}>
							<TouchableOpacity style={styles.labelIcon} onPress={this._openModalLabel}>
								{
									this.state.addedLab.length !== 0
									?
										this.state.addedLab.length === 1?
										<Text style={[styles.labelTxt,{color: "#faa531", fontSize: 12, lineHeight: 20, borderColor: "#faa531"}]}>{this.state.addedLab[0]}</Text>:
										<Text style={[styles.labelTxt,{color: "#faa531", fontSize: 12, lineHeight: 20, borderColor: "#faa531"}]}>{this.state.addedLab[0]}...</Text>
									:
									<Image source={require('image!Posts_but_Add')} />
								}
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.addAge}>
						<Text style={styles.labelTitle}>月龄</Text>
						<View style={styles.labelGroup}>
							<TouchableOpacity style={styles.labelIcon} onPress={this._openModalAge}>
								{
									this.state.addedAge.length !== 0
									?
									<Text style={[styles.labelTxt,{color: "#faa531", fontSize: 12, lineHeight: 20, borderColor: "#faa531"}]}>{this.state.addedAge[0]}</Text>
									:
									<Image source={require('image!Posts_but_Add')} />
								}
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View style={styles.postTitle}>
					<TextInput
						style={styles.titleTxt}
						placeholder="标题"
						value={this.state.title}
						ref="textInput1"
						onChangeText={(text) => {this.setState({title: text})}}
						placeholderTextColor="#bab9a8"/>
				</View>
				<View style={styles.postContent}>
					<TextInput
						style={styles.contentTxt}
						placeholder="话题内容"
						value={this.state.content}
						ref="textInput2"
						onChangeText={(text) => {this.setState({content: text})}}
						placeholderTextColor="#bab9a8"
						multiline={true} />
				</View>

				<View style={styles.addImg}>
					<View style={styles.addImgLabel}>
						<Text style={styles.addImgLabelTop}>插入图片</Text>
						<Text style={styles.addImgLabelBottom}>（最多4张）</Text>
					</View>
					{addImgContent}
					{
						this.state.added === 4
							?
							null
							:
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

				{this.state.isTipShow ?
					<View style={styles.tipsBox}>
						<Text style={styles.tipTxt}>话题编辑以后点击返回按钮可以保存草稿！</Text>
						<TouchableOpacity onPress={this._closeTip}>
							<Image style={styles.tipsBtn} source={require('image!Posts_but_Delete')} />
						</TouchableOpacity>
					</View>
					: null }

				<Modal style={styles.modalBox} ref={"modalBoxLabel"} position={"bottom"} backdropOpacity={0}>
					<View style={styles.modalBoxHeader}>
						<Text style={styles.headerTxt}>最多可以选择3个标签</Text>
						<TouchableOpacity onPressOut={() => this._closeModal("modalBoxLabel")}>
							<Text style={styles.commitBtn}>完成</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.ageContainer}>
						<View style={styles.ageRow}>
							{
								this.state.allLab.slice(0, 4).map((e) => {
									return (
										<LabelItem style={styles.smallTxt} title={e} checked={this._LabInAdded(e)} onPress={
											() => {
												console.log("touched");
												this._addLabItem(e);
											}
										}/>
									);
								})
							}
						</View>
						<View style={styles.ageRow}>
							{
								this.state.allLab.slice(4, 8).map((e) => {
									return (
										<LabelItem style={styles.smallTxt} title={e} checked={this._LabInAdded(e)} onPress={
											() => this._addLabItem(e)
										}/>
									);
								})
							}
						</View>
						<View style={styles.ageRow}>
							{
								this.state.allLab.slice(8, 11).map((e) => {
									return (
										<LabelItem style={styles.smallTxt} title={e} checked={this._LabInAdded(e)} onPress={
											() => this._addLabItem(e)
										}/>
									);
								})
							}
							<LabelItem title="其他" style={styles.smallTxt} checked={this._LabInAdded("其他")} onPress={
								() => this._addLabItem("其他")
							}/>
						</View>
					</View>
				</Modal>

				<Modal style={styles.modalBox} ref={"modalBoxAge"} position={"bottom"} backdropOpacity={0}>
					<View style={styles.modalBoxHeader}>
						<Text style={styles.headerTxt}>最多可以选择1个月龄</Text>
						<TouchableOpacity onPressOut={() => this._closeModal("modalBoxAge")}>
							<Text style={styles.commitBtn}>完成</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.ageContainer}>
						<View style={styles.ageRow}>
							{
								this.state.allAge.slice(0, 3).map((e) => {
									return (
										<AgeItem style={styles.smallTxt} title={e} checked={this._AgeInAdded(e)} onPress={
											() => this._addAgeItem(e)}/>
									);
								})
							}
						</View>
						<View style={styles.ageRow}>
							{
								this.state.allAge.slice(3, 6).map((e) => {
									return (
										<AgeItem style={styles.smallTxt} title={e} checked={this._AgeInAdded(e)} onPress={
											() => this._addAgeItem(e)}/>
									);
								})
							}
						</View>
						<View style={styles.ageRow}>
							{
								this.state.allAge.slice(6, 9).map((e) => {
									return (
										<AgeItem style={styles.smallTxt} title={e} checked={this._AgeInAdded(e)} onPress={
											() => this._addAgeItem(e)}/>
									);
								})
							}
						</View>
					</View>
				</Modal>
				<View style={{height: this.state.keyboardSpace - 85.5}}/>
				{
					this.state.keyboardSpace === 0?
					null:
					<View style={{position: "absolute", bottom: this.state.keyboardSpace + 10, right: 10}}>
						<TouchableOpacity onPress={this._hideKeyboard}>
							<Image source={require("image!but_jianpan")} />
						</TouchableOpacity>
						{
						// <Text style={{padding: 10}}>隐藏键盘</Text>
						}
					</View>
				}
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fcfcf5',
		flex: 1
	},
	txtLight: {
		color: '#fff'
	},
	uploadCover: {
		marginLeft: 14,
		marginRight: 14,
		marginTop: 12,
		// paddingTop: 60,
		height: 185,
		// width: 347,
		borderRadius: 2,
		backgroundColor: '#99A8AD',
		alignItems: 'center',

		justifyContent: "center"
	},
	uploadTitle: {
		fontSize: 14,
		marginTop: 10,
		marginBottom: 5
	},
	uploadImg: {
		position: "absolute",
		left: 0,
		top: 0,
		width: Dimensions.get('window').width - 28,
		height: 185
	},
	uploadTips: {
		fontSize: 10,
		opacity: 0.5
	},
	labelContainer: {
		height: 46,
		paddingLeft: 14,
		paddingRight: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: '#D5C5BB',
		flexDirection: 'row',
		alignItems: 'center'
	},
	addLabel: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	labelTitle: {
		fontSize: 12,
		color: '#bab9a8',
		marginRight: 7
	},
	addAge: {
		width: 100,
		flexDirection: 'row',
		alignItems: 'center'
	},
	postTitle: {
		paddingLeft: 14,
		paddingRight: 14,
		paddingTop: 5,
		paddingBottom: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: '#D5C5BB'
	},
	titleTxt: {
		height: 30,
		color: '#223d4e',
		fontSize: 16,
		fontWeight: 'bold'
	},
	postContent: {
		paddingLeft: 14,
		paddingTop: 7,
		paddingBottom: 7,
		flex: 1
	},
	contentTxt: {
		color: '#223d4e',
		fontSize: 14,
		paddingRight: 14,
		flex: 1
	},
	addImg: {
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
	tipsBox: {
		position: 'absolute',
		bottom: (Dimensions.get('window').width - 133)/4 + 25,
		backgroundColor: '#faa531',
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 12,
		paddingRight: 12,
		height: 35,
		width: Dimensions.get('window').width,
		opacity: 0.9
	},
	tipTxt: {
		color: '#fff',
		flex: 1
	},
	tipsBtn: {
		width: 18,
		height: 18
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
	/*** 选择月龄模态框 ***/
	smallTxt: {
		fontSize: 12,
		lineHeight: 20
	},
	ageItemContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	ageItem: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	ageTxt: {
		width: 92,
		height: 30,
		lineHeight: 22,
		borderRadius: 15,
		fontSize: 14,
		color: '#bab9a8',
		borderWidth: 1,
		borderColor: '#bab9a8',
		textAlign: 'center'
	},
	modalBox: {
		height: 193,
		backgroundColor: '#fff'
	},
	modalBoxHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 12,
		height: 46,
		borderTopWidth: 1/PixelRatio.get(),
		borderTopColor: '#e8e3de',
		borderBottomWidth: 1/PixelRatio.get(),
		borderBottomColor: '#e8e3de'
	},
	headerTxt: {
		flex: 1,
		fontSize: 12,
		color: '#bab9a8',
		opacity: 0.7
	},
	commitBtn: {
		width: 60,
		textAlign: 'center',
		fontSize: 15,
		fontWeight: 'bold',
		color: '#48b8a7'
	},
	ageContainer: {
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: 15,
	},
	ageRow: {
		flexDirection: 'row',
		marginBottom: 14
	},
	/*** 选择标签模态框 ***/
	labelTxt: {
		width: 70,
		height: 30,
		lineHeight: 22,
		borderRadius: 15,
		fontSize: 14,
		color: '#bab9a8',
		borderWidth: 1,
		borderColor: '#bab9a8',
		textAlign: 'center'
	},
	labelOn: {
		color: '#faa531',
		borderColor: '#faa531'
	}
});

module.exports = PostPage;
