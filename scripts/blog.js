// 1. Your Mini-Database
// Always add your newest post to the VERY TOP of this list.
const blogPosts = [
  {
    title: "The Title of My Newest Post",
    date: "February 19, 2026",
    excerpt: "This is a short preview or excerpt of your most recent piece of writing. It catches the reader's attention and makes them want to click to read the rest.",
    link: "posts/one.html"
  },
  {
    title: "My Second Newest Post",
    date: "January 10, 2026",
    excerpt: "A short preview of this older post. Notice how much easier it is to just type text here instead of copying HTML tags!",
    link: "posts/two.html"
  },
  {
    title: "An Older Piece of Writing",
    date: "December 5, 2025",
    excerpt: "Another short preview snippet goes right here...",
    link: "posts/three.html"
  },
  {
    title: "The First Thing I Wrote",
    date: "November 20, 2025",
    excerpt: "Just a brief teaser for the readers...",
    link: "posts/four.html"
  },
  {
    title: "The First Thing I Wrote",
    date: "November 20, 2025",
    excerpt: "Just a brief teaser for the readers...",
    link: "posts/five.html"
  },
  {
    title: "The First Thing I Wrote",
    date: "November 20, 2025",
    excerpt: "Just a brief teaser for the readers...",
    link: "posts/six.html"
  },
  {
    title: "The First Thing I Wrote",
    date: "November 20, 2025",
    excerpt: "Just a brief teaser for the readers...",
    link: "posts/seven.html"
  },
  {
    title: "The First Thing I Wrote",
    date: "November 20, 2025",
    excerpt: "Just a brief teaser for the readers...",
    link: "posts/eight.html"
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
