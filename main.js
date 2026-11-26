/* =================================
   STORAGE
================================= */

const STORAGE = {

    account: "afterdark_account",
    confessions: "afterdark_confessions",
    comments: "afterdark_comments",
    likes: "afterdark_likes",
    theme: "afterdark_theme"

};


function getData(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        return value ? JSON.parse(value) : fallback;

    } catch (e) {

        return fallback;

    }

}


function saveData(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

}


/* =================================
   ACCOUNT
================================= */

function createAccount() {

    let account = getData(STORAGE.account, null);

    if (!account) {

        const randomId =

            "AD-" +

            Math.random().toString(36).substring(2, 7).toUpperCase() +

            "-" +

            Date.now().toString(36).toUpperCase();


        account = {
            id: randomId,
            created: new Date().toISOString()
        };


        saveData(STORAGE.account, account);

    }

    return account;

}


const account = createAccount();


document.getElementById("accountId").textContent = account.id;

document.getElementById("drawerUserId").textContent =
    account.id;


/* =================================
   TOAST
================================= */

let toastTimer;


function toast(message) {

    const element = document.getElementById("toast");

    element.textContent = message;

    element.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        element.classList.remove("show");

    }, 2500);

}


/* =================================
   DRAWER
================================= */

const drawer = document.getElementById("drawer");

const overlay = document.getElementById("drawerOverlay");


function openDrawer() {

    drawer.classList.add("open");

    overlay.classList.add("show");

    document.body.classList.add("drawer-open");

}


function closeDrawer() {

    drawer.classList.remove("open");

    overlay.classList.remove("show");

    document.body.classList.remove("drawer-open");

}


document.getElementById("menuBtn").addEventListener(
    "click",
    openDrawer
);


document.getElementById("closeDrawer").addEventListener(
    "click",
    closeDrawer
);


overlay.addEventListener("click", closeDrawer);


document.addEventListener("keydown", function(e) {

    if (e.key === "Escape") {

        closeDrawer();

    }

});


/* =================================
   PAGE NAVIGATION
================================= */

const pages = [

    "home",
    "confessions",
    "detail",
    "write",
    "chat",
    "account",
    "settings"

];


let currentPage = "home";

let currentConfessionId = null;

let previousPage = "confessions";


function showPage(name) {

    if (!pages.includes(name)) {
        name = "home";
    }


    if (name === "write" && previousPage !== "confessions") {

        toast("برای نوشتن اعتراف ابتدا وارد صفحه اعترافات شو.");

        name = "confessions";

    }


    currentPage = name;


    pages.forEach(page => {

        const element = document.getElementById("page-" + page);

        if (element) {

            element.classList.toggle(
                "active",
                page === name
            );

        }

    });


    document.querySelectorAll(".drawer-link").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === name
        );

    });


    closeDrawer();

    window.scrollTo(0, 0);


    if (name === "confessions") {

        renderConfessions();

    }

    if (name === "detail") {

        renderDetail();

    }

}


document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        const target = button.dataset.page;

        if (target === "detail" || target === "write") {
            return;
        }

        showPage(target);

    });

});


/* =================================
   CONFESSION DATA
================================= */

let confessions = getData(STORAGE.confessions, []);


if (confessions.length === 0) {

    confessions = [

        {
            id: 1,
            title: "چیزی که هیچ‌وقت نگفتم",
            text: "مدت‌هاست حرفی در دلم مانده که هیچ‌وقت نتوانستم به کسی بگویم. همیشه فکر می‌کردم اگر آن را بیان کنم، همه چیز تغییر خواهد کرد. شاید گفتنش اینجا کمی از سنگینی آن کم کند.",
            category: "life",
            date: new Date().toISOString(),
            likes: 12
        },


        {
            id: 2,
            title: "یک راز قدیمی",
            text: "گاهی آدم‌ها چیزی را درون خودشان نگه می‌دارند، نه به این دلیل که نمی‌خواهند بگویند، بلکه چون نمی‌دانند چطور باید شروع کنند.",
            category: "secret",
            date: new Date().toISOString(),
            likes: 8
        },


        {
            id: 3,
            title: "حرفی درباره عشق",
            text: "گاهی هنوز کسی را به یاد می‌آوری که دیگر هیچ نقشی در زندگی‌ات ندارد. شاید عجیب باشد، اما بعضی خاطرات به این راحتی از ذهن پاک نمی‌شوند.",
            category: "love",
            date: new Date().toISOString(),
            likes: 21
        }

    ];

    saveData(STORAGE.confessions, confessions);

}


/* =================================
   CATEGORY
================================= */

