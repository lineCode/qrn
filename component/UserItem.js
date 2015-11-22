'use strict';
// 属性 头像半径radius
//      头像地址avatar
//      名字样式nameStyle
//      名字name
//      跳转onPress
var React = require('react-native');

var {
   Text,
   Image,
   View,
   StyleSheet,
   TouchableWithoutFeedback
 } = React;

var UserItem = React.createClass({
   render: function(){
     return (
       <TouchableWithoutFeedback onPress={this.props.onPress}>
         <View style={{flexDirection: "row"}}>
          <Image source={{uri: this.props.avatar}} style={{width: this.props.radius * 2, height: this.props.radius * 2, borderRadius: this.props.radius}}/>
          <View>
            <Text style={[styles.nameStyle, this.props.nameStyle]}>{this.props.name}</Text>
            {this.props.children}
          </View>
         </View>
       </TouchableWithoutFeedback>
     );
   },
 });

var styles = StyleSheet.create({
  nameStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#48b8a7"
  }
});

module.exports = UserItem;
