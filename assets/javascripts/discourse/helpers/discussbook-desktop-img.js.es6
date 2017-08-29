import { registerUnbound } from 'discourse-common/lib/helpers';

registerUnbound('discussbook-desktop-img', function(topic) {
    // topic.book.volumeInfo.imageLinks.smallThumbnail
    
    if(topic && topic.book && topic.book.volumeInfo && topic.book.volumeInfo.imageLinks){
        var imageLinks = topic.book.volumeInfo.imageLinks;
        if(imageLinks && imageLinks.smallThumbnail){
            var thumbnailUrl = imageLinks.smallThumbnail;
            var arr = thumbnailUrl.match(/(http|https)(.*)+/);
            if(arr.length == 3){
                return new Handlebars.SafeString("<img src='https"+arr[2]+"' width=\"60\">");          
            }
            return new Handlebars.SafeString("<img src='"+thumbnailUrl+"' width=\"60\">");
        }

        return "/plugins/googlebooks/images/no_thumb.gif";
    }else{

        var url = window.location.origin+"/t/"+topic.get('id')+".json";
        var request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
        var topic = JSON.parse(request.responseText);
        var cooked = topic.post_stream.posts[0].cooked;
            var href = cooked.match(/src=\"(.*?)\"/);
           
            if(href && href.length > 0){
                if(new RegExp(/(https|http)/g).test(window.location.href)){
                    href = href[1];
                }else{
                    href = window.location.origin+href[1];
                }
                
                return new Handlebars.SafeString("<img src='"+href+"' width=\"60\" height=\"90\">");  

            }else{
                href =  "/plugins/googlebooks/images/no_thumb.gif";
                return new Handlebars.SafeString("<img src='"+href+"' width=\"60\" height=\"90\">");  
            }
        }else{
            var href =  "/plugins/googlebooks/images/no_thumb.gif";
            return new Handlebars.SafeString("<img src='"+href+"' width=\"60\" height=\"90\">");  
        }
    }
    
  
});