const categoryNames = {

    life: "زندگی",
    love: "عشق",
    secret: "رازها",
    other: "متفرقه"

};


let activeFilter = "all";


document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn").forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");

        activeFilter = button.dataset.filter;

        renderConfessions();

    });

});


/* =================================
   CONFESSION LIST
================================= */

function renderConfessions() {

    const list = document.getElementById("confessionList");

    const empty = document.getElementById("emptyConfessions");

    list.innerHTML = "";


    let filtered = confessions.filter(item => {

        return activeFilter === "all" ||
            item.category === activeFilter;

    });


    empty.classList.toggle(
        "hidden",
        filtered.length !== 0
    );


    filtered.forEach(item => {

        const card = document.createElement("article");

        card.className = "confession-card";


        const meta = document.createElement("div");

        meta.className = "card-meta";


        const user = document.createElement("div");

        user.className = "card-user";


        const avatar = document.createElement("div");

        avatar.className = "avatar small-avatar";

        avatar.textContent = "?";


        const userInfo = document.createElement("div");


        const username = document.createElement("strong");

        username.textContent = "کاربر ناشناس";


        const date = document.createElement("small");

        date.textContent = formatDate(item.date);


        userInfo.appendChild(username);

        userInfo.appendChild(date);


        user.appendChild(avatar);

        user.appendChild(userInfo);


        const category = document.createElement("span");

        category.className = "category-tag";

        category.textContent = categoryNames[item.category] || "متفرقه";


        meta.appendChild(user);

        meta.appendChild(category);


        const title = document.createElement("h3");

        title.textContent = item.title;


        const preview = document.createElement("p");

        preview.className = "confession-preview";

        preview.textContent = item.text;


        const footer = document.createElement("div");

        footer.className = "card-footer";


        const likes = document.createElement("span");

        likes.textContent = "♡ " + getLikeCount(item);


        const comments = getComments(item.id);


        const commentsCount = document.createElement("span");

        commentsCount.textContent = "▤ " + comments.length + " نظر";


        footer.appendChild(likes);

        footer.appendChild(commentsCount);


        card.appendChild(meta);

        card.appendChild(title);

        card.appendChild(preview);

        card.appendChild(footer);


        card.addEventListener("click", () => {

            currentConfessionId = item.id;

            showPage("detail");

        });


        list.appendChild(card);

    });

}


function formatDate(value) {

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return "بدون تاریخ";
    }

    return date.toLocaleDateString("fa-IR");

}


/* =================================
   COMMENTS
================================= */

let commentsData = getData(STORAGE.comments, {});


function getComments(id) {

    return commentsData[id] || [];

}


function saveComment(id, text) {

    if (!commentsData[id]) {
        commentsData[id] = [];
    }


    commentsData[id].push({

        id: Date.now(),

        text: text,

        date: new Date().toISOString(),

        user: account.id

    });


    saveData(STORAGE.comments, commentsData);

}


/* =================================
   DETAIL PAGE
================================= */

function renderDetail() {

    const item = confessions.find(
        confession => confession.id === currentConfessionId
    );


    if (!item) {

        showPage("confessions");

        return;

    }


    document.getElementById("detailTitle").textContent =
        item.title;


    document.getElementById("detailText").textContent =
        item.text;


    document.getElementById("detailDate").textContent =
        formatDate(item.date);


    document.getElementById("detailCategory").textContent =
        categoryNames[item.category] || "متفرقه";


    document.getElementById("detailLikes").textContent =
        getLikeCount(item);


    const liked = getData(STORAGE.likes, []);

    document.getElementById("detailLike").classList.toggle(
        "liked",
        liked.includes(item.id)
    );


    const comments = getComments(item.id);


    document.getElementById("detailCommentsCount").textContent =
        comments.length + " نظر";


    renderComments(item.id);

}


function renderComments(id) {

    const list = document.getElementById("commentList");

    list.innerHTML = "";


    const comments = getComments(id);


    if (comments.length === 0) {

        const empty = document.createElement("div");

        empty.className = "empty-state";

        empty.innerHTML = `
            <div class="empty-icon">◌</div>
            <h3>هنوز نظری ثبت نشده</h3>
            <p>اولین نفری باش که نظر می‌دهد.</p>
        `;

        list.appendChild(empty);

        return;

    }


    comments.forEach(comment => {

        const card = document.createElement("div");

        card.className = "comment-card";


        const username = document.createElement("strong");

        username.textContent = "کاربر ناشناس";


        const text = document.createElement("p");

        text.textContent = comment.text;


        card.appendChild(username);

        card.appendChild(text);


        list.appendChild(card);

    });

}


