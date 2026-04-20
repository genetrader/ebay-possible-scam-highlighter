// Background script for eBay Scam Remover extension
console.log('eBay Scam Remover background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('eBay Scam Remover extension installed');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scamDetected') {
    console.log('Scam detected on page:', message.url);
    // Handle scam detection logic
  }
});