// إعداد Firebase
npm install firebase
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const postContainer = document.getElementById('postContainer');

loginBtn.onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

logoutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        postContainer.style.display = 'block';
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        postContainer.style.display = 'none';
    }
});

// نظام النشر
let posts = JSON.parse(localStorage.getItem('posts') || '[]');
displayPosts();

function addPost() {
    const postText = document.getElementById('postInput').value.trim();
    const imageFile = document.getElementById('imageInput').files[0];
    const user = auth.currentUser;
    if (!user) {
        alert('يرجى تسجيل الدخول أولاً.');
        return;
    }
    const post = { text: postText, image: '', likes: 0, userName: user.displayName, userPhoto: user.photoURL };
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            post.image = e.target.result;
            saveAndDisplay(post);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveAndDisplay(post);
    }
    document.getElementById('postInput').value = '';
    document.getElementById('imageInput').value = '';
}

function saveAndDisplay(post) {
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div><img src="${post.userPhoto}" width="30" style="border-radius:50%;"> <strong>${post.userName}</strong></div>
            <div>${post.text}</div>
            ${post.image ? `<img src="${post.image}" alt="صورة مرفقة">` : ''}
            <div class="like-btn" onclick="likePost(${index})">❤️ ${post.likes}</div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function likePost(index) {
    posts[index].likes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}
