function formatTag(t) {
  return renderTag(t.id, {count: t.count});
}
var self = null;
export default Ember.TextField.extend({
  classNameBindings: [':discussbook-search-book'],
  attributeBindings: ['tabIndex'],
  debounceWait: 500,
  fireAtStart: false,

  _valueChanged: function() {
    self = this;
    Ember.run.debounce(this, this._searchbook, this.debounceWait, this.fireAtStart);
  }.observes('value'),

  _searchbook : function(){
    const bookname = this.get('value');
    
    searchbook(bookname);
  },
  _destroyTags: function() {
    this.$().select2('destroy');
  }.on('willDestroyElement')

});



function searchbook(bookname){
    $(".db-search-composer").addClass("db-in-progress");
    if(bookname && bookname.length>0){
          getResponse(bookname,populateBooks,errorHandler);
    }
}

function populateBooks(bookDetails){
    var bookDetails = bookDetails.items;
    $(".db-search-composer").removeClass("db-in-progress");
    $(".db-search-composer").addClass("db-show-result");
    $(".db-result").empty();

    if(typeof bookDetails != 'undefined'){
      for(var i = 0;i<bookDetails.length;i++){
          var imgSrc = "/plugins/googlebooks/images/no_thumb.gif";
          if(bookDetails[i].volumeInfo.imageLinks){
            imgSrc = bookDetails[i].volumeInfo.imageLinks.thumbnail;
          }
          var authors = "";
          if(bookDetails[i].volumeInfo.authors && bookDetails[i].volumeInfo.authors[0]){
              authors = " by "+ bookDetails[i].volumeInfo.authors[0];
          }
          var title = bookDetails[i].volumeInfo.title + authors ;
          var id = bookDetails[i].id;
          var elem = $("<div class='db-result-item'><img src='"+imgSrc+"'><span class='db-result-title'>"+title+"</span><span class='db-result-id'>"+id+"</span></div>");
          elem.on("click",function(){
            var bookid = $(this).find(".db-result-id").text();
            var title =  $(this).find(".db-result-title").text();
            self.parentView.set('model.bookid', bookid);
            selectBook(bookid,title);
          })
          $(".db-result").append(elem);
      }
    }
}

function selectBook(bookid,title){
  $(".db-search-composer").removeClass("db-show-result");
  $(".db-book-selection .db-book-selection-title").html(title);
  $(".db-book-selection .db-book-selection-id").html(bookid);
}
function errorHandler(error){
    console.log(error);
}

function getResponse(bookname, successCallBack, errorCallBack) {
    var BASE_URL = window.location.origin;
    var url = BASE_URL + "/gb/sb.json?q="+bookname;
    var data = "keyword=" + bookname;
    callServer(url, "GET", null, null, successCallBack, errorCallBack);
}

function  callServer(url, type, data, headers, successCallBack, errorCallBack,loop=true,looping=false,copyErrorCallBack=null) {
if(loop){
    if(!looping){
        var copyErrorCallBack = errorCallBack;
    }
    errorCallBack = function(err){
        //retry only if server error, not for bad requests or unauthorized
        if(err.status >= 500){
            setTimeout(function(){
                callServer(url, type, data, headers, successCallBack, errorCallBack,loop,true,copyErrorCallBack);
            },500)
        }else{
            copyErrorCallBack(err);
        }
    }
}
    if (type != "GET") {
        return $.ajax({
            "url": url,
            "type": type,
            "data": data,
            "headers": headers,
            "success": successCallBack,
            "error": errorCallBack
        })
    }
    return $.ajax({
        "url": url,
        "type": "GET",
        "headers": headers,
        "success": successCallBack,
        "error": errorCallBack
    })

}