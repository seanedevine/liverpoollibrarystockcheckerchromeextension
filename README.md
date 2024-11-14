# Goodreads Library Checker

**Goodreads Library Checker** is a Chrome extension that checks the availability of books listed on Goodreads in the Liverpool Library Catalogue. This extension enhances your browsing experience on Goodreads by indicating whether a book is available in the Liverpool Library system directly on the Goodreads site.

## Features

- Automatically checks the Liverpool Library Catalogue for book availability while browsing Goodreads.
- Adds an "Exists" column in Goodreads book lists, displaying availability status with ✅ for available and ❌ for unavailable.
- Provides direct links to the library catalogue for easy access.

## Installation

1. **Clone or Download the Repository:**
   - Clone this repository to your local machine or download it as a ZIP and extract it.

2. **Load the Extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`.
   - Enable **Developer Mode** in the top right corner.
   - Click **Load unpacked** and select the folder containing the cloned or downloaded files.

3. **Adding Icons (Optional):**
   - Ensure you have `icon16.png`, `icon48.png`, and `icon128.png` in an `icons` folder within your extension directory for Chrome to display your extension icon properly.

## Usage

1. **Check Availability on Goodreads:**
   - Navigate to any Goodreads book list or individual book page.
   - On book list pages, an additional "Exists" column will display for each book. ✅ means the book is available in the Liverpool Library Catalogue; ❌ means it is not.
   - On individual book pages, a link will appear under the author's name indicating availability in the library catalogue.

2. **Direct Links to Library Catalogue:**
   - Each availability indicator links directly to the Liverpool Library’s catalogue page for easy access.

## Technical Overview

This extension consists of:
- **`manifest.json`**: Specifies metadata and permissions for the Chrome extension.
- **`background.js`**: Handles requests to the Liverpool Library Catalogue API, fetching and processing availability data.
- **`content.js`**: Injects functionality into Goodreads pages to display availability information based on fetched data.

### Main Functions

- `checkLibraryAvailability`: Sends a message from `content.js` to `background.js` to query the library's API for book availability.
- `handleBookListPage`: Adds availability indicators to Goodreads book lists.
- `handleBookDetailPage`: Adds availability status to individual book pages on Goodreads.

## Permissions

This extension requires the following permissions:
- **activeTab**: To interact with Goodreads pages.
- **storage**: For potential data storage.
- **runtime** and **webRequest**: For background requests to fetch library data.
- **Host permissions**: Access to `prism.librarymanagementcloud.co.uk` for querying Liverpool Library’s database.

## License

This project is licensed under the MIT License with additional non-commercial clauses:
   - You may not use this extension for commercial purposes.
   - Refer to the LICENSE file for detailed terms.

---

Happy reading! 📚
