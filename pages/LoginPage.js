'use strict';

var React = require('react-native');
var UtilsFunctions = require('../utils/functions');
var UserPageContent = require('../component/UserPageContent');
var Dimensions = require('Dimensions');
var settings = require("../utils/settings");

var {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  StatusBarIOS,
  ActionSheetIOS,
  AlertIOS
} = React;

var serverAddressList = [
]

var LoginPage = React.createClass({
  getInitialState: function(){
    return {
      isLogin: false,
      username: "",
      password: "",
      isloading: false
    }
  },
  _skip:function(){
    this.props.navigator.push({id: "home"});
  },
  _register: function(){
    this.props.navigator.push({id: "register01", _setIsLogin:this.props._setIsLogin});
  },
  _setAddress: function(){
    ActionSheetIOS.showActionSheetWithOptions({
      options: serverAddressList,
      cancelButtonIndex: 3
    },
    (buttonIndex) => {
        console.log(buttonIndex);
        if (buttonIndex === 2){
          console.log("输入服务器地址");
          AlertIOS.prompt("输入服务器地址",
            "sssss",
            [
              {text: '取消', onPress: () => console.log('取消 Pressed!')},
              {text: '保存', onPress: (text) => settings.serverAddress = "http://" + text},
            ]);
        }else{
          settings.serverAddress = serverAddressList[buttonIndex];
        }
      })
    },
  _login: function(){
    this.setState({isloading: true});
    if(!this.state.username || !this.state.password){
      AlertIOS.alert(
        null,
        '用户名或密码不能为空',
        [{text:'好的', onPress:() => console.log('ok')}]
      );
      return;
    }
    else{
      fetch(settings.serverAddress + "/user/api/login/", {method: "POST", body:
        UtilsFunctions.object2form({
          'username': this.state.username,
          'password': this.state.password
        })
      })
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
        if(resJson.succ === true ){
          this.props._setIsLogin();
          AsyncStorage.setItem("isLogin", "true").done();
          this.props.navigator.immediatelyResetRouteStack([{id:"home"}]);
        }
        else {
          console.log(resJson);
          this.setState({isloading: false});
          AlertIOS.alert(
            null,
            resJson["detail"][0],
            [{text:'好的', onPress:() => console.log('ok')}]
          );
          return false;
        }
      })
      .catch(e => {
        console.log(e);
      })
      .done();
    }
  },
  render: function(){
    if(this.state.isLogin == false){
      return (
        <Image style={styles.container} source={require('image!Login_bg')}>
          <TouchableOpacity style={styles.skipBtn} onPress={this._skip}>
            <Text style={styles.skipTxt}>跳过</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.appTitle, styles.txtDark]}>小萌芽</Text>
          </View>
          <Image style={styles.appIcon} source={require('image!Login_but_Head')} />

          <View style={styles.inputContainer}>
            <View style={styles.textInput}>
              <View>
                <Text style={[styles.label, styles.txtDark]}>用户名</Text>
              </View>
              <TextInput
                style={[styles.inputTxt, styles.txtDark]}
                clearButtonMode="while-editing"
                placeholder="手机号或邮箱"
                onChangeText={(text) => this.setState({username: text})}
                value={this.state.username} />
            </View>
            <View style={styles.textInput}>
              <View>
                <Text style={[styles.label, styles.txtDark]}>密&nbsp;&nbsp;&nbsp;码</Text>
              </View>
              <TextInput
                style={[styles.inputTxt, styles.txtDark]}
                clearButtonMode="while-editing"
                password={true}
                value={this.state.password}
                onChangeText={(text) => this.setState({password: text})} />
              <Image style={styles.forgetImg} source={require('image!Login_but__Forget')} />
            </View>
          </View>
          <View style={styles.loginBtn}>
            <TouchableOpacity onPress={this._login}>
              <View style={styles.loginBtnInn}>
                <Text style={styles.loginBtnTxt}>{this.state.isloading ?"登录中……":"登 录"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.otherLogin,styles.txtDark}>其他帐号登录</Text>
          </View>
          <View style={styles.otherAccount}>
            <Image style={styles.otherAccountImg} source={require('image!Login_but_Micro-blog')} />
            <Image style={styles.otherAccountImg} source={require('image!Login_but_WeChat')} />
          </View>

          <View style={styles.registerBtn}>
            <TouchableOpacity onPress={this._register} onLongPress={() => this._setAddress()} delayLongPress={5000}>
              <Text style={styles.registerBtnTxt}>创建萌芽帐号</Text>
            </TouchableOpacity>
          </View>
        </Image>
      );
    } else {
      return ( <UserPageContent /> );
    }
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  txtDark: {
    color: '#223e4d'
  },
  skipBtn: {
    position: 'absolute',
    top: 30,
    right: 25
  },
  skipTxt: {
    fontSize: 15,
    color: '#48b8a7',
  },
  appTitle: {
    fontSize: 15,
    marginTop: 30
  },
  appIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    marginTop: 12,
    marginBottom: 30
  },
  loginTitle: {
    fontSize: 12
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
    borderBottomColor: '#92A9B3'
  },
  label: {
    fontSize: 12,
    width: 50
  },
  inputTxt: {
    fontSize: 12,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 7
  },
  forgetImg: {
    width: 16,
    height: 16,
    marginRight: 4,
    marginLeft: 4
  },
  loginBtnInn: {
    width: 180,
    height: 40,
    borderRadius: 2,
    backgroundColor: '#48b8a7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginBtn: {
    marginTop: 30,
    marginBottom: 30,
    // opacity: 0.5,
    flexDirection: 'row',
  },
  loginBtnTxt: {
    color: '#fff',
    // opacity: 0.7,
    fontSize: 15
  },
  otherLogin: {
    color: '#fff',
    fontSize: 12
  },
  otherAccount: {
    flexDirection: 'row'
  },
  otherAccountImg: {
    width: 44,
    marginLeft: 5,
    marginRight: 5,
    height: 44,
    marginTop: 5
  },
  registerBtn: {
    width: 125,
    height: 30,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 2,
    paddingTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    bottom: 30,
    left: Dimensions.get('window').width/2,
    marginLeft: -62.5
  },
  registerBtnTxt: {
    color: '#fff',
    fontSize: 12,
    width: 125,
    height: 30,
    textAlign: 'center'
  }
});

module.exports = LoginPage;
