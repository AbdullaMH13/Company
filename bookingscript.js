document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const containerWrapper = document.getElementById("container-wrapper");

    // Titles for each box
    const titlesForBoxes = [
        ["Rajasthan"],
        ["Kerala"],
        ["Uttarakhand"],
        ["Goa"],
        ["Maharashtra"],
        ["Tamil Nadu"],
        ["Karnataka"],
        ["Himachal Pradesh"],
        ["Jammu & Kashmir"]
    ];

    // Paragraphs for each box
    const paraForBoxes = [
        ["Rajasthan, known for its rich history, grand palaces, and majestic forts, offers a truly royal experience."],
        ["Kerala, often called 'God's Own Country', is famous for its tranquil backwaters, lush landscapes, and serene beaches."],
        ["Uttarakhand, with its scenic Himalayan views, is a haven for adventure enthusiasts and spiritual seekers alike."],
        ["Goa, with its golden beaches, vibrant nightlife, and Portuguese heritage, is a top choice for a beach holiday."],
        ["Maharashtra, home to Mumbai's fast-paced life, beautiful hill stations, and historic caves like Ajanta and Ellora."],
        ["Tamil Nadu is a land of ancient temples, rich culture, and scenic hill stations like Ooty and Kodaikanal."],
        ["Karnataka offers a mix of history, culture, and natural beauty, with its famous attractions like Hampi and Coorg."],
        ["Himachal Pradesh is a paradise for nature lovers and adventure seekers, with beautiful hill stations like Manali and Shimla."],
        ["Jammu & Kashmir, with its breathtaking landscapes, stunning valleys, and peaceful lakes, is a must-visit destination."]
    ];

    // Details for each box
    const detailsForBoxes = [
        ["https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"],
        ["contact"],
        ["https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"],
        ["https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"],
        ["https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"],
        ["https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"],
        ["https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"],
        ["https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"],
        ["https://www.tajhotels.com/en-in/hotels/taj-bekal-kerala/restaurants/backwater-cafe"]
    ];

    // Image sources for each box
    const imageSourcesForBoxes = [
        ["photos/rajasthan.jpg"],
        ["photos/kerala.jpg"],
        ["photos/img3.jpg"],
        ["photos/goa.jpg"],
        ["photos/Maharashtra.jpg"],
        ["photos/tamil nadu.jpg"],
        ["photos/karnataka.jpg"],
        ["photos/Himachal Pradesh1.jpg"],
        ["photos/Jammu & Kashmir.jpg"],
    ];

    // Function to create and append multiple containers with dynamic details, titles, paragraphs, and images
    function createContainer(index, titlesArray, detailsArray, paraArray, imageSources) {
        const container = document.createElement("div");
        container.classList.add("container");

        // Image section
        const imageSection = document.createElement("div");
        imageSection.classList.add("image");
        imageSources.forEach(imageSource => {
            const img = document.createElement("img");
            img.src = imageSource;
            img.alt = "Image " + index;
            imageSection.appendChild(img);
        });

        // Details section
        const detailsSection = document.createElement("div");
        detailsSection.classList.add("details");
        const box = document.createElement("div");
        box.classList.add("box");

        // Titles
        titlesArray.forEach(title => {
            const h3 = document.createElement("h2");
            h3.innerText = title;
            box.appendChild(h3);
        });

        // Paragraphs
        paraArray.forEach(para => {
            const p = document.createElement("p");
            p.innerText = para;
            p.style.color = "#000000";
            box.appendChild(p);
        });

        // Details/Links
        detailsArray.forEach(detail => {
            const h4 = document.createElement("h4");

            // Handle URLs and special cases like 'contact'
            if (detail.startsWith("http://") || detail.startsWith("https://")) {
                const a = document.createElement("a");
                a.href = detail;
                a.innerText = "Explore The Place";
                a.target = "_blank";
                a.classList.add("button-link");
                h4.appendChild(a);
            } else if (detail === "contact") {
                const a = document.createElement("a");
                a.href = "kerala.html";
                a.innerText = "Explore The Place";
                a.target = "_self";
                a.classList.add("button-link");
                h4.appendChild(a);
            } else {
                h4.innerText = detail;
            }

            box.appendChild(h4);
        });

        detailsSection.appendChild(box);
        container.appendChild(imageSection);
        container.appendChild(detailsSection);

        return container;
    }

    // Function to filter and show content based on search query
    function filterContent(query) {
        const filteredData = titlesForBoxes.map((titles, index) => {
            const titleMatches = titles.some(title => title.toLowerCase().includes(query.toLowerCase()));
            const paraMatches = paraForBoxes[index].some(para => para.toLowerCase().includes(query.toLowerCase()));

            if (titleMatches || paraMatches) {
                return createContainer(index, titles, detailsForBoxes[index], paraForBoxes[index], imageSourcesForBoxes[index]);
            }
            return null;
        }).filter(item => item !== null);

        // Clear previous content and add filtered content
        containerWrapper.innerHTML = '';
        filteredData.forEach(container => containerWrapper.appendChild(container));
    }

    // Event listener for search input
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim();
        filterContent(query);
    });

    // Initially populate all content
    function populateAllContent() {
        titlesForBoxes.forEach((titles, index) => {
            const newContainer = createContainer(index, titles, detailsForBoxes[index], paraForBoxes[index], imageSourcesForBoxes[index]);
            containerWrapper.appendChild(newContainer);
        });
    }

    // Initial content population
    populateAllContent();

    // Star animation for buttons using event delegation
    document.addEventListener("mouseover", function (event) {
        if (event.target && event.target.matches(".button-link")) {
            const btn = event.target;
            removeStars();
            let stars = [];
            for (let i = 0; i < 5; i++) {
                let star = document.createElement("div");
                star.classList.add("stars");
                if (Math.random() > 0.5) star.classList.add("large");
                document.body.appendChild(star);

                let buttonRect = btn.getBoundingClientRect();
                let startX = Math.random() * buttonRect.width + buttonRect.left;
                let startY = Math.random() * buttonRect.height + buttonRect.top;

                star.style.left = `${startX}px`;
                star.style.top = `${startY}px`;

                setTimeout(() => {
                    let angle = Math.random() * 2 * Math.PI;
                    let distance = Math.random() * 50 + 20;
                    let moveX = Math.cos(angle) * distance;
                    let moveY = Math.sin(angle) * distance;
                    star.style.transform = `rotate(45deg) translate(${moveX}px, ${moveY}px)`;
                    star.style.opacity = "1";
                }, 50);

                stars.push(star);
            }
        }
    });

    document.addEventListener("mouseleave", function (event) {
        if (event.target && event.target.matches(".button-link")) {
            removeStars();
        }
    });

    function removeStars() {
        const stars = document.querySelectorAll(".stars");
        stars.forEach(star => {
            star.style.opacity = "0";
            setTimeout(() => star.remove(), 500);
        });
    }
});
