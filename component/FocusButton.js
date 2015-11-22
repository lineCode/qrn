'use strict';

var React = require('react-native');
var UtilsFunctions = require('../utils/functions');
var settings = require("../utils/settings");

var {
   Text,
   Image,
   View,
   StyleSheet,
   TouchableOpacity,
   ActivityIndicatorIOS,
 } = React;

var ImageType = {
  "1": {
    0: "image!User_infolist_fans_but_NoAttention",
    2: "image!User_infolist_fans_but_Attention",
    3: "image!User_infolist_fans_but_NoAttention",
    4: "image!User_infolist_fans_but_Each-other",
  },

  "2": {
    0: "image!Topics_but_no_attention",
    2: "image!Topics_but_attention",
    3: "image!Topics_but_no_attention",
    4: "image!Topics_but_attention_to_each_other",
  }
}

var FocusButton = React.createClass({
  getInitialState:function(){
    return {
      relation : this.props.relation,
      isloading: false
    };
  },
  _focus: function(userid){
    fetch(settings.serverAddress + "/api/core/follow/" + userid + "/", {method: "PUT"})
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((resJson) => {
      this.setState({
        relation: resJson.relation,
        isloading: false
      });
    })
    .catch(e => {console.log(e);})
    .done();
  },
  _unFollow: function(userid){
    console.log(settings.serverAddress + "/api/core/follow/" + userid + "/");
    fetch(settings.serverAddress + "/api/core/follow/" + userid + "/", {method: "DELETE"})
    .then((res) => {
      console.log(res);
      if (res.status === 204){
        this.setState({
          relation: 0,
          isloading: false
        });
      }
    })
    .catch(e => {console.log(e);})
    .done();
  },
  render: function(){
    if ([0,2,3,4].indexOf(this.state.relation) !== -1){
      require("image!Topics_but_no_attention");   //不知道为何的一个bug，如果没有这行代码会topic页面报错
      require("image!Topics_but_attention");
      require("image!Topics_but_attention_to_each_other");
      var imgUrl = ImageType[this.props.type][this.state.relation];
      var relationship = (<Image source={require(imgUrl)} />);
    }else{
      var relationship = null;
    }

    return (
      <View style={this.props.style}>
        {
          this.state.isloading?
          <View style={{width: 56, height: 44, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
            <ActivityIndicatorIOS />
          </View>
          :
          <TouchableOpacity onPress={() => {
            this.setState({isloading: true})
            if([0,3].indexOf(this.state.relation) != -1){
              this._focus(this.props.userid);
            }else if([2,4].indexOf(this.state.relation)!= -1){
              this._unFollow(this.props.userid);
            }
          }}>
            {relationship}
          </TouchableOpacity>
        }
      </View>
    );
  }
});


module.exports = FocusButton;
