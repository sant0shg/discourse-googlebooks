export default Ember.Component.extend({
  tagName: 'img',
  attributeBindings : ['customSrc:src','setWidth:width'],
  setWidth : function(){
    var width = this.get('width');
    if(width){
      return width;
    }
  }.property('width'),
  customSrc:function(){
    var src = this.get('src') || "/plugins/googlebooks/images/no_thumb.gif";
    var srcReg = src.match(/(https|http)(.*)+/);
    if(srcReg && srcReg.length == 3){
        return "https"+srcReg[2];
    }
    return this.get('src') || "/plugins/googlebooks/images/no_thumb.gif";
  }.property('src')
});