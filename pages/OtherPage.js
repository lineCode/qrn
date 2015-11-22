'use strict';

var React = require('react-native');
var DivideBorder = require('../component/DivideBorder');
var UtilsFunctions = require('../utils/functions');
var settings = require("../utils/settings");
var LoadingPage = require("../component/LoadingPage");
var FocusButton = require("../component/FocusButton");

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
  TouchableWithoutFeedback,
  ActionSheetIOS,
  InteractionManager,
  PixelRatio
} = React;

var BUTTONS = [
    '加入黑名单',
    '举报',
    '取消'
];

var ActionSheetEdit = React.createClass({
  getInitialState: function(){
    return {
      clicked: 'none',
    };
  },
  showActionSheet: function(){
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: 2
    },
    (buttonIndex) => {
      console.log(buttonIndex);
      if(buttonIndex === 1){
        //举报
        fetch(settings.serverAddress + "/api/purify/commit/user/", {method: "POST", body:
          UtilsFunctions.object2form({
            target_object_id: this.props.userId,
            description: "违规"
          })
        })
        .then((res) => {
          console.log(res);
          if(res.status === 201){
            AlertIOS.alert("举报成功");
          }
        })
        .catch(e => {
          console.log(e);
        })
        .done();
      }
      else if(buttonIndex === 0){
        //加入黑名单
        console.log(buttonIndex);
        fetch(settings.serverAddress + "/api/relation/blocking/" + this.props.userId + "/", {method: "DELETE"})
        .then((res) => {
          console.log(res);
          if(res.status === 204){
            AlertIOS.alert("拉黑成功");
          }
        })
        .catch(e => {
          console.log(e);
        })
        .done();
      }
    })
  },
  render: function(){
    return (
      <TouchableOpacity style={styles.moreInfo} onPress={this.showActionSheet}>
        <Image source={require("image!Profile2_but_more")} />
      </TouchableOpacity>
    );
  }
});

