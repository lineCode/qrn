'use strict';

var utilsMixin = {
  _back: function(){
    this.props.navigator.pop();
  },
  _goTopic: function(pageId){
    this.props.navigator.push({id: "topicPage", passProps: {pageId: pageId}});
  },
  _goPostPage: function(){
    this.props.navigator.push({id: "post"});
  },
  _goOtherPage: function(userid){
    this.props.navigator.push({id: "otherPage", passProps: {userid: userid}});
  },
  _goSearchPage: function(){
    this.props.navigator.push({id: "searchPage"});
  },
  _goDiscussion: function(pk, title){
    this.props.navigator.push({id: "discussion", pk: pk, title: title});
  },
};

module.exports = utilsMixin;
