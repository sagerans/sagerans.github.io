// 1. Your Mini-Database
// Always add your newest post to the VERY TOP of this list.
const blogPosts = [
  {
    title: "Word of the Week: Prosecution",
    date: "February 21, 2026",
    excerpt: "This is a short preview or excerpt of your most recent piece of writing. It catches the reader's attention and makes them want to click to read the rest.",
    link: "posts/2026-02-21_word-of-the-week.html"
  }
];

// 2. The Rendering Logic
async function renderBlogPosts() {
  const featuredContainer = document.getElementById("featured-post-container");
  const previousContainer = document.getElementById("previous-posts-container");

  // Stop right here if we aren't on the writing page!
  if (!featuredContainer || !previousContainer) {
    return;
  }

  // Safety check: Make sure we have posts to show
  if (blogPosts.length === 0) {
    featuredContainer.innerHTML = "<p>Coming soon!</p>";
    return;
  }

  // --- NEW: Fetch and Display the Full Newest Post ---
  const newestPost = blogPosts[0];

  try {
    // Go grab the HTML file for the newest post
    const response = await fetch(newestPost.link);
    const htmlString = await response.text();

    // Turn that text into readable HTML elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Find the actual story content inside that file
    const storyContent = doc.querySelector('.post-body').innerHTML;

    // Inject the title, date, and full story into the page
    //       <div class="post-content" style="text-align: left; max-width: 800px; margin: 0 auto; border-color: #ccc;">

    featuredContainer.innerHTML = `
      <div style="text-align: left; max-width: 800px; margin: 0 auto; padding: 0 20px;">
        <div class="post-header" style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
          <h2 style="color: #696969; font-size: 2.2em; margin-bottom: 10px; margin-top: 0;">${newestPost.title}</h2>
          <p class="post-date" style="color: #888;">${newestPost.date}</p>
        </div>
        <div class="post-body" style="line-height: 1.8; color: #444; font-size: 1.1em;">
          ${storyContent}
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Could not load full post:", error);
    // Fallback just in case the fetch fails
    featuredContainer.innerHTML = `
      <div class="featured-card">
        <h3>${newestPost.title}</h3>
        <p>Error loading full post automatically. <a href="${newestPost.link}" style="color: #a9c191; font-weight: bold;">Click here to read it.</a></p>
      </div>
    `;
  }

  // --- OLDER POSTS GRID (Remains exactly the same) ---
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
    const previousSection = document.querySelector('.previous-posts');
    const divider = document.querySelector('.blog-divider');
    if (previousSection) previousSection.style.display = 'none';
    if (divider) divider.style.display = 'none';
  }
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", renderBlogPosts);
