```javascript
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

// ⭐ 관리자 기능
const adminControls = document.getElementById("admin-controls");
const resetStarsButton = document.getElementById("reset-stars-button");
const adminStatus = document.getElementById("admin-status");

// 현재 관리자 코드 저장
// 로그인 후 별 초기화 요청에 사용
let verifiedAdminCode = "";


// =========================================
// ⭐ 별 만들기
// =========================================

function createStars(count) {

    starsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {

        const star = document.createElement("span");

        star.className = "star";
        star.textContent = "✦";


        // ⭐ 화면 좌우 위치
        star.style.left =
            Math.random() * 96 + 2 + "%";


        // ⭐ 글자가 있는 가운데 영역을 피하기
        // 위쪽 20% 또는 아래쪽 20%에만 생성

        if (Math.random() < 0.5) {

            star.style.top =
                Math.random() * 20 + "%";

        } else {

            star.style.top =
                80 + Math.random() * 18 + "%";
        }


        // ⭐ 아주 작은 별
        // 4~8px

        const size =
            4 + Math.random() * 4;

        star.style.fontSize =
            size + "px";


        starsContainer.appendChild(star);
    }
}


// =========================================
// ⭐ Google Sheets에서 별 개수 가져오기
// =========================================

async function loadStars() {

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();


        starCount.textContent =
            "⭐ " + data.count + "개의 마음";


        createStars(data.count);


    } catch (error) {

        console.error(
            "별을 불러오지 못했습니다.",
            error
        );
    }
}


// =========================================
// 💌 한마디 남기기
// =========================================

submitButton.addEventListener(
    "click",
    async function () {

        const message =
            messageInput.value.trim();


        // 빈 메시지 방지

        if (message === "") {

            alert(
                "한마디를 입력해주세요!"
            );

            return;
        }


        submitButton.disabled = true;

        submitButton.textContent =
            "✨ 보내는 중...";


        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({
                        message: message
                    })

                });


            const result =
                await response.json();


            if (result.success) {

                // 입력창 비우기

                messageInput.value = "";


                alert(
                    "당신의 한마디가 별이 되었어요! ⭐"
                );


                // ⭐ 최신 별 개수 다시 불러오기

                await loadStars();


            } else {

                alert(
                    "메시지를 저장하지 못했어요."
                );
            }


        } catch (error) {

            console.error(error);

            alert(
                "메시지를 보내지 못했어요. 다시 시도해주세요."
            );
        }


        submitButton.disabled = false;

        submitButton.textContent =
            "✨ 한마디 남기기";

    }
);


// =========================================
// 🔐 관리자 버튼
// =========================================

adminButton.addEventListener(
    "click",
    function () {

        adminPanel.style.display =
            "flex";

        adminCode.focus();

    }
);


// =========================================
// ❌ 관리자 창 닫기
// =========================================

adminClose.addEventListener(
    "click",
    function () {

        adminPanel.style.display =
            "none";

        adminCode.value = "";

        adminMessages.innerHTML = "";

        // ⭐ 관리자 기능 숨기기
        adminControls.style.display =
            "none";

        adminStatus.textContent = "";

        // 🔐 관리자 인증 정보 삭제
        verifiedAdminCode = "";

    }
);


// =========================================
// 🔐 관리자 로그인
// =========================================

adminLogin.addEventListener(
    "click",
    async function () {

        const code =
            adminCode.value.trim();


        if (code === "") {

            alert(
                "관리자 코드를 입력해주세요."
            );

            return;
        }


        adminLogin.disabled = true;

        adminLogin.textContent =
            "확인 중...";


        try {

            const response =
                await fetch(
                    API_URL +
                    "?code=" +
                    encodeURIComponent(code)
                );


            const data =
                await response.json();


            // ❌ 잘못된 코드

            if (!data.success) {

                alert(
                    "관리자 코드가 올바르지 않습니다."
                );

                return;
            }


            // ✅ 관리자 코드 저장
            // 별 초기화 요청을 할 때 사용

            verifiedAdminCode = code;


            // ⭐ 관리자 기능 표시

            adminControls.style.display =
                "block";


            adminStatus.textContent =
                "관리자 인증 완료";


            // ✅ 관리자 메시지 표시

            adminMessages.innerHTML =
                "<h3>💌 모인 한마디</h3>";


            if (
                !data.messages ||
                data.messages.length === 0
            ) {

                adminMessages.innerHTML +=
                    "<p>아직 메시지가 없습니다.</p>";

            } else {

                // 메시지 하나씩 표시

                data.messages.forEach(
                    function (item, index) {

                        const messageBox =
                            document.createElement("div");


                        messageBox.className =
                            "message-box";


                        const title =
                            document.createElement("strong");


                        title.textContent =
                            (index + 1) +
                            "번째 마음";


                        const message =
                            document.createElement("p");


                        message.textContent =
                            item.message;


                        messageBox.appendChild(title);

                        messageBox.appendChild(message);

                        adminMessages.appendChild(
                            messageBox
                        );

                    }
                );
            }


        } catch (error) {

            console.error(error);

            alert(
                "관리자 정보를 불러오지 못했습니다."
            );

        }


        adminLogin.disabled = false;

        adminLogin.textContent =
            "확인";

    }
);


// =========================================
// ⭐ 관리자 전용 별 초기화
// =========================================

resetStarsButton.addEventListener(
    "click",
    async function () {

        // 🔐 관리자 인증 확인

        if (verifiedAdminCode === "") {

            alert(
                "먼저 관리자 인증을 해주세요."
            );

            return;
        }


        // ⚠️ 실수 방지

        const confirmed =
            confirm(
                "정말 모든 별을 초기화할까요?\n\n현재 별 개수가 0개가 됩니다."
            );


        if (!confirmed) {
            return;
        }


        resetStarsButton.disabled = true;

        resetStarsButton.textContent =
            "⭐ 초기화 중...";


        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action: "resetStars",

                        code: verifiedAdminCode

                    })

                });


            const result =
                await response.json();


            // ❌ 초기화 실패

            if (!result.success) {

                alert(
                    result.message ||
                    "별을 초기화하지 못했습니다."
                );

                return;
            }


            // ✅ 초기화 성공

            alert(
                "⭐ 별이 모두 초기화되었습니다!"
            );


            // 최신 별 개수 다시 불러오기

            await loadStars();


            // 관리자 메시지도 다시 불러오기

            adminMessages.innerHTML =
                "<h3>💌 모인 한마디</h3>" +
                "<p>아직 메시지가 없습니다.</p>";


            adminStatus.textContent =
                "⭐ 별 초기화 완료";


        } catch (error) {

            console.error(error);

            alert(
                "별을 초기화하지 못했습니다. 다시 시도해주세요."
            );

        }


        resetStarsButton.disabled = false;

        resetStarsButton.textContent =
            "⭐ 별 초기화";

    }
);


// =========================================
// 🌌 사이트를 열면 별 불러오기
// =========================================

loadStars();
```

