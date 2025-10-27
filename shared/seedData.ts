// SVG placeholder images for articles
const aiTransformImage = 'data:image/svg+xml;base64,' + Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(99,102,241);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(168,85,247);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#grad1)"/>
    <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">AI Transformation</text>
  </svg>
`).toString('base64');

const aiToolsGuideImage = 'data:image/svg+xml;base64,' + Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(59,130,246);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(14,165,233);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#grad2)"/>
    <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">AI Tools Guide</text>
  </svg>
`).toString('base64');

const fileConversionImage = 'data:image/svg+xml;base64,' + Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(34,197,94);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(22,163,74);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#grad3)"/>
    <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">File Conversion</text>
  </svg>
`).toString('base64');

const aiProductivityImage = 'data:image/svg+xml;base64,' + Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(249,115,22);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(234,88,12);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#grad4)"/>
    <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">AI Productivity</text>
  </svg>
`).toString('base64');

const futureAIImage = 'data:image/svg+xml;base64,' + Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(236,72,153);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(219,39,119);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#grad5)"/>
    <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">Future of AI</text>
  </svg>
`).toString('base64');

export { aiTransformImage, aiToolsGuideImage, fileConversionImage, aiProductivityImage, futureAIImage };
