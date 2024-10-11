let loggedInUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let isSignup = false;

const authModal = document.getElementById('user_auth');
const signupBtn = document.getElementById('signupBtn'); 
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authForm = document.getElementById('user_form');
const closeModalBtn = document.querySelector('.close_btn');
const postForm = document.getElementById('post_details');
const postsList = document.getElementById('posts');

signupBtn?.addEventListener('click', () => openAuthModal(true)); 
loginBtn?.addEventListener('click', () => openAuthModal(false)); 
logoutBtn?.addEventListener('click', logoutUser);
authForm?.addEventListener('submit', handleAuth);
postForm?.addEventListener('submit', createPost);
closeModalBtn?.addEventListener('click', closeModal);

if (window.location.pathname.endsWith('dashboard.html')) {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        loggedInUser = JSON.parse(storedUser);
    } else {
        window.location.href = 'index.html';
    }
    renderPosts();
}

function openAuthModal(isSignupAction) {
    isSignup = isSignupAction; 
    authModal.style.display = 'flex';
}

function handleAuth(e) {
    e.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (isSignup) {
        if (users.some(user => user.username === username)) {
            alert('User already exists!');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('User registered successfully!');
            closeModal();
        }
    } else {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            loggedInUser = user;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert('Logged in successfully!');
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials!');
        }
    }
}

function logoutUser() {
    loggedInUser = null;
    localStorage.removeItem('loggedInUser'); 
    window.location.href = 'index.html'; 
}

function closeModal() {
    authModal.style.display = 'none';
}

function createPost(e) {
    e.preventDefault(); 
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) {
        alert('Title and content are required!');
        return; 
    }

    const post = {
        id: Date.now(),
        title,
        content,
        author: loggedInUser.username,
        comments: []
    };

    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
    postForm.reset(); 
}

function renderPosts() {
    postsList.innerHTML = ''; 
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>Posted by: ${post.author}</small>
            <div>
                <button onclick="editPost(${post.id})">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
            </div>
            <hr>
            <h4>Comments</h4>
            <div>${renderComments(post.comments)}</div>
            <textarea placeholder="Add a comment"></textarea>
            <button onclick="addComment(${post.id}, this.previousElementSibling.value)">Add Comment</button>
        `;
        postsList.appendChild(postDiv);
    });
}

function renderComments(comments) {
    return comments.map(comment => `<p>${comment}</p>`).join('') || '<p>No comments yet.</p>'; 
}

function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    const newTitle = prompt('Edit title:', post.title);
    const newContent = prompt('Edit content:', post.content);

    if (newTitle && newContent) {
        post.title = newTitle;
        post.content = newContent;
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
    }
}

function deletePost(postId) {
    posts = posts.filter(post => post.id !== postId);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
}

function addComment(postId, comment) {
    if (!comment.trim()) {
        alert('Comment cannot be empty!'); 
        return;
    }
    
    const post = posts.find(p => p.id === postId);
    post.comments.push(comment.trim());
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
}
