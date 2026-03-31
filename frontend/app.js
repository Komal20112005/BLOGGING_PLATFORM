const API = "http://localhost:5000";

function login() {
  fetch(API + "/auth/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      username: loginUsername.value,
      password: loginPassword.value
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("token", data.token);
    window.location = "dashboard.html";
  });
}

function register() {
  fetch(API + "/auth/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      username: regUsername.value,
      password: regPassword.value
    })
  }).then(() => alert("Registered! Now login."));
}

// Create Post
function createPost() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    return;
  }

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const tags = document.getElementById("tags").value;

  // ✅ Get content from Quill
  const content = quill.root.innerHTML;

  if (!title || !content) {
    alert("Title and content required");
    return;
  }

  fetch("http://localhost:5000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      title,
      content,
      category,
      tags
    })
  })
  .then(res => res.text())
  .then(data => {
  alert("📢 New post published!");

  // Clear fields
  document.getElementById("title").value = "";
  document.getElementById("category").value = "";
  document.getElementById("tags").value = "";
  quill.root.innerHTML = "";

  loadPosts(); // refresh posts
})
  .catch(err => {
    console.error(err);
    alert("❌ Error publishing post");
  });
}
// Load Posts
function loadPosts() {
  fetch(API + "/posts")
  .then(res => res.json())
  .then(data => {
    let html = "";

    data.forEach(p => {
      html += `
   <div class="card mb-3 p-3">
  <h4>${p.title}</h4>
  <p>${p.content}</p>
  <button onclick="deletePost(${p.id})" class="btn btn-sm btn-danger mt-2">Delete</button>
<button onclick="editPost(${p.id}, '${p.title}', '${p.content}')" class="btn btn-sm btn-warning mt-2">Edit</button>
  <small>Category: ${p.category} | Tags: ${p.tags}</small><br>

  <button onclick="likePost(${p.id})" class="btn btn-sm btn-success mt-2">👍 Like</button>

  <hr>
  <input id="comment-input-${p.id}" class="form-control mb-2" placeholder="Write comment">
  <button onclick="addComment(${p.id})" class="btn btn-sm btn-primary">Comment</button>

  <div id="comments-${p.id}" class="mt-2"></div>
</div>
`;

setTimeout(() => loadComments(p.id), 100);
    });

    document.getElementById("posts").innerHTML = html;
  });
}

//search post
async function searchPosts() {
  const query = document.getElementById("searchInput").value;
  const res = await fetch(`http://localhost:5000/api/search?query=${query}`);
  const data = await res.json();
  displayPosts(data);
}

function displayPosts(posts) {
  let html = "";

  posts.forEach(p => {
    html += `
      <div class="card mb-3 p-3">
        <h4>${p.title}</h4>
        <p>${p.content}</p>
      </div>
    `;
  });

  document.getElementById("posts").innerHTML = html;
}

async function generateTags() {
  const content = quill.root.innerText;

  console.log("📤 Sending content:", content); 

  if (!content || content.trim() === "") {
    alert("⚠️ Please write something first!");
    return;
  }

  const res = await fetch("http://localhost:5000/generate-tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content })
  });

  const data = await res.json();

  console.log("📥 Tags received:", data);

  document.getElementById("tags").value = data.tags || "";

  alert("Sentiment: " + data.sentiment);
}


// Like Post
function likePost(id) {
  fetch(API + "/posts/like/" + id, {
    method: "POST",
    headers: {
      "Authorization": localStorage.getItem("token")
    }
  }).then(() => alert("Liked!"));
}

// Load Analytics
function loadAnalytics() {
  fetch("http://localhost:5000/analytics")
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalPosts").innerText = data.totalPosts;
      document.getElementById("totalUsers").innerText = data.totalUsers;
      document.getElementById("totalComments").innerText = data.totalComments;
    })
    .catch(err => {
      console.error("Error loading analytics:", err);
    });
}
// Load comments
function loadComments(postId) {
  fetch(API + "/comments/" + postId)
  .then(res => res.json())
  .then(data => {
    let html = "";
    data.forEach(c => {
      html += `<p>💬 ${c.content}</p>`;
    });
    document.getElementById("comments-" + postId).innerHTML = html;
  });
}

// Add comment
function addComment(postId) {
  const input = document.getElementById("comment-input-" + postId);

  fetch(API + "/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({
      content: input.value,
      post_id: postId
    })
  }).then(() => {
    input.value = "";
    loadComments(postId);
  });
}
function deletePost(id) {
  fetch(API + "/posts/" + id, {
    method: "DELETE",
    headers: {
      "Authorization": localStorage.getItem("token")
    }
  }).then(() => loadPosts());
}

function editPost(id, oldTitle, oldContent) {
  const newTitle = prompt("Edit title", oldTitle);
  const newContent = prompt("Edit content", oldContent);

  fetch(API + "/posts/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({
      title: newTitle,
      content: newContent
    })
  }).then(() => loadPosts());
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

function showLogin() {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  loginBtn.classList.add("active");
  registerBtn.classList.remove("active");
}

function showRegister() {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  registerBtn.classList.add("active");
  loginBtn.classList.remove("active");
}

// Init
if (window.location.pathname.includes("dashboard.html")) {
  loadPosts();
  loadAnalytics();
}

window.onload = function() {
  loadAnalytics();
  // other load functions if any, e.g. loadPosts()
};