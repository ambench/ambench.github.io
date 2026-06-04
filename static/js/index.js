// Placeholder for any JavaScript functionality
// Add video controls, animations, etc. as needed

document.addEventListener('DOMContentLoaded', function () {
  // Code (Coming Soon) click handler - scroll to top
  var codeComingSoon = document.querySelector('.code-coming-soon');
  if (codeComingSoon) {
    codeComingSoon.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Mobile version
  var codeComingSoonMobile = document.querySelector('.link-block .code-coming-soon');
  if (codeComingSoonMobile) {
    codeComingSoonMobile.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
