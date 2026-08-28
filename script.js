const API_URL =
    "https://script.google.com/macros/s/AKfycbzAwNOaa7QgC5FfN5rrSgfS7Qv_zSi_2izKd4k65OGzHPnscCN2U84Qy8SuHoJchh5P0w/exec";

const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const starCount = document.getElementById("star-count");
const starsContainer = document.getElementById("stars");


// ⭐ 별 만들기
function createStars(count) {
    starsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const star = document.createElement("span");

        star.className = "star";
        star.textContent = "✦";

        // 화면 전체가 아니라 별 영역 안에서 랜덤 배치
        star.style.left = Math.random() * 96 + "%";
        star.style.top = Math.random() * 90 + "%";

        // 작은 별
        const size = 7 + Math.random() * 8;
        star.style.fontSize = size + "px";

        starsContainer.appendChild(star);
    }
}


// ⭐ Google Sheets에서 현재 별 개수 가져오기
async function loadStars() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        starCount.textContent =
            "⭐ " + data.count + "개의 마음";

        createStars(data.count);

    } catch (error) {
        console.error("별 개수를 불러오지 못했습니다.", error);
    }
}


// 💌 한마디 보내기
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

            // 최신 별 개수 다시 가져오기
            await loadStars();

        } else {
            alert("메시지를 저장하지 못했어요.");
        }

    } catch (error) {

        console.error(error);
        alert("메시지를 보내지 못했어요. 다시 시도해주세요.");

    }

    submitButton.disabled = false;
    submitButton.textContent = "✨ 한마디 남기기";
});


// 🌌 사이트를 열자마자 기존 별 불러오기
loadStars();
