import { acceptance } from "helpers/qunit-helpers";
import DiscourseURL from 'discourse/lib/url';
acceptance("Googlebooks", { loggedIn: true });

test("it should show category setting", assert => {
  visit("/c/bug");

  click('.edit-category');

  andThen(() => {
    assert.ok(visible('#discourse-modal'), 'it pops up a modal');
  });

  andThen(() => {
    ok(exists('.setting_googlebooks'), "it shows the setting for google books");
  })

});

test("it should save category setting - on", assert => {
  visit("/c/bug");

  click('.edit-category');
  click('.checkbox-label.setting_googlebooks input');
  click('#save-category');
  andThen(() => {
    assert.ok(!visible('#discourse-modal'), 'it closes the modal');
    assert.equal(DiscourseURL.redirectedTo, '/c/bug', 'it does one of the rare full page redirects');
  })

 visit("/c/bug");
    click('.edit-category');
    
    andThen(() => {
        var value = $(".checkbox-label.setting_googlebooks input").is(":checked");
        assert.equal(value,true,"it enables the google books for category");
    })
});
