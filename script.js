// =========================================
// 🔗 API
// =========================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbzAwNOaa7QgC5FfN5rrSgfS7Qv_zSi_2izKd4k65OGzHPnscCN2U84Qy8SuHoJchh5P0w/exec";


// =========================================
// 📌 HTML 요소
// =========================================

const messageInput =
    document.getElementById("message");

const submitButton =
    document.getElementById("submit-button");

const starCount =
    document.getElementById("star-count");

const starsContainer =
    document.getElementById("stars");

const adminButton =
    document.getElementById("admin-button");

const adminPanel =
    document.getElementById("admin-panel");

const adminCode =
    document.getElementById("admin-code");

const adminLogin =
    document.getElementById("admin-login");

const adminClose =
    document.getElementById("admin-close");

const adminMessages =
    document.getElementById("admin-messages");

const adminControls =
    document.getElementById("admin-controls");

const resetStarsButton =
    document.getElementById("reset-stars-button");

const adminStatus =
    document.getElementById("admin-status");


// =========================================
// 🔐 관리자 인증 상태
// =========================================

let verifiedAdminCode = "";


// =========================================
// ⭐ 별 만들기
// =========================================

function createStars(count) {

    starsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {

        const star =
            document.createElement("span");

        star.className = "star";

        star.textContent = "✦";

        star.style.left =
            Math.random() * 96 + 2 + "%";

        if (Math.random() < 0.5) {

            star.style.top =
                Math.random() * 20 + "%";

        } else {

            star.style.top =
                80 + Math.random() * 18 + "%";
        }

        const size =
            4 + Math.random() * 4;

        star.style.fontSize =
            size + "px";

        starsContainer.appendChild(star);
    }
}


// =========================================
// ⭐ 별 개수 불러오기
// =========================================

async function loadStars() {

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        if (!data.success) {

            throw new Error(
                data.message ||
                "별을 불러오지 못했습니다."
            );
        }

        starCount.textContent =
            "⭐ " +
            data.count +
            "개의 마음";

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
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify({
                                message: message
                            })
                    }
                );

            const result =
                await response.json();

            if (result.success) {

                messageInput.value = "";

                alert(
                    "당신의 한마디가 별이 되었어요! ⭐"
                );

                await loadStars();

            } else {

                alert(
                    result.message ||
                    "메시지를 저장하지 못했어요."
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                "메시지를 보내지 못했어요. 다시 시도해주세요."
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "✨ 한마디 남기기";
        }
    }
);


// =========================================
// 🔐 관리자 버튼
// =========================================

adminButton.addEventListener(
    "click",
    function () {

        adminPanel.style.display = "flex";

        adminCode.focus();
    }
);


// =========================================
// ❌ 관리자 창 닫기
// =========================================

adminClose.addEventListener(
    "click",
    function () {

        adminPanel.style.display = "none";

        adminCode.value = "";

        adminMessages.innerHTML = "";

        adminControls.style.display = "none";

        adminStatus.textContent = "";

        verifiedAdminCode = "";
    }
);


// =========================================
// 🗑️ 메시지 하나 삭제
// =========================================

async function deleteMessage(row) {

    if (verifiedAdminCode === "") {

        alert(
            "먼저 관리자 인증을 해주세요."
        );

        return;
    }

    const confirmed =
        confirm(
            "이 메시지를 삭제할까요?\n\n삭제하면 되돌릴 수 없습니다."
        );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "deleteMessage",

                            code:
                                verifiedAdminCode,

                            row:
                                row
                        })
                }
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message ||
                "메시지를 삭제하지 못했습니다."
            );

            return;
        }


        alert(
            "🗑️ 메시지가 삭제되었습니다."
        );


        await loadStars();


        // 관리자 메시지 다시 불러오기

        await loadAdminMessages();


    } catch (error) {

        console.error(error);

        alert(
            "메시지를 삭제하지 못했습니다."
        );
    }
}


// =========================================
// 💌 관리자 메시지 표시
// =========================================

function displayMessages(messages) {

    adminMessages.innerHTML =
        "<h3>💌 모인 한마디</h3>";


    if (
        !messages ||
        messages.length === 0
    ) {

        adminMessages.innerHTML +=
            "<p>아직 메시지가 없습니다.</p>";

        return;
    }


    messages.forEach(
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


            if (item.date) {

                const date =
                    document.createElement("small");

                date.textContent =
                    item.date;

                date.className =
                    "message-date";

                messageBox.appendChild(date);
            }


            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "🗑️ 삭제";

            deleteButton.className =
                "delete-message-button";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteMessage(
                        item.row
                    );

                }
            );


            messageBox.appendChild(title);

            messageBox.appendChild(message);

            messageBox.appendChild(
                deleteButton
            );


            adminMessages.appendChild(
                messageBox
            );
        }
    );
}


// =========================================
// 🔄 관리자 메시지 다시 불러오기
// =========================================

async function loadAdminMessages() {

    try {

        const response =
            await fetch(
                API_URL +
                "?code=" +
                encodeURIComponent(
                    verifiedAdminCode
                )
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                "관리자 정보를 불러오지 못했습니다."
            );

            return;
        }


        displayMessages(
            data.messages
        );


    } catch (error) {

        console.error(error);

        alert(
            "관리자 정보를 불러오지 못했습니다."
        );
    }
}


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


            if (!data.success) {

                alert(
                    "관리자 코드가 올바르지 않습니다."
                );

                return;
            }


            // 관리자 인증 성공

            verifiedAdminCode =
                code;


            adminControls.style.display =
                "block";


            adminStatus.textContent =
                "관리자 인증 완료";


            displayMessages(
                data.messages
            );


        } catch (error) {

            console.error(error);

            alert(
                "관리자 정보를 불러오지 못했습니다."
            );

        } finally {

            adminLogin.disabled = false;

            adminLogin.textContent =
                "확인";
        }
    }
);


// =========================================
// ⭐ 별 초기화
// =========================================

resetStarsButton.addEventListener(
    "click",
    async function () {

        if (
            verifiedAdminCode === ""
        ) {

            alert(
                "먼저 관리자 인증을 해주세요."
            );

            return;
        }


        const confirmed =
            confirm(
                "정말 모든 별을 초기화할까요?\n\n기존 메시지는 삭제되지 않습니다."
            );


        if (!confirmed) {
            return;
        }


        resetStarsButton.disabled = true;

        resetStarsButton.textContent =
            "⭐ 초기화 중...";


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify({

                                action:
                                    "resetStars",

                                code:
                                    verifiedAdminCode

                            })
                    }
                );


            const result =
                await response.json();


            if (!result.success) {

                alert(
                    result.message ||
                    "별을 초기화하지 못했습니다."
                );

                return;
            }


            alert(
                "⭐ 별이 모두 초기화되었습니다!"
            );


            await loadStars();


            adminStatus.textContent =
                "⭐ 별 초기화 완료";


        } catch (error) {

            console.error(error);

            alert(
                "별을 초기화하지 못했습니다."
            );

        } finally {

            resetStarsButton.disabled = false;

            resetStarsButton.textContent =
                "⭐ 별 초기화";
        }
    }
);


// =========================================
// 🌌 사이트 시작
// =========================================

loadStars();
