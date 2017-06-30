export default {
  shouldRender(args, component) {
    console.log("Action is "+args.model.action);
    if(args.model && ( args.model.action == "createTopic" || (args.model.action == "edit" && args.model.post && args.model.post.post_number == 1))){
        return true;
    }else{
        return false;
    }
  }
}