/* =================================
   LIKE SYSTEM
================================= */

function getLikeCount(item) {

    const liked = getData(STORAGE.likes, []);

    return item.likes + (liked.includes(item.id) ? 1 : 0);

}


document.getElementById("detailLike").addEventListener(
    "click",
    function() {

        const item = confessions.find(
            confession => confession.id === currentConfessionId
        );


        if (!item) return;


        let liked = getData(STORAGE.likes, []);


        if (liked.includes(item.id)) {

            liked = liked.filter(id => id !== item.id);

            toast("پسندیدن برداشته شد.");

        } else {

            liked.push(item.id);

            toast("اعتراف پسندیده شد.");

        }


        saveData(STORAGE.likes, liked);

        renderDetail();

    }
);


/* =================================
   COMMENT FORM
================================= */

document.getElementById("commentForm").addEventListener(
    "submit",
    function(e) {

        e.preventDefault();


        const input = document.getElementById("commentInput");

        const text = input.value.trim();


        if (!text) return;


        if (!currentConfessionId) return;


        saveComment(currentConfessionId, text);


        input.value = "";


        renderDetail();

        toast("نظر ثبت شد.");

    }
);


/* =================================
   OPEN WRITE PAGE
================================= */

document.getElementById("openWritePage").addEventListener(
    "click",
    function() {

        previousPage = "confessions";

        showPage("write");

    }
);


document.getElementById("backFromWrite").addEventListener(
    "click",
    function() {

        showPage("confessions");

    }
);


document.getElementById("backToConfessions").addEventListener(
    "click",
    function() {

        showPage("confessions");

    }
);


/* =================================
   WRITE FORM
================================= */

const confessionText =
    document.getElementById("confessionText");


confessionText.addEventListener("input", function() {

    document.getElementById("textCounter").textContent =

        this.value.length + " / ۳۰۰۰";

});


document.getElementById("writeForm").addEventListener(
    "submit",
    function(e) {

        e.preventDefault();


        if (currentPage !== "write" || previousPage !== "confessions") {

            toast("دسترسی غیرمجاز.");

            showPage("confessions");

            return;

        }


        const title = document.getElementById("confessionTitle")
            .value.trim();


        const text = confessionText.value.trim();


        const category = document.getElementById("confessionCategory")
            .value;


        if (!title || !text) {

            toast("لطفاً عنوان و متن را وارد کن.");

            return;

        }


        const item = {

            id: Date.now(),

            title: title,

            text: text,

            category: category,

            date: new Date().toISOString(),

            likes: 0

        };


        confessions.unshift(item);


        saveData(STORAGE.confessions, confessions);


        this.reset();

        document.getElementById("textCounter").textContent =
            "۰ / ۳۰۰۰";


        activeFilter = "all";


        document.querySelectorAll(".filter-btn").forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === "all"
            );

        });


        toast("اعتراف در نسخه آزمایشی ثبت شد.");

        showPage("confessions");

    }
);


/* =================================
   CHAT DEMO
================================= */

document.getElementById("chatForm").addEventListener(
    "submit",
    function(e) {

        e.preventDefault();


        const input = document.getElementById("chatInput");

        const text = input.value.trim();


        if (!text) return;


        const messages = document.getElementById("chatMessages");


        const placeholder = messages.querySelector(".chat-placeholder");

        if (placeholder) {
            placeholder.remove();
        }


        const message = document.createElement("div");

        message.className = "chat-message mine";

        message.textContent = text;


        messages.appendChild(message);


        input.value = "";


        messages.scrollTop = messages.scrollHeight;

    }
);


/* =================================
   COPY ACCOUNT ID
================================= */

document.getElementById("copyAccountId").addEventListener(
    "click",
    async function() {

        try {

            await navigator.clipboard.writeText(account.id);

            toast("شناسه کپی شد.");

        } catch (e) {

            toast("امکان کپی خودکار وجود ندارد.");

        }

    }
);


/* =================================
   THEME
================================= */

const darkSwitch = document.getElementById("darkModeSwitch");


let savedTheme = localStorage.getItem(STORAGE.theme);


if (savedTheme === "light") {

    document.body.classList.add("light-theme");

    darkSwitch.checked = false;

}


darkSwitch.addEventListener("change", function() {

    if (this.checked) {

        document.body.classList.remove("light-theme");

        localStorage.setItem(STORAGE.theme, "dark");

    } else {

        document.body.classList.add("light-theme");

        localStorage.setItem(STORAGE.theme, "light");

    }

});


/* =================================
   INITIALIZE
================================= */

renderConfessions();

showPage("home");
