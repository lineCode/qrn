'use strict';

var React = require('react-native');
var utilsMixin = require('../utils/utilsMixin');
var NavHeader = require("../component/NavHeader");
var Address = require("../component/Address");
var settings = require("../utils/settings");
var UtilsFunctions = require('../utils/functions');

var {
   Text,
   Image,
   PixelRatio,
   View,
   ScrollView,
   ListView,
   ActionSheetIOS,
   StyleSheet,
   AlertIOS,
   TouchableOpacity,
   TouchableHighlight,
 } = React;

 var BUTTONS = {
   0: [
     '举报',
     '取消'
   ],
   1: [
     "编辑",
     "取消"
   ],
   2: [
     "设为优评",
     "举报",
     "取消"
   ],
   3: [
     "设为优评",
     "编辑",
     "取消"
   ]
 };

 var PURIFY_TYPE = [
   "发布虚假信息、谣言",
   "发布广告或垃圾信息",
   "不友善内容",
   "违反法律法规内容",
   "其他",
   "取消"
 ]

 var ActionSheetEdit = React.createClass({
   getInitialState: function(){
     return {
       clicked: 'none',
     };
   },
   showActionSheet: function(){
     ActionSheetIOS.showActionSheetWithOptions({
       options: BUTTONS[this.props.role],
       cancelButtonIndex: this.props.role >= 2 ? 2: 1
     },
     (buttonIndex) => {
       console.log(buttonIndex);
       if(this.props.role === 0){
         if(buttonIndex === 0){
           purifyDiscussion(this.props.topicId);
         }
       }
       else if(this.props.role === 1){
         if(buttonIndex === 0){
           console.log("编辑啦");
         }
       }
       else if(this.props.role === 2){
         if(buttonIndex === 0){
           setDiscussionGood(this.props.topicId);
         }else if(buttonIndex === 1){
          purifyDiscussion(this.props.topicId);
         }
       }
       else if(this.props.role === 3){
         if(buttonIndex === 0){
          // console.log("haha")
          setDiscussionGood(this.props.topicId);
         }
       }
     })
   },
   render: function(){
     return (
       <TouchableOpacity style={styles.moreInfo} onPress={this.showActionSheet}>
         <Image source={require("image!Profile2_but_more2")} />
       </TouchableOpacity>
     );
   }
 });

function setDiscussionGood(topicId){
  fetch(settings.serverAddress + "/api/core/discussion/" + topicId + "/review/", {method: "PUT"})
  .then((res) => {
  alert("设置优评成功")
  console.log(res);
  })
  .catch(e => {
   console.log(e);
  })
  .done();
}

