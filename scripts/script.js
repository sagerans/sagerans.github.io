// --- Contact Form AJAX Submit ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Stops the page from refreshing

    const data = new FormData(event.target);

    try {
      const response = await fetch(event.target.action, {
        method: contactForm.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.innerHTML = "Thanks for reaching out! I'll get back to you soon.";
        formStatus.style.color = "#a9c191";
        contactForm.reset(); // Clears the input fields
      } else {
        formStatus.innerHTML = "Oops! There was a problem submitting your form.";
        formStatus.style.color = "red";
      }
    } catch (error) {
      formStatus.innerHTML = "Oops! There was a problem submitting your form.";
      formStatus.style.color = "red";
    }
  });
}

function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function openPopup() {
  document.getElementById('popupOverlay').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popupOverlay').style.display = 'none';
}

function selectOption(option) {
  alert('You selected: ' + option);
  closePopup();
}

function sendMessage() {

}

// --- Photography Gallery Lightbox Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  // Convert NodeList to an Array so we can easily find the index of the images
  const galleryImages = Array.from(document.querySelectorAll(".gallery-img"));
  const closeBtn = document.querySelector(".close-lightbox");

  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  let currentIndex = 0; // Keeps track of which image is currently open

  // If we are on the gallery page, initialize the lightbox
  if (lightbox && galleryImages.length > 0) {

    // Helper function to update the image source
    function updateImage(index) {
      lightboxImg.src = galleryImages[index].src;
    }

    // 1. Open Lightbox when an image is clicked
    galleryImages.forEach((img, index) => {
      img.addEventListener("click", () => {
        currentIndex = index; // Remember which image we clicked
        updateImage(currentIndex);
        lightbox.classList.add("show");
      });
    });

    // 2. Navigation Functions (loops back to start/end if you go past the edge)
    function showNext() {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateImage(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateImage(currentIndex);
    }

    // 3. Arrow Click Event Listeners
    if (leftArrow && rightArrow) {
      leftArrow.addEventListener("click", showPrev);
      rightArrow.addEventListener("click", showNext);
    }

    // 4. Close Lightbox on 'X' click
    closeBtn.addEventListener("click", () => {
      lightbox.classList.remove("show");
    });

    // 5. Close Lightbox if the user clicks the dark background
    lightbox.addEventListener("click", (e) => {
      // e.target === lightbox ensures it ONLY closes if you click the dark background itself
      if (e.target === lightbox) {
        lightbox.classList.remove("show");
      }
    });

    // 6. Keyboard Controls (ESC, Left Arrow, Right Arrow)
    document.addEventListener("keydown", (e) => {
      // If the lightbox isn't open, ignore keyboard presses
      if (!lightbox.classList.contains("show")) return;

      if (e.key === "Escape") {
        lightbox.classList.remove("show");
      } else if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      }
    });
  }
});

// 1. Your Mini-Database
// Always add your newest post to the VERY TOP of this list.
const blogPosts = [
  {
    title: "The Title of My Newest Post",
    date: "February 19, 2026",
    excerpt: "This is a short preview or excerpt of your most recent piece of writing. It catches the reader's attention and makes them want to click to read the rest.",
    link: "posts/my-newest-story.html"
  },
  {
    title: "My Second Newest Post",
    date: "January 10, 2026",
    excerpt: "A short preview of this older post. Notice how much easier it is to just type text here instead of copying HTML tags!",
    link: "posts/second-story.html"
  },
  {
    title: "An Older Piece of Writing",
    date: "December 5, 2025",
    excerpt: "Another short preview snippet goes right here...",
    link: "posts/third-story.html"
  },
  {
    title: "The First Thing I Wrote",
    date: "November 20, 2025",
    excerpt: "Just a brief teaser for the readers...",
    link: "posts/fourth-story.html"
  }
];

// 2. The Rendering Logic
function renderBlogPosts() {
  const featuredContainer = document.getElementById("featured-post-container");
  const previousContainer = document.getElementById("previous-posts-container");

  // Safety check: Make sure we have posts to show
  if (blogPosts.length === 0) {
    featuredContainer.innerHTML = "<p>Coming soon!</p>";
    return;
  }

  // Build the Featured Post (Index 0)
  const newestPost = blogPosts[0];
  featuredContainer.innerHTML = `
    <div class="featured-card">
      <a href="${newestPost.link}">
        <h3>${newestPost.title}</h3>
        <p class="post-date">${newestPost.date}</p>
        <p class="post-excerpt">${newestPost.excerpt}</p>
        <span class="read-more">Read Full Story &rarr;</span>
      </a>
    </div>
  `;

  // Build the Older Posts Grid (Everything after Index 0)
  if (blogPosts.length > 1) {
    let olderPostsHTML = "";

    for (let i = 1; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      olderPostsHTML += `
        <a href="${post.link}" class="blog-card">
          <h4>${post.title}</h4>
          <p class="post-date">${post.date}</p>
          <p class="post-excerpt">${post.excerpt}</p>
        </a>
      `;
    }

    previousContainer.innerHTML = olderPostsHTML;
  } else {
    // Hide the previous posts section if there's only 1 post total
    document.querySelector('.previous-posts').style.display = 'none';
    document.querySelector('.blog-divider').style.display = 'none';
  }
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", renderBlogPosts);