var OtherPage = React.createClass({
  componentWillReceiveProps: function(){
    this._fetch();
  },
  getInitialState: function(){
    return {
      nickname: "",
      isLogin: true, //考虑调整到上一个层级
      avatar: require("image!avatar"),
      about: "你的人生才翻开了第一页，你是如白纸般纯洁的生命.你的人生才翻开了第一页，你是如白纸般纯洁的生命",
      address: "未知",
      blocking: 0,
      likers: 0,
      followers: 0,
      followings: 0,
      star: 0,
      topic_count: 0,
      discussion_count: 0,
      userid: null,
      gender: null,
      relation: null,
      url_followers: null,
      url_following: null,
      month: "0-6个月",
      hobby: "跑步 烘焙 插花",
      job: "婚纱设计师",
      education: "大学本科"
    };
  },
  componentDidMount: function(){
    InteractionManager.runAfterInteractions(() => {
      this._fetch();
    });
  },

  _setIsLogin: function(){
    this.setState({
      isLogin: true
    });
    this._fetch();
  },
  _fetch: function(){
    fetch(settings.serverAddress + '/api/core/' + this.props.userid +'/info/')
    .then(res => {
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
        userid: resJson.userid,
        nickname: resJson.nickname,
        followers: resJson.followers,
        following: resJson.following,
        likers: resJson.likers,
        star: resJson.starings,
        topic_count: resJson.topic_count,
        discussion_count: resJson.discussion_count,
        about: resJson.about,
        gender: resJson.gender,
        address: resJson.address,
        avatar: resJson.avatar ? {uri: resJson.avatar} : this.state.avatar,
        relation: resJson.relation,
        url_followers: resJson.url_followers,
        url_following: resJson.url_following
      });

    })
    .catch( e => console.log(e))
    .done();
  },
  _viewSetting: function(){
    this.props.navigator.push({id: "setting", passProps:{title:'设置'}});
  },
  _viewFollowers: function(){
    this.props.navigator.push({id: "userList", passProps: {url: this.state.url_followers, title: "粉丝"}});
  },
  _viewFollowings: function(){
    this.props.navigator.push({id: "userList", passProps: {url: this.state.url_following, title: "关注"}});
  },
  _viewLikes: function(){
    this.props.navigator.push({id: "likersList", url: settings.serverAddress + "/api/core/"+ this.props.userid +"/likers/", isOther: true});
  },
  _viewTopics: function(){
    this.props.navigator.push({id: "topicsList", url: settings.serverAddress + "/api/core/" + this.props.userid + "/topics/"});
  },
  _viewDiscs: function(){
    this.props.navigator.push({id: "discsList", url: settings.serverAddress + "/api/core/" + this.props.userid + "/discussions/"});
  },
  _viewStars: function(){
    this.props.navigator.push({id: "starsList", url: settings.serverAddress + "/api/core/" + this.props.userid + "/stars/"});
  },
  _back: function(){
    this.props.navigator.pop();
  },
  _message: function(){
    this.props.navigator.push({id: "messageDetails", passProps: {userId: this.props.userid ,userName:this.state.nickname}});
  },
  _focus: function(){
    fetch(settings.serverAddress + "/api/relation/following/", {method: "POST", body:
      UtilsFunctions.object2form({
        'follow_key': this.props.userid,
      })
    })
    .then((res) => {
      console.log(res);
      return res.json()
    })
    .then((resJson) => {
      console.log(resJson);
      if(resJson.succ === true ){
        this._fetch();
        console.log("关注成功");
      }
    })
    .catch(e => {console.log(e);})
    .done();
  },
  render: function(){
    if (this.state.nickname === ""){
      return <LoadingPage />
    }
    if (this.state.isLogin){
      return (
        <ScrollView
          style={styles.scrollView}
          automaticallyAdjustContentInsets={false}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={{flexDirection: "row", flex: 1, marginTop: 18}}>
                <TouchableOpacity onPress={this._back}>
                  <Image source={require("image!Profile2_but_Back_white")} />
                </TouchableOpacity>
                <View style={{flexDirection: "row", flex: 1, justifyContent: "flex-end"}}>
                  <ActionSheetEdit userId={this.state.userId}/>
                </View>
              </View>
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

              <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end", marginTop: 6}}>
                <TouchableWithoutFeedback onPress={this._message}>
                  <Image source={require("image!Profile2_but_Message")} />
                </TouchableWithoutFeedback>
                <View style={{}}>
                  <FocusButton userid={this.state.userid} type="1" relation={this.state.relation} style={{marginRight: 14}}/>
                </View>
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
            </View>
            <DivideBorder />
{
            // <View style={styles.userInfo}>
            //     <Text style={styles.userInfoTitle}>个人信息</Text>
            //     <View style={styles.userInfoList}>
            //       <View style={[styles.listItem, styles.userInfoItem]}>
            //         <Image style={styles.itemImg} source={require('image!Profile2_ic_Girl')} />
            //         <Text style={[styles.itemLable, styles.userInfoLabel]}>{this.state.month}</Text>
            //       </View>
            //       <View style={[styles.listItem, styles.userInfoItem]}>
            //         <Image style={styles.itemImg} source={require('image!Profile2_ic_Hobby')} />
            //         <Text style={[styles.itemLable, styles.userInfoLabel]}>{this.state.hobby}</Text>
            //       </View>
            //       <View style={[styles.listItem, styles.userInfoItem]}>
            //         <Image style={styles.itemImg} source={require('image!Profile2_ic_Work')} />
            //         <Text style={[styles.itemLable, styles.userInfoLabel]}>{this.state.job}</Text>
            //       </View>
            //       <View style={[styles.listItem, styles.userInfoItem]}>
            //         <Image style={styles.itemImg} source={require('image!Profile2_ic_Education')} />
            //         <Text style={[styles.itemLable, styles.userInfoLabel]}>{this.state.education}</Text>
            //       </View>
            //     </View>
            // </View>
}
          </View>
        </ScrollView>
    )}else{
      return (
        <Login style={styles.container} _setIsLogin={this._setIsLogin}/>
      )
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
    height: 140,
    flex: 1
  },
  draft: {
    width: 100,
    top: 15,
  },
  draftTxt: {
    fontSize: 15,
    color: '#fff'
  },
  settingBtn: {
    position: 'absolute',
    top: -25,
    right: 0
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
    height: 50
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
    marginTop: 20
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
  }
});


module.exports = OtherPage;