function purifyDiscussion(topicId){
  ActionSheetIOS.showActionSheetWithOptions({
    options: PURIFY_TYPE,
    cancelButtonIndex: 5
  },(buttonIndex) => {
    if (buttonIndex === 5){
      return;
    }
    fetch(settings.serverAddress + "/api/purify/commit/discussion/", {method: "POST", body:
      UtilsFunctions.object2form({
        target_object_id: topicId,
        description: PURIFY_TYPE[buttonIndex]
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
  })
}

var Discussion = React.createClass({
   mixins: [utilsMixin],
   getInitialState: function(){
     return {
       avater: require("image!avatar"),
       nickname: "加载中",
       userid: 11,
       address: "加载中",
       timesince: "加载中",
       content: "",
       pk: 0,
       comment_count: 0,
       star_count: 0,
       like_count: 0,
       role: 0,
       is_like: false,
       is_star: false,
       ContentImg: []
     };
   },
   _like: function(){
     if(this.state.is_like){
       fetch(settings.serverAddress + "/api/core/discussion/" + this.props.pk + "/unlike/", {method: "DELETE"})
       .then((res) => {
         return res.json();
       })
       .then((resJson) => {
         console.log(resJson);
         if(resJson.succ === true){
           // this._fetch();
           this.setState({is_like: false});
         }
       })
       .catch(e => {console.log(e);})
       .done();
     }
     else{
       fetch(settings.serverAddress + "/api/core/discussion/liking/", {method: "POST", body:
         UtilsFunctions.object2form({
           'follow_key': this.props.pk,
         })
       })
       .then((res) => {
         return res.json();
       })
       .then((resJson) => {
         console.log(resJson);
         if(resJson.pk){
           // this._fetch();
           this.setState({is_like: true});
         }
       })
       .catch(e => {console.log(e);})
       .done();
     }
   },
   _star: function(){
     if(this.state.is_star){
       fetch(settings.serverAddress + "/api/core/discussion/" + this.props.pk + "/unstar/", {method: "DELETE"})
       .then((res) => {
         return res.json();
       })
       .then((resJson) => {
         console.log(resJson);
         if(resJson.succ === true){
           // this._fetch();
           this.setState({is_star: false});
         }
       })
       .catch(e => {console.log(e);})
       .done();
     }
     else{
       fetch(settings.serverAddress + "/api/core/discussion/staring/", {method: "POST", body:
         UtilsFunctions.object2form({
           'follow_key': this.props.pk,
         })
       })
       .then((res) => {
         return res.json();
       })
       .then((resJson) => {
         console.log(resJson);
         if(resJson.pk){
           // this._fetch();
           this.setState({is_star: true});
         }
       })
       .catch(e => {console.log(e);})
       .done();
     }
   },
   componentWillMount: function(){
     this._fetch();
   },
   _fetch: function(){
     fetch(settings.serverAddress + "/core/api/discussion/" + this.props.pk + "/")
     .then(res => {
       console.log(res);
       return res.json();
     })
     .then(res => {
         console.log(res);
         this.setState({
           content: res.content,
           avatar: {uri: res.user.avatar},
           nickname: res.user.nickname,
           address: res.user.address,
           timesince: res.timesince,
           pk: res.pk,
           comment_count: res.comment_count,
           star_count: res.star_count,
           like_count: res.like_count,
           role: res.role,
           is_like: res.is_liked,
           is_star: res.is_stared,
           ContentImg: res.images
         });
       }
     )
     .catch(e => console(e))
     .done
   },
   _goReply: function(){
     this.props.navigator.push({id: "replys", replyId: this.state.pk});
   },
   _generateContentImg:function(){
     console.log(this.state.ContentImg);
     if (this.state.ContentImg.length === 0){
       return null
     }else{
       var ContentImgs = this.state.ContentImg.slice(0,4).map((e) => {
         return <Image style={{flex: 1, height: 60, marginRight: 10}} source={{uri: e.image}} />
       });
       var ctl = ContentImgs.length
       for (var i=0;i < 4 - ctl;i++)
       {
         ContentImgs.push(
           <View style={{flex: 1,margin: 5}}/>
         );
       }
       console.log(ContentImgs);
       return (
         <View style={{flexDirection: "row", marginLeft: 14, marginBottom: 10, marginRight: 4}}>
           {ContentImgs}
         </View>
       );
     }
   },
   render: function(){
     return (
       <View style={{flex: 1}}>
       <ScrollView
         automaticallyAdjustContentInsets={false}
         stickyHeaderIndices={[0]}
       >
         <View style={styles.header}>
           <TouchableHighlight underlayColor="#48b8a7" onPress={this._back}  style={{flex: 1}}>
             <Image source={require("image!Profile2_but_Back_white")} />
           </TouchableHighlight>
           <Text style={styles.headerText}>{this.props.title}</Text>
           <TouchableHighlight style={styles.headerRight} underlayColor="#48b8a7" onPress={this._back}>
             <Image source={require("image!Profile2_but_share_white")} />
           </TouchableHighlight>
         </View>
         <View style={styles.commentHead}>
           <Image source={this.state.avatar} style={styles.avatar} />
           <View style={{marginLeft: 12}}>
             <Text style={styles.userName} onPress={(e) => this._goOtherPage(this.state.userid)}>{this.state.nickname}</Text>
             <Address address={this.state.address} />
           </View>
           <View style={{justifyContent: "flex-end", flexDirection: "row", flex: 1}}>
             <ActionSheetEdit role={this.state.role} topicId={this.props.pk} />
           </View>
         </View>
         <View style={{justifyContent: "flex-end", flex: 1}}>
           <Text style={styles.content}>{this.state.content}</Text>
           {this._generateContentImg()}
           <Text style={styles.time}>{this.state.timesince}</Text>
           <View style={{height: 50}} />
         </View>
       </ScrollView>
       <View style={{flexDirection: "row", position: "absolute", bottom: 0, left: 0, right:0}}>
          <TouchableHighlight style={styles.bottomTab} underlayColor="#ccc" onPress={this._like}>
            <View style={styles.bottomTabContainer}>
              <Image source={this.state.is_like?
                require("image!Topics_review_but_love_selected"):
                require("image!Topics_review_but_love_default")}
              />
              <Text style={styles.bottomTabText}>{this.state.like_count}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.bottomTab} underlayColor="#ccc" onPress={this._goReply}>
            <View style={styles.bottomTabContainer}>
              <Image source={require("image!Topics_review_but_reply_default")}/>
              <Text style={styles.bottomTabText}>{this.state.comment_count}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.bottomTab} underlayColor="#ccc" onPress={this._star}>
            <View style={styles.bottomTabContainer}>
              <Image source={this.state.is_star
                ?
                require("image!Topics_review_but_collect_selected"):
                require("image!Topics_review_but_collect_default")}
              />
              <Text style={[styles.bottomTabText, {fontSize: 12, fontWeight: "normal"}]}>收藏</Text>
            </View>
          </TouchableHighlight>
       </View>
       </View>
     )
   },
 });

var styles = StyleSheet.create({
  commentHead: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 14
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  userName: {
    color: "#48b8a7",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  time: {
    color: "#bab9a8",
    fontSize: 12,
    textAlign: "right",
    marginRight: 14
  },
  content: {
    marginLeft: 14,
    marginRight: 14,
    color: "#384543",
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 25,
  },
  bottomTab: {
    height: 50,
    borderColor: "#ebebe5",
    borderWidth: 1/PixelRatio.get(),
    backgroundColor: "#fcfcf6",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
      height: 60,
      justifyContent: "center",
      alignItems: 'center',
      backgroundColor: '#48b8a7',
      flexDirection: 'row',
      paddingTop: 15
  },
  headerText: {
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    flex: 1
  },
  headerRight:{
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  bottomTabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#223e4d",
    paddingLeft: 7
  },
  bottomTabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

module.exports = Discussion;
