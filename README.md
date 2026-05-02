# eBay Possible Scam Highlighter

A Chrome extension that helps identify and highlight eBay listings with zero feedback sellers and sellers with only 1 review to reduce exposure to scams.

![eBay Scam Highlighter in Action](screenshot.png)

## Features

- **Automatic Detection** - Detects sellers with 0 reviews (new scam accounts)
- **Caution Alerts** - Flags sellers with only 1 review as potential risks
- **High Visibility Highlighting**:
  - 🔴 **Red background** for 0 review sellers (likely scam)
  - 🟡 **Yellow background** for 1 review sellers (potential scam)
- **Badge Labels** - Adds "⚠️ SCAM" or "⚠️ CAUTION" warning badges to suspicious listings
- **Dynamic Content Support** - Works with infinite scroll and pagination
- **Lightweight** - Only runs on eBay pages

## How It Works

The extension scans eBay search result pages for sellers with:

- **0 reviews** → highlighted with:
  - Light red background (#ffcccc)
  - Red border outline
  - "⚠️ SCAM" badge label

- **1 review** → highlighted with:
  - Light yellow background (#fff9c4)
  - Orange border outline  
  - "⚠️ CAUTION" badge label

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the folder containing this extension

## Icon Setup

The extension requires three icon sizes in the `icons` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main detection and highlighting logic
- `styles.css` - Additional styling
- `background.js` - Background service worker

## License

MIT