'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var UtilsFunctions = require('../utils/functions');
var settings = require("../utils/settings");
var TimerMixin = require('react-timer-mixin');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage,
  AlertIOS,
  ActivityIndicatorIOS
} = React;

var TimeCount = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function(){
    return {
      count: 0
    };
  },
  componentDidMount: function(){
    this.setInterval(
      () => {
        if (this.state.count - 1 >= 0){
          this.setState({count: this.state.count - 1});
        }
      },
      1000
    )
  },
  _onPress: function(){
    if(this.state.count === 0){
      this.setState({count: 60})
      this.props.onPress();
    }
  },
  render: function(){
    return (
      <Text onPress={this._onPress}>
        {this.state.count === 0 ? "获取验证码": this.state.count}
      </Text>
    )
  },
});

var RegisterPage01 = React.createClass({
  getInitialState: function(){
    return {
      general: "",
      token: "",
      password: "",
      passwordRepeat: "",
      nickname: "",
      avatar: "",
      address: "",
      showPasswordRepeat: false,
      isloading: false,
      isImgLoading: false,
    }
  },
  componentWillMount: function(){
    // AsyncStorage.setItem("isFirst", "false").done();
    AsyncStorage.multiGet(["general","address","token", "password", "passwordRepeat", "nickname", "avatar"])
    .then( values => {
      for(var value in values){
        var key = values[value][0]
        if (values[value][1] === null){
          this.setState({
            key: ""
          });
        }else{
          var r = {}
          r[key] = values[value][1]
          this.setState(r);
        };
      }
    })
    .done();
  },
  _uploadAvater: function(){
    var options = {
      title: '请选择头像', // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '从相册选取', // specify null or empty string to remove this button
      maxWidth: 400,
      maxHeight: 400,
      quality: 1,
      allowsEditing: false, // Built in iOS functionality to resize/reposition the image
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
        this.setState({isImgLoading: true});
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
            return res.json();
          })
          .then((resJson) => {
            console.log(resJson);
            this.setState({
              avatar: resJson.material
            });
            AsyncStorage.setItem("avatar", resJson.material).done();
            this.setState({isImgLoading: false});
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

  _is_mobile: function(){
    if (this.state.general === ""){
      return false
    }
    var str = /[A-Za-z]/;
    if ((this.state.general.indexOf("@") != -1) || (str.test(this.state.general))){
      return false
    }else{
      return true
    }
  },
  _show_get_token_button: function(){
    var mobile = /^0?1[34578]\d{9}$/;
    // if ((this._is_mobile) && (this.state.general.length === 11)){
    if (mobile.test(this.state.general)){
      return true
    }
    else{
      return false
    }
  },
  _get_token: function(){
    fetch(settings.serverAddress + "/api/token/mobile/bind/", {method: "POST", body:
      UtilsFunctions.object2form({
        'mobile': this.state.general
      })
    })
    .then((res) => res.json())
    .then((resJson) => {
      console.log(resJson);
      if(resJson.succ !== true ){
        alert(resJson.detail[0]);
        return false;
      }
    })
    .catch(e => {
      console.log(e);
    })
    .done();
  },
  _skip:function(){
    this.props.navigator.push({id: "home"});
  },
  _register: function(){
    this.setState({isloading: true});
    if(this.state.password !== this.state.passwordRepeat){
      alert("两次密码输入不一致，请重新输入");
      this.setState({isloading: false});      
    }
    fetch(settings.serverAddress + "/api/core/user/signup/", {method: "POST", body:
      UtilsFunctions.object2form({
        general: this.state.general,
        token: this.state.token,
        password: this.state.password,
        nickname: this.state.nickname,
        avatar: this.state.avatar,
        address: this.state.address,
      })
    })
    .then((res) => {
      if (res.status >= 200 && res.status < 300){
        this.setState({isloading: false});
      }
      return res.json();
    })
    .then((resJson) => {
      console.log(resJson);
      if(resJson.succ === true ){
        AsyncStorage.multiRemove(["general","address","token", "password","passwordRepeat", "nickname", "avatar"]).done();
        this.props.navigator.immediatelyResetRouteStack([{id:"register02"}]);
      }else{
        this.setState({isloading: false});
        AlertIOS.alert(
          null,
          resJson["detail"][0],
          [{text:'好的', onPress:() => console.log('ok')}]
        );
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
  _nextStep: function(){
    this.props.navigator.immediatelyResetRouteStack({});
    this.props.navigator.push({id: "register02"});
  },
  _goLocation: function(){
    this.props.navigator.push({id: "location"})
  },
  render: function(){
    return (
      <Image style={styles.container} source={require('image!Login2_bg')}>
        <View>
          <Text style={[styles.txtLight, styles.registerTitle]}>创建萌芽帐号</Text>
        </View>
        <TouchableOpacity onPress={this._uploadAvater}>
          {
            this.state.isImgLoading?
            <View style={{marginTop: 50, marginBottom: 50,flex: 1,justifyContent: "center", alignItems: "center"}}>
              <ActivityIndicatorIOS />
            </View>:
            <Image style={styles.avatar} source={this.state.avatar === "" ? require('image!Login2_but_Logo') : {uri: this.state.avatar}} />
          }
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <View style={styles.textInput}>
            <View>
              <Text style={[styles.label, styles.txtLight]}>用户名</Text>
            </View>
            <TextInput
              style={[styles.inputTxt, styles.txtLight]}
              clearButtonMode="while-editing"
              placeholder="邮箱/手机"
              value={this.state.general}
              onChangeText={(text) => {AsyncStorage.setItem("general", text).done();this.setState({general:text})}} />
            {
              this._show_get_token_button()?
              <View>
                <Text style={styles.txtLight}>
                  <TimeCount onPress={this._get_token}/>
                </Text>
              </View>
              : null
            }
          </View>
          {
            this._is_mobile()?
            <View style={styles.textInput}>
              <View>
                <Text style={[styles.label, styles.txtLight]}>验证码</Text>
              </View>
              <TextInput
                style={[styles.inputTxt, styles.txtLight]}
                clearButtonMode="while-editing"
                value={this.state.token}
                onChangeText={(text) => {AsyncStorage.setItem("token", text).done();this.setState({token:text})}} />
            </View>
            :null
          }
          <View style={styles.textInput}>
            <View>
              <Text style={[styles.label, styles.txtLight]}>昵&nbsp;&nbsp;&nbsp;称</Text>
            </View>
            <TextInput
              style={[styles.inputTxt, styles.txtLight]}
              clearButtonMode="while-editing"
              value={this.state.nickname}
              onChangeText={(text) => {AsyncStorage.setItem("nickname", text).done();this.setState({nickname:text})}} />
          </View>
          <View style={styles.textInput}>
            <View>
              <Text style={[styles.label, styles.txtLight]}>密&nbsp;&nbsp;&nbsp;码</Text>
            </View>
            <TextInput
              style={[styles.inputTxt, styles.txtLight]}
              clearButtonMode="while-editing"
              secureTextEntry={true}
              onFocus={() => this.setState({showPasswordRepeat: true})}
              value={this.state.password}
              onChangeText={(text) => {AsyncStorage.setItem("password", text).done();this.setState({password:text})}} />
          </View>
          {
            this.state.showPasswordRepeat?
            <View style={styles.textInput}>
              <View>
                <Text style={[styles.label, styles.txtLight]}>重复密码</Text>
              </View>
              <TextInput
                style={[styles.inputTxt, styles.txtLight]}
                clearButtonMode="while-editing"
                secureTextEntry={true}
                value={this.state.passwordRepeat}
                onChangeText={(text) => {AsyncStorage.setItem("passwordRepeat", text).done();this.setState({passwordRepeat:text})}} />
            </View>:
            null
          }
          <TouchableOpacity onPress={this._goLocation}>
            <View style={styles.textInput}>
              <View>
                <Text style={[styles.label, styles.txtLight]}>位&nbsp;&nbsp;&nbsp;置</Text>
              </View>
              <Text style={styles.txtLight}>
                {this.state.address}
              </Text>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
                <Image source={require("image!Topics_but_love_more_default")} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.nextStep} onPress={this._register}>
          {this.state.isloading?<ActivityIndicatorIOS />:<Text style={styles.nextStepTxt}>注册</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.backToLogin} onPress={this._back}>
          <Text style={styles.backToLoginTxt}>返回登录页</Text>
        </TouchableOpacity>
      </Image>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  txtLight: {
    fontSize: 12,
    color: '#fff'
  },
  registerTitle: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 15
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20
  },
  inputContainer: {
    width: Dimensions.get('window').width,
    paddingLeft: 38,
    paddingRight: 38
  },
  textInput: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)'
  },
  label: {
    // width: 58,
    paddingLeft: 5,
    marginRight: 10
  },
  inputTxt: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 7
  },
  locationImg: {
    width: 20,
    height: 20,
    marginLeft: 4,
    marginRight: 4
  },
  nextStep: {
    marginTop: 30,
    width: 180,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nextStepTxt: {
    fontSize: 15,
    color: '#48b8a7'
  },
  backToLogin: {
    width: 125,
    height: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    left: Dimensions.get('window').width/2,
    marginLeft: -62.5
  },
  backToLoginTxt: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)'
  }
});

module.exports = RegisterPage01;
