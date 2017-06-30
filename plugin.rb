# name: discourse-googlebooks
# about: Googlebooks integration with discourse forum
# version: 1.0.0
# authors: Netdeamon

enabled_site_setting :google_books_enabled
register_asset "stylesheets/book-preview.scss"
register_asset "stylesheets/searchbook.scss"


after_initialize do

  require_dependency 'topic_view_serializer'
  require_dependency 'topic_list_item_serializer'
  require_dependency 'guardian'
  require_dependency 'search'
  require_dependency 'topic';

  Topic.register_custom_field_type('book', :json)
  PostRevisor.track_topic_field(:bookid) do |tc,bookid|
    
    topicbookid = "";
     if(tc.topic.custom_fields &&  tc.topic.custom_fields["book"]!= nil) then
           topicbookid = tc.topic.custom_fields['book']['id'];
     end

     if(topicbookid != bookid && bookid.length > 0) then

      require 'net/http'
       topic = tc.topic;
       user = tc.user;
      uri = URI.parse("https://www.googleapis.com/books/v1/volumes/"+ bookid +"?key="+SiteSetting.google_books_api_key) 
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true      
      request = Net::HTTP::Get.new(uri, {'Content-Type' => 'application/json','referer'=>SiteSetting.google_books_referer})      
      response = http.request(request)
      response_body = JSON.parse(response.body);
      topic.custom_fields['book'] = response_body;      
      topic.save
     end
  end

  DiscourseEvent.on(:before_create_topic) do | topic, topic_creator |
   
     user = topic_creator.user
    params = topic_creator.opts 
    
    if params[:archetype] == "regular" then #check if enabled for this category
      if params[:bookid] != nil && params[:bookid].length > 0 && topic.category.custom_fields['google_books_enabled'] === "true" then
        
        require 'net/http'
        
        bookid = params[:bookid].to_s
        uri = URI.parse("https://www.googleapis.com/books/v1/volumes/"+ bookid +"?key="+SiteSetting.google_books_api_key) 
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        
        request = Net::HTTP::Get.new(uri, {'Content-Type' => 'application/json','referer'=>SiteSetting.google_books_referer})
        
        response = http.request(request)
        response_body = JSON.parse(response.body);
        topic.custom_fields['book'] = JSON.parse response.body;
      # second inner
      end
    # first main if  
    end

  end  


  

  add_to_serializer :topic_view_ , :book do
    object.topic.custom_fields['book']  
  end

  add_to_serializer :topic_list_item_ , :book do
    object.custom_fields['book']  
  end

  module ::GoogleBooks

    class Engine < ::Rails::Engine
      engine_name "googlebooks"
      isolate_namespace GoogleBooks
    end
  end

  class GoogleBooks::GooglebooksController < ::ApplicationController
    @google_url = "https://www.googleapis.com/books/v1/volumes?fields=items(id,volumeInfo(title,authors,imageLinks))&q="
  
    def test
      render json: { name: "donut", description: "delicious!" }
    end
    
    def apikey
        SiteSetting.google_books_api_key
    end

    def apiReferer
      SiteSetting.google_books_referer
    end
        
    def gBaseUrl
        "https://www.googleapis.com/books/v1/volumes"
    end
        
    def getBookById 
          require 'net/http'
          bookid = params[:q]
          uri = URI.parse(gBaseUrl+ bookid +"?key="+apikey) 
          http = Net::HTTP.new(uri.host, uri.port)
          http.use_ssl = true
          request = Net::HTTP::Get.new(uri, {'Content-Type' => 'application/json','referer'=>apiReferer})
          response = http.request(request)
          render json: response.body
    end

    def search
      require 'net/http'
      bookname = params[:q]
      uri = URI.parse(gBaseUrl+"?fields=items(id,volumeInfo(title,authors,imageLinks))&key="+apikey+"&q="+bookname)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      request = Net::HTTP::Get.new(uri, {'Content-Type' => 'application/json','referer'=>apiReferer})
      response = http.request(request)
      render json: response.body
    end  

    def getEnabledForCategory
      category_id = params[:q]
      
      categories ||= []
      Category.find_each do |category|
        temp = category.custom_fields;
        temp["categoryId"] = category.id;
        temp["categoryName"] = category.name;
        categories.push(temp);
      end
      render json:categories;
    end
   
  end

  GoogleBooks::Engine.routes.draw do
    get '/sb' => 'googlebooks#search'
    get '/gbid' => 'googlebooks#getBookById'
    get '/ce' => 'googlebooks#getEnabledForCategory'
  end

  Discourse::Application.routes.append do
    mount ::GoogleBooks::Engine, at: "/gb"
  end

end


