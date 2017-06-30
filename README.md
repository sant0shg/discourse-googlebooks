# discourse-googlebooks
## Googlebooks integration with discourse forum

[discourse](http://www.discourse.org) is a civilized discussion forum which can be used for forums, discussion, QA (Question and Answer) or mailing lists.

This plugin extends the discourse forum by adding integration with Google Books api. 

## Features

- Search field in editor to search for books<sup>1</sup>

- Plugin can be enabled selectively for specific categories<sup>2</sup>

- Book preview<sup>3</sup> 

## Getting Started

Installing this plugin with discourse is simple. Just add the following line in your `app.yml` file in `/path/to/discourse/containers/app.yml`


    ## Plugins go here
    ## see https://meta.discourse.org/t/19157 for details
    hooks:
      after_code:
        - exec:
            cd: $home/plugins
            cmd:
              - git clone https://github.com/netdeamon/discourse-googlebooks.git
          

## Settings

In order to make this plugin work, you need to add your api key and referrer for googlebooks api<sup>4</sup>. You can get these credentials from
[Google developers console](https://console.developers.google.com). You need to enable the GoogleBooks api to get the api key.

## Screenshots from the plugin

1. Editor integration
<img src="https://user-images.githubusercontent.com/2167846/27745023-76127fe0-5ddf-11e7-9932-82198c624cd4.png" width="400" alt="editor">

<img src="https://user-images.githubusercontent.com/2167846/27745446-facbefea-5de0-11e7-9466-1afeb637d7b7.png" width="400" alt="editor"> 

2. Category Settings
<img src="https://user-images.githubusercontent.com/2167846/27745022-760fe3d4-5ddf-11e7-8163-0d6a14eb21b0.png" width="400" alt="category settings">

3. Link to this [post](https://discussbook.com/t/why-are-there-so-many-links-in-the-book/243) :-) 
<img src="https://user-images.githubusercontent.com/2167846/27745021-760d75b8-5ddf-11e7-96f3-6e66a2600484.png" width="400" alt="category settings">

4. Settings page
<img src="https://user-images.githubusercontent.com/2167846/27745025-761a2358-5ddf-11e7-9ca2-e97c87825484.png" width="400" alt="settings page">
