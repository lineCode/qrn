/**
 * Created by caoyawen-gongzuo on 15/11/20.
 */
'use strict';
var React = require('react-native');

var {View, TouchableOpacity, Text, StyleSheet} = React;

var DebugPage = React.createClass({
  render: function () {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this._weibo_login}>
          <Text style={styles.button_text}>
            微博登录
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this._weixin_login}>
          <Text style={styles.button_text}>
            微信登录
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this._image_crop}>
          <Text style={styles.button_text}>
            图片剪切
          </Text>
        </TouchableOpacity>

      </View>
    );
  },
  _image_crop: function () {
    console.log("图片剪切");
  },
  _weixin_login: function () {
    var { NativeAppEventEmitter } = require('react-native');
    var WXLogin = NativeAppEventEmitter.addListener("WXLogin",
      (ret)=> {
        console.log("微信登录");
        console.log(ret);
        console.log("city : " + ret.city);
        console.log("country : " + ret.country);
        console.log("headimgurl : " + ret.headimgurl);
        console.log("language : " + ret.language);
        console.log("nickname : " + ret.nickname);
        console.log("openid : " + ret.openid);
        //下面这个不要取得
        //console.log("privilege : " + ret.privilege);
        console.log("province : " + ret.province);
        console.log("sex : " + ret.sex);
        console.log("unionid : " + ret.unionid);
        WXLogin.remove();
      }
    );
    var from_swift = require("react-native").NativeModules.FromSwift;
    from_swift.loginWX();

  },
  _weibo_login: function () {
    console.log("微博登录");
    var { NativeAppEventEmitter } = require('react-native');
    var WeiboLoginDelegate = NativeAppEventEmitter.addListener("WBLogin",
      (ret)=> {
        console.log("来自微博登录");
        if (ret.error_code == 0) {
          console.log("name: " + ret.name);
          console.log("profile_img: " + ret.profile_img);
          console.log("user_id: " + ret.user_id);
          console.log("access_token: " + ret.access_token);
          console.log("refresh_token: " + ret.refresh_token);
          console.log("expiration_date: " + ret.expiration_date);
          console.log("ret all:" + ret);
          console.log("userID: " + ret.userID);
          console.log("userClass: " + ret.userClass);
          console.log("screenName: " + ret.screenName);
          console.log("name: " + ret.name);
          console.log("province: " + ret.province);
          console.log("city: " + ret.city);
          console.log("location: " + ret.location);
          console.log("userDescription: " + ret.userDescription);
          console.log("url: " + ret.url);
          console.log("profileImageUrl: " + ret.profileImageUrl);
          console.log("coverImageUrl: " + ret.coverImageUrl);
          console.log("coverImageForPhoneUrl: " + ret.coverImageForPhoneUrl);
          console.log("profileUrl: " + ret.profileUrl);
          console.log("userDomain: " + ret.userDomain);
          console.log("weihao: " + ret.weihao);
          console.log("gender: " + ret.gender);
          console.log("followersCount: " + ret.followersCount);
          console.log("friendsCount: " + ret.friendsCount);
          console.log("pageFriendsCount: " + ret.pageFriendsCount);
          console.log("statusesCount: " + ret.statusesCount);
          console.log("favouritesCount: " + ret.favouritesCount);
          console.log("createdTime: " + ret.createdTime);
          console.log("isFollowingMe: " + ret.isFollowingMe);
          console.log("isFollowingByMe: " + ret.isFollowingByMe);
          console.log("isAllowAllActMsg: " + ret.isAllowAllActMsg);
          console.log("isAllowAllComment: " + ret.isAllowAllComment);
          console.log("isGeoEnabled: " + ret.isGeoEnabled);
          console.log("isVerified: " + ret.isVerified);
          console.log("verifiedType: " + ret.verifiedType);
          console.log("remark: " + ret.remark);
          console.log("statusID: " + ret.statusID);
          console.log("ptype: " + ret.ptype);
          console.log("avatarLargeUrl: " + ret.avatarLargeUrl);
          console.log("avatarHDUrl: " + ret.avatarHDUrl);
          console.log("verifiedReason: " + ret.verifiedReason);
          console.log("verifiedTrade: " + ret.verifiedTrade);
          console.log("verifiedReasonUrl: " + ret.verifiedReasonUrl);
          console.log("verifiedSource: " + ret.verifiedSource);
          console.log("verifiedSourceUrl: " + ret.verifiedSourceUrl);
          console.log("verifiedState: " + ret.verifiedState);
          console.log("verifiedLevel: " + ret.verifiedLevel);
          console.log("onlineStatus: " + ret.onlineStatus);
          console.log("biFollowersCount: " + ret.biFollowersCount);
          console.log("language: " + ret.language);
          console.log("star: " + ret.star);
          console.log("mbtype: " + ret.mbtype);
          console.log("mbrank: " + ret.mbrank);
          console.log("block_word: " + ret.block_word);
          console.log("block_app: " + ret.block_app);
          console.log("credit_score: " + ret.credit_score);
        } else {
          console.log("error_msg: " + ret.error_msg);
          console.log("error_code: " + ret.error_code);
        }
        WeiboLoginDelegate.remove();
      }
    );
    var WeiboDelegate = require("react-native").NativeModules.WeiboDelegate;
    WeiboDelegate.setDebugOutput(true);
    WeiboDelegate.login();
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    borderWidth: 1,
    borderStyle: "dotted",
    borderRadius: 5,
    backfaceVisibility: "hidden",
    shadowOffset: {width: 2, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.5,
    backgroundColor: 'rgba(0,0,0,0)',
    height: 30,
    marginTop: 10,
  },
  button_text: {
    textAlign: 'center',
    backfaceVisibility: "hidden",
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
  },
});

module.exports = DebugPage;
