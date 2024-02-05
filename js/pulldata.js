let current_planet;

const planets = [
  "earth", // level 1
  "venus", // level 2
  "mercury", // level 3
  "mars", // level 4
  "jupiter", // level 5
  "saturn", // level 6
  "uranus", // level 7
  "neptune", // level 8
];

function fetchdata(id) {
  fetch(`https://api.le-systeme-solaire.net/rest/bodies/${id}`).then(
    (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
  );
}

function fetchplanet(id) {
  fetch(
    `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&titles=${id}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0]; // Assuming there's only one page in the response
      const extract = pages[pageId].extract;

      const parser = new DOMParser();
      const doc = parser.parseFromString(extract, "text/html");

      const headers = doc.querySelectorAll("h2");

      updateContent(headers);
    });
}

function updateContent(headers) {
  let element = document.getElementById("content");

  function processLoop(i) {
    if (i < 5) {
      const div = document.createElement("div");
      div.className = headers[i].textContent;

      const radio = document.createElement("input");
      radio.name = current_planet;
      radio.type = "radio";
      radio.id = headers[i].textContent;
      if (i === 0) {
        radio.checked = true;
      }
      div.appendChild(radio);

      const label = document.createElement("label");
      //label.for = headers[i].textContent;
      label.setAttribute("for", headers[i].textContent);
      label.innerHTML = headers[i].textContent;

      div.appendChild(label);

      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";

      const p = document.createElement("p");
      let content = "";
      content = findNextParagraph(headers[i]);

      if (content === "\n" || content === "") {
        content = findNextParagraph2(headers[i]);
      }

      console.log("content1:" + content);
      //Summarize content (to be uncommented)
      // if (content.length > 1000) {
      //   summarize(content)
      //     .then((result) => {
      //       p.innerHTML = result.summary;
      //     })
      // } else {
      //   p.innerHTML = content;
      // }

      p.innerHTML = content;

      dropdown.appendChild(p);

      let search = current_planet + ` ` + headers[i].textContent;

      // async function loadImage() {
      //   try {
      //     const imageUrl = await fetchImages(search);
      //     console.log("Image URL:", imageUrl);

      //     // Set the src attribute after obtaining the image URL
      //     let src = imageUrl;
      //     // Append the image to the document or do whatever you need to do with it
      //     if (src !== null) {
      //       const image = document.createElement("img");
      //       image.id = headers[i].textContent + "img";
      //       image.src = imageUrl;
      //       image.onload = function () {
      //         resizeImageWithAspectRatio(image, 300);
      //         image.onclick = function () {
      //           handleImageClick(imageUrl);
      //           //dropdown.appendChild(image);
      //         };
      //         dropdown.appendChild(image);
      //       };

      //       // Set the src attribute after obtaining the image URL

      //       console.log("Image Element:", image.src);

      //       //dropdown.appendChild(resizedimage);
      //     }
      //   } catch (error) {
      //     console.error("Error fetching image:", error);
      //   }
      // }

      // loadImage();

      div.appendChild(dropdown);
      element.appendChild(div);
      setTimeout(() => {
        processLoop(i + 1);
      }, 1000);
    }
  }

  // Start the loop with the first iteration
  processLoop(0);
}

// async function fetchImages(search) {
//   const response = await fetch(
//     `https://www.googleapis.com/customsearch/v1?key=AIzaSyC6UOCo5PaHnSax9USYkN_e6ycE8gHFQlA&cx=0364b018377bd4cf1&searchType=image&q=${search}`
//   );

//   if (!response.ok) {
//     throw new Error(`HTTP error! Status: ${response.status}`);
//   }

//   const result = await response.json();

//   const substring = "https://science.nasa.gov";
//   for (let i = 0; i < result.items.length; i++) {
//     if (result.items[i].image.contextLink.includes(substring)) {
//       return result.items[i].link;
//     }
//   }
//   return null;
// }

/////////////////////////////////////////////////

function findNextParagraph2(element) {
  let currentElement = element.nextSibling;
  let savedElement;
  let content = "";

  //console.log(currentElement);

  // Loop until a <p> tag is found or there are no more siblings
  while (currentElement !== null) {
    savedElement = currentElement;
    //console.log("hello");
    if (
      currentElement.nodeName.toLowerCase() === "p" &&
      currentElement.textContent.trim() !== ""
    ) {
      // If a <p> tag is found, return its text content
      if (savedElement.nextSibling.nodeName.toLowerCase() !== "p") {
        content += currentElement.textContent;
        return content;
      }
    } else {
      content += currentElement.textContent;
    }

    // Move to the next sibling
    currentElement = currentElement.nextSibling;

  }
  // Move to the next sibling

  currentElement = currentElement.nextSibling;
  console.log(content);
}

function findNextParagraph(element) {
  let currentElement = element.nextElementSibling;
  let savedElement;
  let content = "";

  // Loop until a <p> tag is found or there are no more siblings
  while (currentElement !== null) {
    if (currentElement.tagName.toLowerCase() === "p") {
      // If a <p> tag is found, return its text content
      savedElement = currentElement;
      if (savedElement.nextElementSibling.tagName.toLowerCase() !== "p") {
        content += currentElement.textContent;
        return content;
      } else {
        content += currentElement.textContent;
      }
    }
    // Move to the next sibling
    currentElement = currentElement.nextElementSibling;
  }

  // If no <p> tag is found, return a message or handle it accordingly
  return "No <p> tag found in the next siblings.";
}

// Fetch data about the player's current planet based on user savedata

function fetchDataForCurrentPlanet(planetName) {
  if (planets.includes(planetName)) {
    current_planet = planetName;
    fetchplanet(planetName);
  } else {
    console.error("Invalid planet name:", planetName);
  }
}

async function resizeImageWithAspectRatio(image, newWidth) {
  const originalWidth = image.width;
  const originalHeight = image.height;

  // Calculate the aspect ratio
  const aspectRatio = originalWidth / originalHeight;

  // Calculate the new height based on the desired width and original aspect ratio
  const newHeight = newWidth / aspectRatio;

  // Set the new dimensions
  image.width = newWidth;
  image.height = newHeight;
}

function handleImageClick(imageSrc) {
  document.querySelector(".popup-image").style.display = "block";
  document.querySelector(".popup-image img").src = imageSrc;
}

document.querySelector(".popup-image span").onclick = () => {
  document.querySelector(".popup-image").style.display = "none";
};

async function summarize(content) {
  const url = 'https://text-summarize-pro.p.rapidapi.com/summarizeFromText';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '89bd6f2afbmshdcf0abe52204ecfp1c67dajsn80d79b55e8dc',
      'X-RapidAPI-Host': 'text-summarize-pro.p.rapidapi.com'
    },
    body: new URLSearchParams({
      text: content,
      percentage: '50'
    })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}
