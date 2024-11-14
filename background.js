chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message in background:', message); // Log the received message

  if (message.type === 'checkLibraryAvailability') {
    const { author, title } = message;
    // Remove quotes from author, keep them for title
    const queryUrl = `https://prism.librarymanagementcloud.co.uk/liverpool/items?query=+author%3A%28${encodeURIComponent(author)}%29+AND+title%3A%28%22${encodeURIComponent(title)}%22%29+AND+format%3A%28book%29`;

    console.log('Querying URL:', queryUrl); // Log the URL being queried

    fetch(queryUrl)
        .then(response => response.text())
        .then(text => {
          // Check for both indicators of unavailability
          const noResultsIndicator = text.includes('id="dymnoresults"') && text.includes("Sorry, didn't find anything for");
          const foundNothingIndicator = text.includes('found nothing');

          // Set availability to false if either indicator is present
          const isAvailable = !(noResultsIndicator || foundNothingIndicator);
          sendResponse({ isAvailable });
        })
        .catch(error => {
          console.error('Error fetching data from library API:', error);
          sendResponse({ isAvailable: false }); // Assume not available if there's an error
        });

    return true; // Keep this return to indicate async response
  }
});
