function batchDeleteEmails() {
  var batchSize = 100;
  var categories = ['Promotions', 'Social', 'Updates', 'Forums'];
  var minimumEmailCount = 100; // Set your minimum email count threshold here (e.g., 100 emails)
  var currentCategory = PropertiesService.getScriptProperties().getProperty('currentCategory');
  var foundCategoryAboveThreshold = false; // Flag to check if any category meets the threshold

  // Iterate through the categories
  for (var i = 0; i < categories.length; i++) {
    // Update the current category in script properties
    currentCategory = categories[i];
    // Set the ScriptProperties currentCateogry and rotate through them
    PropertiesService.getScriptProperties().setProperty('currentCategory', currentCategory);

    var category = 'category:' + currentCategory;
    var threads = GmailApp.search(category);

    if (threads.length >= minimumEmailCount) {
      console.log(currentCategory + ' batch size is: ' + threads.length);

      for (var j = 0; j < threads.length; j += batchSize) {
        console.log('Removing ' + currentCategory + ' emails batch: ' + j);
        GmailApp.moveThreadsToTrash(threads.slice(j, j + batchSize));
      }
      
      foundCategoryAboveThreshold = true; // Set the flag to true if a category meets the threshold
      break; // Exit the loop if a category meets the threshold
    } else {
      console.log(currentCategory + ' has fewer than ' + minimumEmailCount + ' emails.');
    }
  }

  if (!foundCategoryAboveThreshold) {
    console.log('All categories have fewer than ' + minimumEmailCount + ' emails. Stopping the loop.');
    return; // Exit the function if no category meets the threshold
  }
}
