'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var settings = require("../utils/settings");
var UtilsFunctions = require('../utils/functions');

var {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  DatePickerIOS,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicatorIOS,
  AsyncStorage
} = React;


var RegisterPage02 = React.createClass({
  getDefaultProps: function(){
    return {
      date: new Date(),
      timeZoneOffsetInHours: (-1)*(new Date()).getTimezoneOffset()/60,
    };
  },
  getInitialState: function(){
    return {
      fromSetting: this.props.fromSetting,
      date: this.props.date,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      sex: 1,
      period: 0,
      isloading: false
    };
  },
  _back: function(){
    this.props.navigator.pop();
  },
  _onDateChange: function(date){
    console.log(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())
    this.setState({date: date});
  },
  _setPeriod: function(period){
    if(this.state.period === period){
      this.setState({period: 0});
    }else{
      this.setState({period: period});
    }
  },
  _submit: function(){
    var subdate = this.state.date;
    this.setState({isloading: true});
    fetch(settings.serverAddress + "/api/core/info/baby/", {method: "PUT",headers:{'Content-Type': 'application/x-www-form-urlencoded'}, body:
      UtilsFunctions.object2form({
        haschild: this.state.period,
        gender: this.state.sex,
        birthday: subdate.getFullYear()+"-"+(subdate.getMonth()+1)+"-"+subdate.getDate()
      })
    })
    .then((res) => {
      console.log(res);
      if (res.status < 300 && res.status >= 200){
        console.log("gggg");
        AsyncStorage.setItem("isLogin", "true").done();
        if(this.state.fromSetting === undefined){
          this.props.navigator.immediatelyResetRouteStack([{id:"home", selected: "mypage"}]);
        }else{
          this.props.navigator._popN(2);
        }
      }else{
        this.setState({isloading: false});
      }
      return res.json();
    })
    .then((resJson) => {
      console.log(resJson);
    })
    .catch(e => {
      console.log(e);
    })
    .done();
  },
	render: function(){
		return (
			<Image style={styles.container} source={require('image!Login2_bg')}>
        {
          this.state.fromSetting !== undefined?
          <View style={{position: "absolute", top: 20, left: 5}}>
            <TouchableOpacity onPress={this._back}>
              <Image style={styles.back} source={require("image!Profile2_but_Back_white")} />
            </TouchableOpacity>
          </View>:
          null
        }
				<View>
					<Text style={[styles.txtLight, styles.completeTitle]}>完善宝宝信息</Text>
				</View>
				<Image style={styles.babyAvatar} source={this.state.sex === 1 ?require('image!Login3_ic_Boy-head'):require("image!Login3_ic_Girl-head")} />
        <View style={styles.gender}>
          <TouchableWithoutFeedback onPress={() => this.setState({sex: 1})}>
            <Image style={styles.genderImg} source={this.state.sex === 1 ? require('image!Login3_but_Boy_pressed') : require('image!Login3_but_Boy_default')} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.setState({sex: 2})}>
            <Image style={styles.genderImg} source={this.state.sex === 1 ? require('image!Login3_but_Girl_default'): require('image!Login3_but_Girl_pressed')} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={[styles.txtLight, styles.birthday]}>宝宝出生日期</Text>
        </View>
        <DatePickerIOS
          date={this.state.date}
          mode="date"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours*60}
          onDateChange={this._onDateChange} />

        <View>
          <Text style={[styles.txtLight, styles.otherOptTitle]}>还没有宝宝请选</Text>
        </View>
        <View style={styles.otherOptContainer}>
          <TouchableWithoutFeedback onPress={() => this._setPeriod(2)}>
            <View style={[styles.otherOptBtn, this.state.period === 2 ? styles.otherOptBtnOn : styles.otherOptBtnOff]}>
              <Text style={[styles.txtLight, styles.otherOptTxt]}>备孕期</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this._setPeriod(1)}>
            <View style={[styles.otherOptBtn, this.state.period === 1 ? styles.otherOptBtnOn : styles.otherOptBtnOff]}>
              <Text style={[styles.txtLight, styles.otherOptTxt]}>孕期中</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity onPress={this._submit}>
          <View style={styles.completeBtn}>
            {
              this.state.isloading?
              <ActivityIndicatorIOS/>:
              <Text style={styles.completeBtnTxt}>完成</Text>
            }
          </View>
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
    color: '#fff'
  },
  completeTitle: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 16
  },
  babyAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10
  },
  gender: {
    flexDirection: 'row',
    marginBottom: 10,
    width: 180,
    justifyContent: 'space-between'
  },
  birthday: {
    fontSize: 13
  },
  completeBtn: {
    width: 180,
    height: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    marginTop: 30,
    marginBottom: 25
  },
  completeBtnTxt: {
    color: '#48b8a7',
    fontSize: 15,
    fontWeight: 'bold'
  },
  otherOptTitle: {
    fontSize: 13,
    marginBottom: 13
  },
  otherOptContainer: {
    flexDirection: 'row',
    width: 270,
    justifyContent: 'space-between'
  },
  otherOptBtn: {
    width: 126,
    height: 32,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherOptBtnOn: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)'
  },
  otherOptBtnOff: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  otherOptTxt: {
    fontSize: 14
  },
  goPrev: {
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
  goPrevTxt: {
    fontSize: 13,
    color: '#fff'
  }
});

module.exports = RegisterPage02;

// <TouchableOpacity style={styles.goPrev} onPress={this._goPrev}>
//   <Text style={[styles.txtLight, styles.goPrevTxt]}>返回上一步</Text>
// </TouchableOpacity>


  // getDefaultProps: function () {
  //   return {
  //     date: new Date(),
  //     timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
  //   };
  // },
  // getInitialState: function() {
  //   return {
  //     date: this.props.date,
  //     timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
  //   };
  // },
  // onDateChange: function(date) {
  //   this.setState({date: date});
  // },
  // onTimezoneChange: function(event) {
  //   var offset = parseInt(event.nativeEvent.text, 10);
  //   if (isNaN(offset)) {
  //     return;
  //   }
  //   this.setState({timeZoneOffsetInHours: offset});
  // },
  // render: function() {
  //   return (
  //     <ScrollView>
  //       <View label="Value:">
  //         <Text>{
  //           this.state.date.toLocaleDateString() +
  //           ' ' +
  //           this.state.date.toLocaleTimeString()
  //         }</Text>
  //       </View>
  //       <DatePickerIOS
  //         date={this.state.date}
  //         mode="date"
  //         timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
  //         onDateChange={this.onDateChange} />
  //     </ScrollView>
  //   );
  // },
