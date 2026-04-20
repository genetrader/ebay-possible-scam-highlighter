// Content script for eBay Scam Remover extension
console.log('eBay Scam Remover extension loaded');

// Function to detect scam listings
function detectScamListings() {
  console.log('Detecting scam listings...');

  // Find all eBay listings on the page
  const listings = document.querySelectorAll('li.s-result-item');

  listings.forEach(listing => {
    // Look for seller feedback information
    const feedbackElement = listing.querySelector('span.s-item__seller-info');

    if (feedbackElement) {
      const feedbackText = feedbackElement.textContent.trim();

      // Check for sellers with 0% positive feedback (scam)
      if (feedbackText.includes('0% positive')) {
        highlightScamListing(listing, '0% positive feedback');
      }
      // Check for sellers with only 1 review (potential scam)
      else if (feedbackText.includes('(1)')) {
        highlightPotentialScamListing(listing, '1 review');
      }
    }
  });
}

// Function to highlight scam listings with red background
function highlightScamListing(listing, reason) {
  // Add scam indicator class for red styling
  listing.classList.add('scam-indicator');

  // Add a label to indicate the scam
  const label = document.createElement('span');
  label.className = 'scam-label';
  label.textContent = 'POSSIBLE SCAM - ' + reason;
  label.style.cssText = `
    background-color: red;
    color: white;
    padding: 2px 4px;
    font-weight: bold;
    font-size: 12px;
    margin-right: 5px;
    border-radius: 3px;
    position: absolute;
    top: 5px;
    left: 5px;
  `;

  // Add the label to the listing
  if (listing.querySelector('.scam-label') === null) {
    listing.appendChild(label);
  }
}

// Function to highlight potential scam listings with yellow background
function highlightPotentialScamListing(listing, reason) {
  // Add potential scam indicator class for yellow styling
  listing.classList.add('potential-scam-indicator');

  // Add a label to indicate the potential scam
  const label = document.createElement('span');
  label.className = 'scam-label';
  label.textContent = 'POSSIBLE SCAM - ' + reason;
  label.style.cssText = `
    background-color: yellow;
    color: black;
    padding: 2px 4px;
    font-weight: bold;
    font-size: 12px;
    margin-right: 5px;
    border-radius: 3px;
    position: absolute;
    top: 5px;
    left: 5px;
  `;

  // Add the label to the listing
  if (listing.querySelector('.scam-label') === null) {
    listing.appendChild(label);
  }
}

// Run when page loads
detectScamListings();