// Nuclear option: JavaScript style override for Clerk modals
export const forceClerkWhiteBackground = () => {
  // Function to override styles
  const overrideStyles = () => {
    // Target all Clerk modal elements
    const clerkElements = document.querySelectorAll(`
      [class*="cl-modalContent"],
      [class*="cl-card"],
      [class*="cl-modal"],
      [class*="cl-rootBox"],
      [class*="cl-main"],
      [class*="cl-header"],
      [class*="cl-form"],
      [data-clerk-modal],
      [data-clerk-portal-root]
    `);

    clerkElements.forEach((element: any) => {
      if (element && element.style) {
        // Force white background with highest priority
        element.style.setProperty('background', '#ffffff', 'important');
        element.style.setProperty('background-color', '#ffffff', 'important');
        element.style.setProperty('background-image', 'none', 'important');
        element.style.setProperty('color', '#1a1a1a', 'important');
        
        // Also check all child elements
        const children = element.querySelectorAll('*');
        children.forEach((child: any) => {
          if (child && child.style) {
            child.style.setProperty('background', '#ffffff', 'important');
            child.style.setProperty('background-color', '#ffffff', 'important');
            child.style.setProperty('background-image', 'none', 'important');
          }
        });
      }
    });
  };

  // Run immediately
  overrideStyles();

  // Run when DOM changes (for when Clerk modals are added)
  const observer = new MutationObserver(() => {
    overrideStyles();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });

  // Also run on interval to catch any missed changes
  const intervalId = setInterval(overrideStyles, 100);

  // Clean up function
  return () => {
    observer.disconnect();
    clearInterval(intervalId);
  };
};