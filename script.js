// slide js//
let slideIndex = 1;
showSlides(slideIndex);

// Function to go to the next/previous slide
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Function to go directly to a specific slide
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Main function to display the slides
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  // If the slideIndex is greater than the number of slides, loop back to the first slide
  if (n > slides.length) {
    slideIndex = 1;
  }

  // If the slideIndex is less than 1, go to the last slide
  if (n < 1) {
    slideIndex = slides.length;
  }

  // Hide all slides
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Remove "active" class from all dots
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Show the current slide and set the active dot
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
setInterval(function(){
    plusSlides(1)
},4000);

// Function to dynamically generate a container with image and details
function createContainer(index, titlesArray, detailsArray, paraArray, imageSources) {
    const container = document.createElement("div");
    container.classList.add("container");

    // Image section
    const imageSection = document.createElement("div");
    imageSection.classList.add("image");

    // Loop through imageSources array and create multiple <img> elements
    imageSources.forEach(imageSource => {
        const img = document.createElement("img");
        img.src = imageSource;  // Add the image source dynamically
        img.alt = "Image";      // Alternative text for the image
        imageSection.appendChild(img);
    });

    // Details section
    const detailsSection = document.createElement("div");
    detailsSection.classList.add("details");

    const box = document.createElement("div");
    box.classList.add("box");

    // Loop through titlesArray to create multiple <h2> elements
    titlesArray.forEach(title => {
        const h3 = document.createElement("h2");
        h3.innerText = title;
        box.appendChild(h3);
    });

    // Loop through paraArray to create multiple <p> elements
    paraArray.forEach(para => {
        const p = document.createElement("p");
        p.innerText = para;
        box.appendChild(p);
    });

    // Loop through detailsArray and add each detail as an <li> inside a <ul>
    const ul = document.createElement("ul");
    detailsArray.forEach(detail => {
        const li = document.createElement("li");

        // Check if the detail contains a URL (starts with http:// or https://)
        if (detail.startsWith("http://") || detail.startsWith("https://")) {
            const a = document.createElement("a");
            a.href = detail; // Set the URL
            a.innerText = "Visit here"; // Text for the link (you can change this as needed)
            a.target = "_blank"; // Open in a new tab
            li.appendChild(a);
        } else {
            li.innerText = detail; // If it's just text, add it as plain text
        }

        ul.appendChild(li);
    });
    
    box.appendChild(ul);
    detailsSection.appendChild(box);

    // Append image and details sections to the main container
    container.appendChild(imageSection);
    container.appendChild(detailsSection);

    return container;
}

// Get the container wrapper where all the boxes will be inserted
const containerWrapper = document.getElementById("container-wrapper");

// Titles for each box
const titlesForBoxes = [
    ["Kasaragod:"],
    ["Kochi"],
    ["Trivandrum"],
    [""],
    ["Main Title 5"],
    ["Mumbai"]
];

// Paragraphs for each box (paraForBoxes array)
const paraForBoxes = [
    ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
    ["Another paragraph for Box 2, explaining some content."],
    ["Box 3 has a different paragraph."],
    ["Box 4 has several paragraphs of content."],
    ["Box 5 includes a simple paragraph."],
    ["City of Dreams"]
];

// Create and append multiple containers (e.g., 5 containers) with dynamic details
const detailsForBoxes = [
    ["Detail 1 for Box 1", "Detail 2 for Box 1", "Detail 3 for Box 1", "resort", "https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"],
    ["Detail 1 for Box 2", "Detail 2 for Box 2", "Detail 3 for Box 2", "Detail 4 for Box 2"],
    ["Detail 1 for Box 3", "Detail 2 for Box 3"],
    ["Detail 1 for Box 4", "Detail 2 for Box 4", "Detail 3 for Box 4", "Detail 4 for Box 4", "Detail 5 for Box 4"],
    ["Detail 1 for Box 5", "Detail 2 for Box 6", "", "details"],
    ["Details", "https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"]
];

// Image sources for each box (imageSources array)
const imageSourcesForBoxes = [
    ["coffe cup.jpeg"],
    ["coffee beans.jpeg"],
    ["coffe cup.jpeg"],
    ["coffe cup.jpeg"],
    ["coffe cup.jpeg"],
    ["coffe cup.jpeg"]
];

// Create and append containers with dynamic details, titles, paragraphs, and images
for (let i = 0; i < detailsForBoxes.length; i++) {
    const newContainer = createContainer(i + 1, titlesForBoxes[i], detailsForBoxes[i], paraForBoxes[i], imageSourcesForBoxes[i]);
    containerWrapper.appendChild(newContainer);
}


// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function () {
  // Get the menu toggle button and the menu
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  // Toggle the 'show' class when the menu toggle is clicked
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
});
