import Composer from 'discourse/models/composer';
import ComposerController from 'discourse/controllers/composer';
import Category from 'discourse/models/category';
import { ajax } from 'discourse/lib/ajax';
import composerEditor  from 'discourse/components/composer-editor';

export default {
    name: "googlebooks",
    initialize(){
        var toggleGoogleBooks = false;
        Composer.serializeOnCreate('bookid');
        Composer.serializeToTopic('bookid', 'topic.bookid');
        ComposerController.reopen({
          
            categoryChanged: Ember.observer('model.categoryId', function() {
                
                if(!this.categoriesEnabled){
                    var self = this;
                    ajax('/gb/ce.json',{type:'GET'}).then(function(categories){
                        self.categoriesEnabled = categories.googlebooks;
                        self.showHideGoogleBooks(); 
                    }).catch(function(error){
                        console.log(error);
                    })
                }else{
                    this.showHideGoogleBooks();
                }
            }),
            
            showHideGoogleBooks:function(){
                if(!this.get('model')){
                    return;
                }
                var categoryId = this.get('model.categoryId');
                var categoryName = this.get('model.category.name');
                var isGoogleBooksEnabled = false;
                for(var i=0;i<this.categoriesEnabled.length;i++){
                    if(this.categoriesEnabled[i].categoryId == categoryId && this.categoriesEnabled[i].google_books_enabled){
                        isGoogleBooksEnabled = this.categoriesEnabled[i].google_books_enabled;
                        if(typeof isGoogleBooksEnabled == "string"){
                            isGoogleBooksEnabled = (isGoogleBooksEnabled === "true");
                        }
                    }
                }
                
                if(isGoogleBooksEnabled){
                    $(".d-editor-button-bar .books").removeClass("hidden");
                    this.set('model.showGoogleBooks',true);
                }else{
                    $(".d-editor-button-bar .books").addClass("hidden");
                    this.set('model.showGoogleBooks',false);
                }
            }
        })
         composerEditor.reopen({
            
            actions : {
                toggleGoogleBooks(toolbarEvent){
                    this.composer.toggleProperty('showGoogleBooks');

                },
                extraButtons(toolbar) {
                    toolbar.addButton({
                        id: 'quote',
                        group: 'fontStyles',
                        icon: 'comment-o',
                        sendAction: 'importQuote',
                        title: 'composer.quote_post_title',
                        unshift: true
                    });

                    toolbar.addButton({
                        id: 'upload',
                        group: 'insertions',
                        icon: 'upload',
                        title: 'upload',
                        sendAction: 'showUploadModal'
                    });

                    if (this.get("showPopupMenu")) {
                        toolbar.addButton({
                        id: 'options',
                        group: 'extras',
                        icon: 'gear',
                        title: 'composer.options',
                        sendAction: 'toggleOptions'
                        });
                    }

                    toolbar.addButton({
                        id: 'books',
                        group: 'insertions',
                        icon: 'book',
                        title: 'Add book',
                        sendAction: 'toggleGoogleBooks'
                    });
                    // toolbar.addButton({
                    //     id: 'books',
                    //     group: 'extras',
                    //     icon: 'book',
                    //     label: getButtonLabel('composer.heading_label', 'H'),
                    //     shortcut: 'Alt+1',
                    //     perform: e => e.applyList('## ', 'heading_text')
                    // });

                    if (this.site.mobileView) {
                        toolbar.addButton({
                        id: 'preview',
                        group: 'mobileExtras',
                        icon: 'television',
                        title: 'composer.show_preview',
                        sendAction: 'togglePreview'
                        });
                    }
                }
            }             
        })
    }
};
