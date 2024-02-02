window.onload = function () {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));

  if (user) {
    // Check if the element exists before updating its content

    const usernameDisplay = document.getElementById("player-username-display");
    if (usernameDisplay) {
      //  usernameDisplay.textContent = user.username;
      typeWriter(usernameDisplay, "Welcome, "+user.username);
    }

    // Update other elements as before
    const currentPlanetDisplay = document.getElementById(
      "player-current-planet"
    );
    if (currentPlanetDisplay) {
      //currentPlanetDisplay.textContent = user.savedata.current_planet;
      typeWriter(currentPlanetDisplay, user.savedata.current_planet);
    }

    const levelDisplay = document.getElementById("player-level");
    if (levelDisplay) {
      //levelDisplay.textContent = user.savedata.level;
      let level = user.savedata.level.toString();
      typeWriter(levelDisplay, level);
    }

    const fuelDisplay = document.getElementById("player-fuel");
    if (fuelDisplay) {
      //fuelDisplay.textContent = user.savedata.fuel;
      let fuel = user.savedata.fuel.toString();
      typeWriter(fuelDisplay, fuel);
    }

    const titleDisplay = document.getElementById("player-title");
    if (titleDisplay) {
      //titleDisplay.textContent = user.savedata.title;
      typeWriter(titleDisplay, user.savedata.title);
    }

    if (typeof fetchDataForCurrentPlanet === "function") {
      fetchDataForCurrentPlanet(user.savedata.current_planet);
    }
  } else {
    // Redirect to login page if no session data
    window.location.href = "login.html";
  }
};

function logout() {
  // clear session data
  sessionStorage.removeItem("currentUser");
  // redirect to landing page
  window.location.href = "index.html";
}

function typeWriter(element, text, i = 0) {
  if (i === 0) {
    element.textContent = "";
  }
  element.textContent += text[i];

  if (i === text.length - 1) {
    return;
  }

  if (text === undefined) {
    return;
  }

  setTimeout(() => typeWriter(element, text, i + 1), 150);
}
