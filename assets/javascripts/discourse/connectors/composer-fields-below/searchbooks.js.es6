export default {
  shouldRender(args, component) {
    if(!Discourse.SiteSettings.google_books_enabled){
      return false;
    }
    if(args.model && ( args.model.action == "createTopic" || (args.model.action == "edit" && args.model.post && args.model.post.post_number == 1))){
        return true;
    }else{
        return false;
    }
  }
}
