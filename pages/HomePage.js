'use strict';

var React = require('react-native');
var Swiper = require('react-native-swiper');
var FloatButton = require('../component/FloatButton');
var utilsMixin = require('../utils/utilsMixin');
var settings = require("../utils/settings");

var {
   StyleSheet,
   TabBarIOS,
   Text,
   Navigator,
   AppRegistry,
   NavigatorIOS,
   Image,
   Dimensions,
   View,
   AsyncStorage,
   StatusBarIOS,
   ListView,
   TouchableOpacity,
   TouchableWithoutFeedback,
 } = React;

var HomePage = React.createClass({
  mixins: [utilsMixin],
  componentWillReceiveProps: function(){
    this._fetch();
  },
  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      r: this.props.r,
      isLogin: "false"
    }
  },
  _fetch: function(){
    fetch(settings.serverAddress + "/api/core/home/")
    .then((res) => {
      return res.json();
    })
    .then((resJson) => {
      console.log(resJson);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([resJson["slides"]].concat(resJson["topics"]))
      });
    })
    .catch(e => {
      console.log(e);
    })
    .done();
  },
  componentWillMount: function(){
    this.componentWillReceiveProps();
    AsyncStorage.getItem("isLogin")
    .then(value => {
      this.setState({isLogin: value});
      console.log(value);
    })
    .done();
  },
  _renderRow: function(rowData){
    if (rowData instanceof Array){
      return (
        <View>
          <Swiper height={200}
            dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 5, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 10,}} />}
            activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 10,}} />}
            paginationStyle={{
              bottom: 0, left: null, right: 10,
            }} autoplay={true} autoplayTimeout={5}>
            <View style={styles.slide}>
              <TouchableWithoutFeedback onPress={(e) => this._goTopic(rowData[0].pk)}>
                <Image style={styles.image} source={{uri: rowData[0].cover}} />
              </TouchableWithoutFeedback>
              <Text onPress={(e) => this._goTopic(rowData[0].pk)} style={{marginTop: 2,marginLeft: 10,fontWeight: "bold", fontSize: 20, color: "white", position: "absolute", bottom : 10}}>{rowData[0].title}</Text>
            </View>
            <View style={styles.slide}>
              <TouchableWithoutFeedback onPress={(e) => this._goTopic(rowData[1].pk)}>
                <Image style={styles.image} source={{uri: rowData[1].cover}} />
              </TouchableWithoutFeedback>
              <Text onPress={(e) => this._goTopic(rowData[0].pk)} style={{marginTop: 2,marginLeft: 10,fontWeight: "bold", fontSize: 20, color: "white", position: "absolute", bottom : 10}}>{rowData[1].title}</Text>
            </View>
            <View style={styles.slide}>
              <TouchableWithoutFeedback onPress={(e) => this._goTopic(rowData[2].pk)}>
                <Image style={styles.image} source={{uri: rowData[2].cover}} />
              </TouchableWithoutFeedback>
              <Text onPress={(e) => this._goTopic(rowData[0].pk)} style={{marginTop: 2,marginLeft: 10,fontWeight: "bold", fontSize: 20, color: "white", position: "absolute", bottom : 10}}>{rowData[2].title}</Text>
            </View>
          </Swiper>
        </View>
      )
    }
    else{
      return (
        <View style={{paddingTop: 10, paddingBottom: 10, borderTopColor: "#fcfcf5", borderLeftColor: "#fcfcf5",borderRightColor: "#fcfcf5",borderBottomColor: '#e6e0d8',borderWidth: 1,}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={(e) => this._goOtherPage(rowData.user)}>
              <Image style={styles.thumbnail} source={{uri: rowData.avatar_url}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => this._goOtherPage(rowData.user)}>
              <Text style={{marginLeft: 8,fontSize:12, fontWeight: "bold", color: "#48b8a7"}}>{rowData.nickname}</Text>
            </TouchableOpacity>
            <Text style={{marginLeft: 8,fontSize:11, color: "#bab9a8"}}>发布了</Text>
            <View style={{position: "absolute", right: 5, flexDirection: "row", alignItems: "center"}}>
              <View style={{justifyContent: "center", height: 18,marginRight: 6, borderColor: "#faa531", borderWidth: 1, borderRadius: 9}}>
                <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.tags.join("-")}</Text>
              </View>
              <View style={{justifyContent:"center",height: 18, borderColor: "#faa531", borderWidth: 1, borderRadius: 9}}>
                <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.month_str}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={(e) => this._goTopic(rowData.pk)}>
            <Text style={{fontWeight: "bold", fontSize: 16, color: "#223e4d", marginLeft: 14, marginTop: 12}}>{rowData.title}</Text>
          </TouchableOpacity>
          <View style={styles.abstract}>
            <TouchableOpacity onPress={(e) => this._goTopic(rowData.pk)}>
              <Image style={styles.coverImage} source={rowData.cover?{uri: rowData.cover}:require("image!default_cover")} />
            </TouchableOpacity>
              <View style={styles.abstractTextWrapper}>
              <TouchableOpacity onPress={(e) => this._goTopic(rowData.pk)}>
                <Text style={styles.abstractText} allowFontScaling={false}>{rowData.content.replace("/\s/g", "").substr(0, 80)}</Text>
                </TouchableOpacity>
              </View>
          </View>
          <View style={styles.rightFoot}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Image source={require("image!Public_ic_love")} />
              <Text style={styles.commentStyle}> {rowData.like_count}</Text>
            </View>
            <View style={{flexDirection: "row", marginLeft: 22, alignItems: "center"}}>
              <Image source={require("image!Public_ic_comment")} />
              <Text style={styles.commentStyle}> {rowData.discussion_count}</Text>
            </View>
            <View style={{flex: 1,flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
              <Text style={{marginRight: 14, fontSize: 10, color: "#bab9a8"}}>{rowData.pub_time}</Text>
            </View>
          </View>
        </View>
      );
    }
  },
  render: function(){
    return(
      <View style={{"flex" :1, backgroundColor: "#fcfcf5", top: -20}}>
        <ListView
          initialListSize={1}
          pageSize={2}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow} />
        <View style={[styles.search, {position: "absolute",top: 46,left: 10,}]}>
          <TouchableOpacity onPress={this._goSearchPage}>
            <View style={[styles.searchMiniWidth]}>
              <Text style={{textAlign: "center"}}>搜索：食物</Text>
            </View>
          </TouchableOpacity>
        </View>
        {
          this.state.isLogin === "true"
          ?
          <FloatButton onPress={this._goPostPage} />
          :
          null
        }
      </View>
    )
  },
});

var styles = StyleSheet.create({
  text1:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  image: {
    flex: 1,
  },
  search: {
    height: 30,
    width: Dimensions.get('window').width - 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#aaa",
    opacity: 0.5
  },
  searchMiniWidth: {
    width: Dimensions.get('window').width - 50
  },
  rightFoot:{
    marginTop: 15,

    flexDirection: "row",
    marginLeft: 14
  },
  thumbnail: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: 14,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  abstract: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
    flexDirection: "row"
  },
  coverImage: {
    width: 120,
    height: 65,
  },
  abstractTextWrapper: {
    flex: 1
  },
  abstractText: {
    color: "#7e8e97",
    fontSize: 12,
    lineHeight: 20,
    paddingRight : 10,
    paddingLeft : 10,
    height: 65
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  commentStyle: {
    fontSize: 13,
    color: "#7e8e97",
    textAlign:"justify"
  }
});

module.exports = HomePage;
