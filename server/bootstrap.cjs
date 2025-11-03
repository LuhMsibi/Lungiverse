// CommonJS bootstrap to load ESM server bundle
// This file exists because cPanel's Node.js handler uses require()
// which doesn't support ESM modules with top-level await.
// This bootstrap uses dynamic import() to load the ESM bundle.

(async () => {
  try {
    // Dynamically import the ESM bundle
    await import('./index.js');
    console.log('✅ Application started successfully');
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
})();
