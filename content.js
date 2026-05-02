// Content script for eBay Scam Remover extension
console.log('eBay Scam Remover extension loaded');

// Function to detect scam listings
function detectScamListings() {
  console.log('Detecting scam listings on eBay...');

  // Find all eBay listings on the page - support both old and new eBay layouts
  const listings = document.querySelectorAll('.s-card, li.s-result-item, .s-item');
  console.log('Found', listings.length, 'listings');

  listings.forEach(listing => {
    // Skip if already processed
    if (listing.dataset.scamChecked) return;
    listing.dataset.scamChecked = 'true';
    
    let reviewCount = 0;
    let feedbackText = '';
    
    // METHOD 1: Look in the secondary attributes section (new eBay format)
    const secondaryAttrs = listing.querySelectorAll('.su-card-container__attributes__secondary .su-styled-text, .s-card__secondary .su-styled-text');
    
    for (let el of secondaryAttrs) {
      const text = el.textContent.trim();
      // Match patterns like "99.4% positive (750.6K)" or "0% positive (0)"
      if (text.match(/\d+(\.\d+)?%\s*(positive|neutral|negative)/i)) {
        feedbackText = text;
        break;
      }
    }
    
    // METHOD 2: Fallback - look for any text with % positive or review count
    if (!feedbackText) {
      const allStyledText = listing.querySelectorAll('.su-styled-text');
      for (let el of allStyledText) {
        const text = el.textContent.trim();
        if (text.match(/\d+(\.\d+)?%\s*(positive|neutral|negative)/i) || 
            text.match(/\(\s*\d+\s*\)/) || 
            text.match(/\(\s*\d+[KMB]?\s*\)/i)) {
          feedbackText = text;
          break;
        }
      }
    }
    
    // METHOD 3: Look for old format seller info
    if (!feedbackText) {
      const oldFormat = listing.querySelector('span.s-item__seller-info, .x-item__rev__html');
      if (oldFormat) {
        feedbackText = oldFormat.textContent.trim();
      }
    }

    if (feedbackText) {
      console.log('Feedback found:', feedbackText);
      
      // Extract review count - handle various formats
      // Pattern: "99.4% positive (750.6K)" or "0% positive (0)" or "(1)"
      let match = feedbackText.match(/\((\d[\d,\.]*)([KMB])?\s*\)/i);
      
      if (match) {
        let numStr = match[1].replace(/,/g, '');
        reviewCount = parseFloat(numStr) || 0;
        
        // Handle K/M/B suffixes
        if (match[2]) {
          const suffix = match[2].toUpperCase();
          if (suffix === 'K') reviewCount *= 1000;
          else if (suffix === 'M') reviewCount *= 1000000;
          else if (suffix === 'B') reviewCount *= 1000000000;
        }
        
        reviewCount = Math.floor(reviewCount);
      }
      
      console.log('Review count:', reviewCount);
      
      // Flag sellers with 0 reviews (new scam accounts)
      if (reviewCount === 0) {
        highlightScamListing(listing, '0 reviews - likely scam account');
      }
      // Flag sellers with only 1 review (potential scam)
      else if (reviewCount === 1) {
        highlightPotentialScamListing(listing, '1 review - may be scam');
      }
    }
  });
}

// Function to highlight scam listings with red background
function highlightScamListing(listing, reason) {
  // Only process once
  if (listing.classList.contains('scam-indicator')) return;
  
  // Add scam indicator class for red styling
  listing.classList.add('scam-indicator');
  // Also set inline style to ensure row is highlighted
  listing.style.setProperty('background-color', '#ffcccc', 'important');
  listing.style.setProperty('outline', '3px solid #ff0000', 'important');
  console.log('Marked as SCAM:', reason);

  // Add a visible label badge
  const label = document.createElement('div');
  label.className = 'scam-label';
  label.textContent = '⚠️ SCAM - ' + reason;
  label.style.cssText = `
    background-color: #ff0000 !important;
    color: white;
    padding: 6px 10px;
    font-weight: bold;
    font-size: 12px;
    margin: 4px;
    border-radius: 4px;
    display: inline-block;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  `;

  // Try to insert at a visible spot - use title or first position
  const titleArea = listing.querySelector('.s-card__title, .s-item__title, h3');
  if (titleArea && titleArea.parentNode) {
    titleArea.parentNode.insertBefore(label, titleArea.nextSibling);
  } else {
    listing.insertBefore(label, listing.firstChild);
  }
}

// Function to highlight potential scam listings with yellow background
function highlightPotentialScamListing(listing, reason) {
  // Only process once
  if (listing.classList.contains('potential-scam-indicator')) return;
  
  // Add potential scam indicator class for yellow styling
  listing.classList.add('potential-scam-indicator');
  // Also set inline style to ensure row is highlighted
  listing.style.setProperty('background-color', '#fff9c4', 'important');
  listing.style.setProperty('outline', '3px solid #ffaa00', 'important');
  console.log('Marked as POTENTIAL SCAM:', reason);

  // Add a visible label badge
  const label = document.createElement('div');
  label.className = 'scam-label potential-scam-label';
  label.textContent = '⚠️ CAUTION - ' + reason;
  label.style.cssText = `
    background-color: #ffaa00 !important;
    color: white;
    padding: 6px 10px;
    font-weight: bold;
    font-size: 12px;
    margin: 4px;
    border-radius: 4px;
    display: inline-block;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  `;

  // Try to insert at a visible spot
  const titleArea = listing.querySelector('.s-card__title, .s-item__title, h3');
  if (titleArea && titleArea.parentNode) {
    titleArea.parentNode.insertBefore(label, titleArea.nextSibling);
  } else {
    listing.insertBefore(label, listing.firstChild);
  }
}

// Run when page loads
detectScamListings();

// Watch for dynamically loaded listings (infinite scroll, pagination)
const observer = new MutationObserver((mutations) => {
  let shouldScan = false;
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && (node.matches('.s-card, li.s-result-item') || 
            node.querySelector('.s-card, li.s-result-item'))) {
          shouldScan = true;
        }
      });
    }
  });
  if (shouldScan) {
    // Small delay to let the DOM settle
    setTimeout(detectScamListings, 500);
  }
});

// Observe the main listings container
const listingsContainer = document.querySelector('.s-items, #srp-river-results, main') || document.body;
observer.observe(listingsContainer, { childList: true, subtree: true });
console.log('Watching for new listings...');