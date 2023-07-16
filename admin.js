function togglePage(pageId) {
    // Hide all pages
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
      pages[i].style.display = 'none';
    }
    
    // Show the selected page
    document.getElementById(pageId).style.display = 'block';
  }
  
  // Initially show only the dashboard page
  togglePage('dashboard');