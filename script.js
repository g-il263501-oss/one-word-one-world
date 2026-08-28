const API_URL =
    "https://script.google.com/macros/s/AKfycbzAwNOaa7QgC5FfN5rrSgfS7Qv_zSi_2izKd4k65OGzHPnscCN2U84Qy8SuHoJchh5P0w/exec";


const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const starCount = document.getElementById("star-count");
const starsContainer = document.getElementById("stars");

const adminButton = document.getElementById("admin-button");
const adminPanel = document.getElementById("admin-panel");
const adminCode = document.getElementById("admin-code");
const adminLogin = document.getElementById("admin-login");
const adminClose = document.getElementById("admin-close");
const adminMessages = document.getElementById("admin-messages");


// ⭐ 별 만들기

function createStars(count) {

    starsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {

        const star = document.createElement("span");

        star.className = "star";
        star.textContent = "✦";

        star.style.left = Math.random() * 96 + "%";
        star.style.top = Math.random() * 90 + "%";

        const size = 7 + Math.random() * 8;

        star.style.fontSize = size + "px";

        starsContainer.appendChild(star);
    }
}


// ⭐ 별 개수 불러오기

async function loadStars() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        starCount.textContent =
            "⭐ " + data.count + "개의 마음";

        createStars(data.count);

    } catch (error) {

        console.error(error);

    }
}


// 💌 메시지 보내기

submitButton.addEventListener("click", async function () {

    const message = messageInput.value.trim();

    if (message === "") {

        alert("한마디를 입력해주세요!");

        return;
    }


    submitButton.disabled = true;

    submitButton.textContent = "✨ 보내는 중...";


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const result = await response.json();


        if (result.success) {

            messageInput.value = "";

            alert("당신의 한마디가 별이 되었어요! ⭐");

            await loadStars();

        } else {

            alert("메시지를 저장하지 못했어요.");

        }


    } catch (error) {

        console.error(error);

        alert("메시지를 보내지 못했어요.");

    }


    submitButton.disabled = false;

    submitButton.textContent =
        "✨ 한마디 남기기";

});


// 🔐 관리자 버튼

adminButton.addEventListener("click", function () {

    adminPanel.style.display = "flex";

    adminCode.focus();

});


// ❌ 관리자 창 닫기

adminClose.addEventListener("click", function () {

    adminPanel.style.display = "none";

    adminCode.value = "";

    adminMessages.innerHTML = "";

});


// 🔐 관리자 로그인

adminLogin.addEventListener("click", async function () {

    const code = adminCode.value.trim();

    if (code === "") {

        alert("관리자 코드를 입력해주세요.");

        return;
    }


    adminLogin.disabled = true;

    adminLogin.textContent = "확인 중...";


    try {

        const response = await fetch(
            API_URL + "?code=" + encodeURIComponent(code)
        );

        const data = await response.json();


        if (!data.success) {

            alert("관리자 코드가 올바르지 않습니다.");

            return;
        }


        adminMessages.innerHTML =
            "<h3>💌 모인 한마디</h3>";


        if (data.messages.length === 0) {

            adminMessages.innerHTML +=
                "<p>아직 메시지가 없습니다.</p>";

            return;
        }


        data.messages.forEach(function (item, index) {

            const messageBox =
                document.createElement("div");

            messageBox.className =
                "message-box";


            messageBox.innerHTML =
                "<strong>" +
                (index + 1) +
                "번째 마음</strong>" +
                "<p>" +
                escapeHTML(item.message) +
                "</p>";


            adminMessages.appendChild(messageBox);

        });


    } catch (error) {

        console.error(error);

        alert("관리자 정보를 불러오지 못했습니다.");

    }


    adminLogin.disabled = false;

    adminLogin.textContent = "확인";

});


// 🔒 관리자 메시지에 HTML 코드가 들어가는 것을 방지

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// 🌌 처음 사이트에 들어왔을 때

loadStars();
