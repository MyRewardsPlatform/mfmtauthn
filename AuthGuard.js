(function () {
  // Immediately Invoked Function Expression (IIFE) to avoid polluting the global scope

  // Authentication State
  let isAuthenticated = false;

  // Event Listeners
  const listeners = [];

  // Check Authentication Status from localStorage
  const checkSession = () => {
    const session = localStorage.getItem("authSession");
    isAuthenticated = !!session;
    notifyListeners();
  };

  // Login Function
  const login = () => {
    // Create and display the iframe
    const iframe = document.createElement("iframe");
    iframe.src = "https://your-auth0-domain.com/login"; // Replace with your Auth0 login URL
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.id = "auth-iframe";
    document.body.appendChild(iframe);

    // Listen for messages from the iframe
    window.addEventListener("message", handleMessage, false);
  };

  const handleMessage = (event) => {
    if (event.origin !== "https://your-auth0-domain.com") return; // Replace with your Auth0 domain

    if (event.data === "authenticated") {
      localStorage.setItem("authSession", "true");
      isAuthenticated = true;
      notifyListeners();
      // Remove iframe
      const iframe = document.getElementById("auth-iframe");
      if (iframe) {
        iframe.remove();
      }
      window.removeEventListener("message", handleMessage);
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("authSession");
    isAuthenticated = false;
    notifyListeners();
  };

  // Register Listener
  const onAuthChange = (callback) => {
    listeners.push(callback);
  };

  // Notify All Listeners
  const notifyListeners = () => {
    listeners.forEach((callback) => callback(isAuthenticated));
  };

  // Initialize Authentication State
  checkSession();

  // Expose Functions to Global Scope
  window.AuthGuard = {
    isAuthenticated: () => isAuthenticated,
    login,
    logout,
    onAuthChange,
  };
})();
