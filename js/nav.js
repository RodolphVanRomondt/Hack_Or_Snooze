"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(e) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(e) {
  console.debug("navLoginClick");
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $("#nav-submit").show();
  $("#nav-favorites").show();
  $("#nav-stories").show();
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(e) {
  console.debug("navSubmitClick");
  $("#submit-form").css("display", "").removeClass("hidden");
}

$("#nav-submit").on("click", navSubmitClick);

$("#nav-all").on("click", function () {
  $("#submit-form").hide();
  getAndShowStoriesOnStart();
});

$("#nav-stories").on("click", function(){
  $("#all-stories-list").hide();
  $("#submit-form").hide();

  if (!currentUser.ownStories) { return; }

  storyList.stories = currentUser.ownStories;

  putStoriesOnPage();
  $("li").prepend(`<input class="delete" type="button" value="X">`);
});

$("#nav-favorites").on("click", function () {
  $("#all-stories-list").hide();
  $("#submit-form").hide();

  storyList.stories = currentUser.favorites;
  putStoriesOnPage();
});