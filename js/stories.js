"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

function favStoryChecked(user, story) {
  if (user) {
    if (user.isFavorite(story)) {
      return `<input class="fav" type="checkbox" checked="checked">`;
    }
    return `<input class="fav" type="checkbox"/>`;
  }
  return "";
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup");

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${favStoryChecked(currentUser, story)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// get the user inputs and submit a story 
async function submitStory(e) {
  console.debug("submitStory");

  $("#submit-form").slideUp("slow", function () {
    $("#submit-form").css("display", "").hide();
  });

  await storyList.addStory(currentUser, {
    author: $("#author").val(),
    title: $("#title").val(),
    url: $("#url").val()
  });

  $("#author").val("");
  $("#title").val("");
  $("#url").val("");

  getAndShowStoriesOnStart();

}

$("#submit-btn").on("click", submitStory);

// add or remove a story from the favorites[]
async function addOrRemoveFav(e) {
  const storyId = e.target.parentElement.id;
  const storyChecked = e.target.checked;

  if (storyChecked) {
    await User.addFav(currentUser, storyId);
  } else {
    await User.removeFav(currentUser, storyId);
  }
}

$("ol").on("click", ".fav", addOrRemoveFav);

// delete a story from the page and the API
async function removeStory(e) {
  const storyId = e.target.parentElement.id;
  e.target.parentElement.remove();

  await storyList.deleteStory(currentUser, storyId);
}

$("ol").on("click", ".delete", removeStory);

