document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('leaves-container');
  if (!container) return; // Only runs if the container exists on the page

  const leafCount = 24; // Adjust for more or fewer leaves

  const isPostPage = window.location.pathname.includes('/posts/');

  // If in a post, step up one folder (../images/). Otherwise, use standard (images/)
  const imgFolder = isPostPage ? '../images/' : 'images/';

  // 1. Array of your different SVG leaf files with the dynamic path
  const leafImages = [
    `${imgFolder}sageleafone.svg`,
    `${imgFolder}sageleaftwo.svg`,
    `${imgFolder}sageleafthree.svg`
  ];

  for (let i = 0; i < leafCount; i++) {
    const leaf = document.createElement('img');

    // 2. Pick a random image from the array
    const randomImage = leafImages[Math.floor(Math.random() * leafImages.length)];
    leaf.src = randomImage;
    leaf.classList.add('leaf');

    // Randomize starting position (from 0% to 100% of the screen width)
    leaf.style.left = ((Math.random() * 100) - 2) + 'vw';

    // Randomize falling and swaying speeds
    const fallDuration = (Math.random() * 6) + 8;
    const swayDuration = (Math.random() * 3) + 3;
    leaf.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;

    // Randomize the start delay so they don't all drop at once
    const fallDelay = Math.random() * -30;
    const swayDelay = Math.random() * -10;
    leaf.style.animationDelay = `${fallDelay}s, ${swayDelay}s`;

    // Randomize the scale and starting rotation for maximum variety
    const scale = (Math.random() * 0.4) + 0.8;
    const startRotation = Math.floor(Math.random() * 360); // Random tilt!

    leaf.style.filter = `drop-shadow(0px 4px 6px rgba(0,0,0,0.1))`;
    leaf.style.transform = `scale(${scale}) rotate(${startRotation}deg)`;

    container.appendChild(leaf);
  }
});

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

// dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('theme-checkbox');

  if (!toggleSwitch) return; // Failsafe if the toggle isn't on this specific page

  // 1. Check local storage OR the user's system preferences
  const currentTheme = localStorage.getItem('theme') ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  // 2. Apply the theme on load and physically check the box if needed
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleSwitch.checked = true;
  }

  // 3. Listen for the slider movement
  const themeMeta = document.getElementById('theme-color-meta');

  toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      if (themeMeta) themeMeta.setAttribute('content', '#799362'); // Dark mode header color
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      if (themeMeta) themeMeta.setAttribute('content', '#a9c191'); // Light mode header color
    }
  });
  // Also update the on-load check so it matches if they refresh!
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleSwitch.checked = true;
    if (themeMeta) themeMeta.setAttribute('content', '#799362');
  }
});
