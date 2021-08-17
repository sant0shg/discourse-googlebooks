import discourseComputed from "discourse-common/utils/decorators";
import Category from 'discourse/models/category';

export default {
  name: 'extend-category-for-googlebooks',
  before: 'inject-discourse-objects',
  initialize() {

    Category.reopen({

      @discourseComputed('custom_fields.google_books_enabled')
      google_books_enabled: {
        get(enableField) {
          return enableField === "true";
        },
        set(value) {
          value = value ? "true" : "false";
          this.set("custom_fields.google_books_enabled", value);
          return value;
        }
      }

    });
    
  }
};
