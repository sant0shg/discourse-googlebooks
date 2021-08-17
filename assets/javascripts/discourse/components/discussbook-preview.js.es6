import discourseComputed from "discourse-common/utils/decorators";

export default Ember.Component.extend({
  // subclasses need this
  layoutName: 'components/d-button',
  tagName: 'button',
  classNameBindings: [':btn', 'noText'],
  attributeBindings: ['disabled', 'translatedTitle:title'],

  noText: Ember.computed.empty('translatedLabel'),

  @discourseComputed("title")
  translatedTitle(title) {
    if (title) return I18n.t(title);
  },

  @discourseComputed("label")
  translatedLabel(label) {

    // if (label) return I18n.t(label);
    return label;
  },

  click() {
      
    if(!$(".preview-elem").length){
        var layout = 
        "<iframe id=\"previewiframe\" class=\"previewmodal preview-elem displaynone\">"+

        "</iframe>"+
        "<div class=\"preview-elem preview-close displaynone\">X</div>";
        $("body").append(layout);
    }
    var bookid = this.get("actionParam");

    if($(".preview-elem").hasClass("displaynone")){
        $("body").append("<div class=\"modal-backdrop in\"><div style=\"text-align:center;width: 300px;position: absolute;top: 50%;left: 50%;transform: translate(-50%);\" id=\"preview-loading-gif\"><img src=\"/plugins/googlebooks/images/rolling.gif\" style=\"width:60px;\" alt=\"loading\"/></div></div>");
        
        if(bookid){
            var self = this;
            var bookid = self.get("actionParam");
            $(".preview-elem").removeClass("displaynone");
            
            var iframeElement = document.getElementById("previewiframe");
            iframeElement.setAttribute("src","/plugins/discourse-googlebooks/preview.html?id="+bookid+"&h="+(window.outerHeight - 16));
            
        }
    }else{
        $(".modal-backdrop").remove();
        $(".preview-elem").addClass("displaynone");
    }
    $(".preview-close").click(function(){
           removePreview();
    })
  
    return false;
  }
});


function errorloadingbook(context){
    removePreview();
}

function removePreview(){
    $(".preview-elem").addClass("displaynone");
    $(".modal-backdrop").remove();
    $(".preview-elem").remove();
}
