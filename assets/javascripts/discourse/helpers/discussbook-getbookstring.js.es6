import { registerUnbound } from 'discourse-common/lib/helpers';

registerUnbound('discussbook-getbookstring', function(result) {
    
  var book = result.topic.book;
   var   bookString = book.volumeInfo.title + " - " +book.volumeInfo.authors.toString()
    return bookString;
});
