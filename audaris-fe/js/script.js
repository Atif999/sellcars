document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Redirect to the customers page after successful login
        window.location.href = `customers.html?email=${email}`;
      } else {
        console.error("Login failed:", response.statusText);
        // Handle login failure (e.g., display error message)
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      // Handle login failure (e.g., display error message)
    }
  });
});
