// Function to send a request to background.js and get the availability
async function checkLibraryAvailability(author, title) {
    return new Promise((resolve, reject) => {
        console.log('Attempting to send message to background script...');
        chrome.runtime.sendMessage(
            {
                type: 'checkLibraryAvailability',
                author,
                title
            },
            (response) => {
                console.log('Response received from background script:', response);
                if (response && response.isAvailable !== undefined) {
                    resolve(response.isAvailable);
                } else {
                    reject('No response or invalid response from background script');
                }
            }
        );
    });
}

// Helper function to format author name: "Last, First" to "First Last"
function formatAuthorName(author) {
    const parts = author.split(',');
    if (parts.length === 2) {
        const lastName = parts[0].trim();
        const firstName = parts[1].trim();
        return `${firstName} ${lastName}`;
    }
    return author;
}

// Helper function to get the book title excluding spans with the class 'darkGreyText'
function getCleanedTitle(element) {
    const titleSpans = element.querySelectorAll('span.darkGreyText');
    let title = element.textContent.trim();

    // Remove the text of all darkGreyText spans from the title
    titleSpans.forEach(span => {
        title = title.replace(span.textContent.trim(), '').trim();
    });
    return title;
}

// Function to handle the Goodreads book list page
function handleBookListPage() {
    const table = document.querySelector('#books');
    if (!table) return;

    const headerRow = table.querySelector('thead tr');
    if (!headerRow) {
        console.error('Header row not found!');
        return;
    }

    const existsHeader = document.createElement('th');
    existsHeader.textContent = 'Exists';
    headerRow.appendChild(existsHeader);

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(async (row) => {
        const titleCell = row.querySelector('.field.title .value');
        const authorCell = row.querySelector('.field.author .value');

        if (titleCell && authorCell) {
            const title = getCleanedTitle(titleCell);
            const author = formatAuthorName(authorCell.textContent.trim());

            try {
                const isAvailable = await checkLibraryAvailability(author, title);

                const existsCell = document.createElement('td');
                existsCell.classList.add('exists-column');
                existsCell.style.textAlign = 'center';

                const queryUrl = `https://prism.librarymanagementcloud.co.uk/liverpool/items?query=+author%3A%28${encodeURIComponent(author)}%29+AND+title%3A%28%22${encodeURIComponent(title)}%22%29+AND+format%3A%28book%29`;
                const link = document.createElement('a');
                link.href = queryUrl;
                link.target = '_blank';
                link.textContent = isAvailable ? '✅' : '❌';

                existsCell.appendChild(link);
                row.appendChild(existsCell);

            } catch (error) {
                console.error('Error checking availability:', error);
            }
        }
    });
}

// Function to handle the Goodreads individual book page
async function handleBookDetailPage() {
    if (!window.location.href.startsWith("https://www.goodreads.com/book/show/")) return;

    const titleElement = document.querySelector('h1[data-testid="bookTitle"]');
    if (!titleElement) {
        console.error("Title element not found!");
        return;
    }
    const title = titleElement.textContent.trim();

    const authorElement = document.querySelector('.ContributorLink__name[data-testid="name"]');
    if (!authorElement) {
        console.error("Author element not found!");
        return;
    }
    const author = authorElement.textContent.trim();

    try {
        const isAvailable = await checkLibraryAvailability(author, title);

        const existsElement = document.createElement('div');
        existsElement.classList.add('ContributorLink'); // Match author styling
        existsElement.style.display = 'block'; // Place on a new line

        const statusLink = document.createElement('a');
        statusLink.classList.add('ContributorLink__name'); // Style similar to author
        statusLink.style.fontWeight = 'bold';
        statusLink.href = `https://prism.librarymanagementcloud.co.uk/liverpool/items?query=+author%3A%28${encodeURIComponent(author)}%29+AND+title%3A%28%22${encodeURIComponent(title)}%22%29+AND+format%3A%28book%29`;
        statusLink.target = '_blank';
        statusLink.textContent = isAvailable ? '✅ Exists In Liverpool Library Catalogue' : '❌ Not Available in Liverpool Library Catalogue';

        existsElement.appendChild(statusLink);

        // Insert the "Exists" element below the author section
        authorElement.closest('.ContributorLinksList').appendChild(existsElement);

    } catch (error) {
        console.error("Error checking availability:", error);
    }
}

// Function to determine and handle the current page type
function determinePageTypeAndHandle() {
    if (window.location.href.includes("/book/show/")) {
        handleBookDetailPage();
    } else if (window.location.href.includes("/list")) {
        handleBookListPage();
    }
}

// Run the function when the page has loaded
window.addEventListener('load', determinePageTypeAndHandle);
