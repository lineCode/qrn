'use strict';

var React = require('react-native');
var DivideBorder = require('./DivideBorder');
var LoginPage = require('../pages/LoginPage');
var settings = require("../utils/settings");
var LoadingPage = require("../component/LoadingPage");
var defaultValue = require("../utils/defaultValue");

var {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  StatusBarIOS,
  ActivityIndicatorIOS,
  ScrollView,
  NavigatorIOS,
  TouchableOpacity,
  PixelRatio
} = React;

var UserPageContent = React.createClass({
  componentWillReceiveProps: function(){
    this._fetch();
  },
  getInitialState: function(){
    return {
      nickname: "",
      isLogin: true, //考虑调整到上一个层级
      avatar: require("image!avatar"),
      about: "你的人生才翻开了第一页，你是如白纸般纯洁的生命.你的人生才翻开了第一页，你是如白纸般纯洁的生命",
      address: "美国 西雅图",
      blocking: 0,
      likers: 0,
      followers: 23,
      following: 1,
      star: 0,
      topic_count: 0,
      discussion_count: 0,
      gender: null,
      relation: null,
      url_followers: null,
      url_following: null,
      month_tags: "0-6个月",
      star_tags: "",
      job: "婚纱设计师",
      education: "大学本科",
      signcode: null
    };
  },
  componentWillMount: function(){
    console.log(this.props.isLogin);
    if(this.state.isLogin == false){
      this.props.navigator.push({id: "login"});
      return null;
    }
    this._fetch();
  },
  _setIsLogin: function(){
    this.setState({
      isLogin: true
    });
    this._fetch();
  },
  _fetch: function(){
    fetch(settings.serverAddress + '/api/core/info/')
    .then(res => {
      console.log(res);
      if (res.status === 403){
        this.setState({isLogin: false});
      }else{
        this.setState({isLogin: true});
      }
      return res.json()
    })
    .then( resJson => {
      console.log(resJson);
      this.setState({
        nickname: resJson.nickname,
        followers: resJson.followers,
        following: resJson.following,
        gender: resJson.gender,
        likers: resJson.likers,
        address: resJson.address,
        about: resJson.about,
        avatar: resJson.avatar ? {uri: resJson.avatar} : this.state.avatar,
        star: resJson.starings,
        topic_count: resJson.topic_count,
        discussion_count: resJson.discussion_count,
        star_tags: resJson.star_tags,
        url_followers: resJson.url_followers,
        url_following: resJson.url_following,
        month_tags: resJson.month_tags,
        signcode: defaultValue.checkString(resJson.signcode, "您没有邀请码"),
        signcode_remain: defaultValue.checkUndefined(resJson.signcode_remain, "-1")
      });

    })
    .catch( e => console.log(e))
    .done();
  },
  _viewSetting: function(){
    this.props.navigator.push({id: "setting", avatar: this.state.avatar, nickname: this.state.nickname});
    // this.props.navigator.push({id: 'login'});
  },

  _viewFollowers: function(){
    this.props.navigator.push({id: "userList", passProps: {url: this.state.url_followers, title: "粉丝"}});
  },
  _viewFollowings: function(){
    this.props.navigator.push({id: "userList", passProps: {url: this.state.url_following, title: "关注"}});
  },
  _viewLikes: function(){
    this.props.navigator.push({id: "likersList", url: settings.serverAddress + "/api/core/likers/", isOther: false});
  },
  _viewTopics: function(){
    this.props.navigator.push({id: "topicsList", url: settings.serverAddress + "/api/core/topics/"});
  },
  _viewDiscs: function(){
    this.props.navigator.push({id: "discsList", url: settings.serverAddress + "/api/core/discussions/"});
  },
  _viewStars: function(){
    this.props.navigator.push({id: "starsList", url: settings.serverAddress + "/api/core/stars/"});
  },
  _goDraftList: function(){
    this.props.navigator.push({id: "draftList"});
  },
  _shareSignCode: function(){
    var { NativeAppEventEmitter } = require('react-native');
    var WXShare = NativeAppEventEmitter.addListener("WXShare",
      (ret)=>{
        console.log("share event: "+ ret.error);
        WXShare.remove();
      }
    );
    var from_swift=require("react-native").NativeModules.FromSwift;
    from_swift.shareText(this.state.signcode, 0);

    //console.log("SignCode " + this.state.signcode);
  },

  render: function(){
    if (this.state.nickname === ""){
      return <LoadingPage />
    }else{
      return (
        <ScrollView
          style={styles.scrollView}
          automaticallyAdjustContentInsets={false}>

          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={this._goDraftList}>
                <View style={styles.draft}>
                  <Text style={styles.draftTxt}>草稿箱</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._viewSetting}>
                <View>
                  <Image
                    style={styles.settingBtn}
                    source={require("image!Profile2_but_more")} />
                </View>
              </TouchableOpacity>
              <View style={styles.userName}>
                <Text style={styles.userNameTxt}>{this.state.nickname}</Text>
              </View>
            </View>

            <View style={styles.userLocation}>
              <Image
                style={styles.avatarImg}
                source={this.state.avatar} />
              <View style={styles.locationInfo}>
                <Image
                  style={styles.locationImg}
                  source={require("image!Profile2_ic_Map-Pin")} />
                <Text style={styles.locationTxt}>{this.state.address}</Text>
              </View>
            </View>
            <View style={styles.about}>
              <Text style={styles.aboutTxt}>{this.state.about}</Text>
            </View>

            <View style={styles.fansBar}>
              <View style={{flex:1}}>
                <TouchableOpacity onPress={this._viewLikes}>
                  <View style={styles.fansBarItem}>
                    <Text style={styles.fansBarNum}>{this.state.likers}</Text>
                    <Text style={styles.fansBarTxt}>获赞</Text>
                  </View>
                </TouchableOpacity>
              </View>


              <View style={{flex:1}}>
                <TouchableOpacity onPress={this._viewFollowers}>
                  <View style={styles.fansBarItem}>
                    <Text style={styles.fansBarNum}>{this.state.followers}</Text>
                    <Text style={styles.fansBarTxt}>粉丝</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex:1}}>
                <TouchableOpacity onPress={this._viewFollowings}>
                  <View style={styles.fansBarItem}>
                    <Text style={styles.fansBarNum}>{this.state.following}</Text>
                    <Text style={styles.fansBarTxt}>关注</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <DivideBorder />
            <View style={styles.list}>
              <TouchableOpacity onPress={this._viewTopics}>
                <View style={styles.listItem}>
                  <Image style={styles.itemImg} source={require('image!Profile2_ic_Pen')} />
                  <Text style={styles.itemLable}>话题</Text>
                  <Text style={styles.itemNum}>{this.state.topic_count}</Text>
                  <Image style={styles.arrowRight} source={require('image!Profile2_but_right')} />
                </View>
              </TouchableOpacity>
              <DivideBorder />
              <TouchableOpacity onPress={this._viewDiscs}>
                <View style={styles.listItem}>
                  <Image style={styles.itemImg} source={require('image!Profile2_ic_Comment')} />
                  <Text style={styles.itemLable}>评论</Text>
                  <Text style={styles.itemNum}>{this.state.discussion_count}</Text>
                  <Image style={styles.arrowRight} source={require('image!Profile2_but_right')} />
                </View>
              </TouchableOpacity>
              <DivideBorder />
              <TouchableOpacity onPress={this._viewStars}>
                <View style={styles.listItem}>
                  <Image style={styles.itemImg} source={require('image!Profile2_ic_Collection')} />
                  <Text style={styles.itemLable}>收藏</Text>
                  <Text style={styles.itemNum}>{this.state.star}</Text>
                  <Image style={styles.arrowRight} source={require('image!Profile2_but_right')} />
                </View>
              </TouchableOpacity>
              <DivideBorder />
              <TouchableOpacity onPress={this._shareSignCode}>
                <View style={styles.listItem}>
                  <Image style={styles.itemImg} source={require('image!Profile2_ic_Invitation')} />
                  <Text style={styles.itemLable}>邀请码</Text>
                  <Text style={styles.itemLableNum}>{this.state.signcode}</Text>
                </View>
              </TouchableOpacity>
              <DivideBorder />
              <View style={styles.listItemSmall}>
                <Text style={styles.itemLabelRight}>您的邀请码还能使用{this.state.signcode_remain}次</Text>
              </View>
            </View>
            <DivideBorder />
            
            <View style={styles.userInfo}>
              <Text style={styles.userInfoTitle}>个人信息</Text>
              <View style={styles.userInfoList}>
                <View style={[styles.listItem, styles.userInfoItem]}>
                  <Image style={styles.itemImg} source={require('image!Profile2_ic_Girl')} />
                  <Text style={[styles.itemLable, styles.userInfoLabel]}>{this.state.month_tags}</Text>
                </View>
                <View style={[styles.listItem, styles.userInfoItem]}>
                  <Image style={styles.itemImg} source={require('image!Profile2_ic_Hobby')} />
                  <Text style={[styles.itemLable, styles.userInfoLabel]}>{this.state.star_tags}</Text>
                </View>
                {
                // <View style={[styles.listItem, styles.userInfoItem]}>
                //   <Image style={styles.itemImg} source={require('image!Profile2_ic_Work')} />
                //   <Text style={[styles.itemLable, styles.userInfoLabel]}>{this.state.job}</Text>
                // </View>
                // <View style={[styles.listItem, styles.userInfoItem]}>
                //   <Image style={styles.itemImg} source={require('image!Profile2_ic_Education')} />
                //   <Text style={[styles.itemLable, styles.userInfoLabel]}>{this.state.education}</Text>
                // </View>
                }
              </View>
            </View>
            
          </View>
        </ScrollView>
      );
    }
  }
});


var styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fcfcf5'
  },
  container: {
    paddingBottom: 55
  },
  header: {
    backgroundColor: '#48b8a7',
    height: 120,
    flex: 1
  },
  draft: {
    width: 50,
    height: 30,
    top: 35,
    left: 14
  },
  draftTxt: {
    fontSize: 15,
    color: '#fff'
  },
  settingBtn: {
    position: 'absolute',
    right: 0,
    top: -10
  },
  userName: {
    marginLeft: 108,
    position: 'absolute',
    bottom: 12
  },
  userNameTxt: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  },
  userLocation: {
    flexDirection: 'row',
    height: 55
  },
  avatarImg: {
    width: 84,
    height: 84,
    borderRadius: 42,
    top: -42,
    marginLeft: 12,
    marginRight: 10,
    borderWidth: 4/PixelRatio.get(),
    borderColor: "#fff"
  },
  locationInfo: {
    flexDirection: 'row',
    marginTop: 12
  },
  locationImg: {
    width: 12,
    height: 12,
    marginRight: 5
  },
  locationTxt: {
    fontSize: 12,
    color: '#bab9a8'
  },
  about: {
    marginLeft: 14,
    marginRight: 14
  },
  aboutTxt: {
    fontSize: 12,
    color: '#7e8e97'
  },
  fansBar: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 12
  },
  fansBarItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  fansBarNum: {
    fontSize: 18,
    color: '#223e4d',
    textAlign: 'center',
    marginBottom: 5
  },
  fansBarTxt: {
    fontSize: 12,
    color: '#bab9a8',
    textAlign: 'center'
  },
  list: {
    paddingLeft: 14,
    backgroundColor: '#fefefa'
  },
  listItem: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center'
  },
  listItemSmall: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center'
  },
  itemImg: {
    width: 22,
    height: 22,
    marginRight: 8
  },
  itemLable: {
    flex: 1,
    fontSize: 14,
    color: '#bab9a8'
  },
  itemNum: {
    fontSize: 18,
    color: '#223e4d',
    flex: 1,
    textAlign: 'right'
  },
  itemLableNum: {
    flex: 1,
    fontSize: 14,
    color: '#bab9a8',
    textAlign: 'right',
    marginRight: 14
  },
  itemLabelRight: {
    flex: 1,
    fontSize: 12,
    color: '#bab9a8',
    textAlign: 'right',
    marginRight: 14
  },
  arrowRight: {
    marginLeft: 14,
    marginRight: 14
  },
  userInfoItem: {
    height: 38
  },
  userInfoLabel: {
    fontSize: 13
  },
  userInfo: {
    paddingLeft: 14,
    paddingTop: 22
  },
  userInfoTitle: {
    fontSize: 14,
    color: '#7e8e97',
    fontWeight: 'bold'
  },
  userInfoList: {
    marginTop: 10
  }
});


module.exports = UserPageContent;
