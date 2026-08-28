// =========================================
// 🌌 한마디가 별이 되어 닿기를
// =========================================


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

const adminSearch =
    document.getElementById("admin-search");

const messageSearch =
    document.getElementById("message-search");

const resetStarsButton =
    document.getElementById("reset-stars-button");

const adminStatus =
    document.getElementById("admin-status");

const currentStarStat =
    document.getElementById("current-star-stat");

const totalMessageStat =
    document.getElementById("total-message-stat");

const todayMessageStat =
    document.getElementById("today-message-stat");


// =========================================
// 🔐 관리자 인증 상태
// =========================================

let verifiedAdminCode = "";

let adminMessageData = [];

let currentStarTotal = 0;


// =========================================
// ⭐ 별 만들기
// =========================================

function createStars(
    count,
    newStar = false
) {

    starsContainer.innerHTML = "";

    currentStarTotal = count;


    // =====================================
    // 🌌 배경 밝기
    // =====================================

    // 0~100개까지 조금씩 밝아짐
    // 100개 이상부터는 최대 밝기 고정

    const brightnessLevel =
        Math.min(
            count / 100,
            1
        );


    document.documentElement.style.setProperty(
        "--star-brightness",
        brightnessLevel
    );


    // =====================================
    // ⭐ 별 생성
    // =====================================

    for (
        let i = 0;
        i < count;
        i++
    ) {

        createSingleStar(
            i === count - 1 &&
            newStar
        );

    }


    // =====================================
    // 🌌 별자리
    // =====================================

    createConstellation(
        count
    );

}


// =========================================
// ⭐ 별 하나 만들기
// =========================================

function createSingleStar(
    isNewStar = false
) {

    const star =
        document.createElement(
            "span"
        );


    star.className =
        "star";


    star.textContent =
        "✦";


    // 위치

    star.style.left =
        Math.random() * 96 + 2 + "%";


    if (
        Math.random() < 0.5
    ) {

        star.style.top =
            Math.random() * 20 + "%";

    } else {

        star.style.top =
            80 +
            Math.random() * 18 +
            "%";

    }


    // 크기

    const size =
        4 +
        Math.random() * 5;


    star.style.fontSize =
        size + "px";


    // 밝기

    const opacity =
        0.45 +
        Math.random() * 0.55;


    star.style.setProperty(
        "--star-opacity",
        opacity
    );


    // 반짝임 속도

    const speed =
        1.5 +
        Math.random() * 3;


    star.style.setProperty(
        "--twinkle-speed",
        speed + "s"
    );


    // 새로 생긴 별

    if (
        isNewStar
    ) {

        star.classList.add(
            "new-star"
        );

    }


    starsContainer.appendChild(
        star
    );

}


// =========================================
// 🌌 별자리
// =========================================

function createConstellation(
    count
) {

    if (
        count < 5
    ) {

        return;

    }


    const stars =
        Array.from(
            starsContainer.querySelectorAll(
                ".star"
            )
        );


    if (
        stars.length < 5
    ) {

        return;

    }


    // 별자리에는 최대 12개의 별만 사용

    const constellationStars =
        stars.slice(
            0,
            Math.min(
                12,
                stars.length
            )
        );


    // 별자리 선은 최대 10개

    const maxLines =
        10;


    const lineCount =
        Math.min(
            constellationStars.length - 1,
            maxLines
        );


    for (
        let i = 0;
        i < lineCount;
        i++
    ) {

        const first =
            constellationStars[i];

        const second =
            constellationStars[i + 1];


        const x1 =
            first.offsetLeft;

        const y1 =
            first.offsetTop;

        const x2 =
            second.offsetLeft;

        const y2 =
            second.offsetTop;


        const distance =
            Math.sqrt(
                Math.pow(
                    x2 - x1,
                    2
                ) +
                Math.pow(
                    y2 - y1,
                    2
                )
            );


        // 너무 멀리 있는 별은 연결하지 않음

        if (
            distance > 280
        ) {

            continue;

        }


        const angle =
            Math.atan2(
                y2 - y1,
                x2 - x1
            ) *
            180 /
            Math.PI;


        const line =
            document.createElement(
                "div"
            );


        line.className =
            "constellation-line";


        line.style.width =
            distance + "px";


        line.style.left =
            x1 + "px";


        line.style.top =
            y1 + "px";


        line.style.transform =
            "rotate(" +
            angle +
            "deg)";


        starsContainer.appendChild(
            line
        );

    }

}


// =========================================
// ⭐ 별 개수 불러오기
// =========================================

async function loadStars(
    animate = false
) {

    try {

        const response =
            await fetch(
                API_URL
            );


        const data =
            await response.json();


        if (
            !data.success
        ) {

            throw new Error(
                data.message ||
                "별을 불러오지 못했습니다."
            );

        }


        starCount.textContent =
            "⭐ " +
            data.count +
            "개의 마음";


        createStars(
            Number(data.count),
            animate
        );


    } catch (error) {

        console.error(
            "별을 불러오지 못했습니다.",
            error
        );

    }

}


// =========================================
// 💌 전송 완료 문구
// =========================================

function showSendMessage() {

    const oldMessage =
        document.getElementById(
            "send-message"
        );


    if (
        oldMessage
    ) {

        oldMessage.remove();

    }


    const message =
        document.createElement(
            "div"
        );


    message.id =
        "send-message";


    message.textContent =
        "당신의 마음이 별이 되었어요. ✨";


    document.body.appendChild(
        message
    );


    setTimeout(
        function () {

            message.remove();

        },
        2600
    );

}


// =========================================
// 💌 한마디 남기기
// =========================================

submitButton.addEventListener(
    "click",
    async function () {

        const message =
            messageInput.value.trim();


        if (
            message === ""
        ) {

            alert(
                "한마디를 입력해주세요!"
            );

            return;

        }


        submitButton.disabled =
            true;


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

                                message:
                                    message

                            })

                    }
                );


            const result =
                await response.json();


            if (
                !result.success
            ) {

                alert(
                    result.message ||
                    "메시지를 저장하지 못했어요."
                );

                return;

            }


            messageInput.value =
                "";


            showSendMessage();


            await loadStars(
                true
            );


        } catch (error) {

            console.error(
                error
            );


            alert(
                "메시지를 보내지 못했어요. 다시 시도해주세요."
            );

        } finally {

            submitButton.disabled =
                false;


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


        adminCode.value =
            "";


        adminMessages.innerHTML =
            "";


        adminControls.style.display =
            "none";


        adminSearch.style.display =
            "none";


        adminStatus.textContent =
            "";


        messageSearch.value =
            "";


        verifiedAdminCode =
            "";


        adminMessageData =
            [];

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


        if (
            code === ""
        ) {

            alert(
                "관리자 코드를 입력해주세요."
            );

            return;

        }


        adminLogin.disabled =
            true;


        adminLogin.textContent =
            "확인 중...";


        try {

            const response =
                await fetch(
                    API_URL +
                    "?code=" +
                    encodeURIComponent(
                        code
                    )
                );


            const data =
                await response.json();


            if (
                !data.success
            ) {

                alert(
                    data.message ||
                    "관리자 코드가 올바르지 않습니다."
                );

                return;

            }


            verifiedAdminCode =
                code;


            adminMessageData =
                data.messages || [];


            adminControls.style.display =
                "block";


            adminSearch.style.display =
                "block";


            adminStatus.textContent =
                "관리자 인증 완료";


            updateAdminStats(
                adminMessageData
            );


            renderMessages(
                adminMessageData
            );


        } catch (error) {

            console.error(
                error
            );


            alert(
                "관리자 정보를 불러오지 못했습니다."
            );

        } finally {

            adminLogin.disabled =
                false;


            adminLogin.textContent =
                "확인";

        }

    }
);


// =========================================
// 📊 관리자 통계
// =========================================

function updateAdminStats(
    messages
) {

    const total =
        messages.length;


    const today =
        new Date();


    const todayString =
        today.toDateString();


    const todayCount =
        messages.filter(
            function (item) {

                if (
                    !item.date
                ) {

                    return false;

                }


                const date =
                    new Date(
                        item.date
                    );


                return (
                    date.toDateString() ===
                    todayString
                );

            }
        ).length;


    currentStarStat.textContent =
        currentStarTotal +
        "개";


    totalMessageStat.textContent =
        total +
        "개";


    todayMessageStat.textContent =
        todayCount +
        "개";

}


// =========================================
// 💌 메시지 표시
// =========================================

function renderMessages(
    messages
) {

    adminMessages.innerHTML =
        "<h3>💌 모인 한마디</h3>";


    if (
        messages.length === 0
    ) {

        adminMessages.innerHTML +=
            "<p>아직 메시지가 없습니다.</p>";

        return;

    }


    messages.forEach(
        function (
            item,
            index
        ) {

            const messageBox =
                document.createElement(
                    "div"
                );


            messageBox.className =
                "message-box";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                (
                    index + 1
                ) +
                "번째 마음";


            const message =
                document.createElement(
                    "p"
                );


            message.textContent =
                item.message;


            const date =
                document.createElement(
                    "span"
                );


            date.className =
                "message-date";


            if (
                item.date
            ) {

                const parsedDate =
                    new Date(
                        item.date
                    );


                if (
                    !isNaN(
                        parsedDate.getTime()
                    )
                ) {

                    date.textContent =
                        parsedDate.toLocaleString(
                            "ko-KR"
                        );

                } else {

                    date.textContent =
                        String(
                            item.date
                        );

                }

            }


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-message-button";


            deleteButton.textContent =
                "🗑️ 삭제";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteMessage(
                        item.row,
                        item.message
                    );

                }
            );


            messageBox.appendChild(
                title
            );


            messageBox.appendChild(
                message
            );


            if (
                date.textContent
            ) {

                messageBox.appendChild(
                    date
                );

            }


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
// 🔎 메시지 검색
// =========================================

messageSearch.addEventListener(
    "input",
    function () {

        const keyword =
            messageSearch.value
                .trim()
                .toLowerCase();


        if (
            keyword === ""
        ) {

            renderMessages(
                adminMessageData
            );

            return;

        }


        const filtered =
            adminMessageData.filter(
                function (item) {

                    return String(
                        item.message || ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        );

                }
            );


        renderMessages(
            filtered
        );

    }
);


// =========================================
// 🗑️ 메시지 삭제
// =========================================

async function deleteMessage(
    row,
    messageText
) {

    if (
        verifiedAdminCode === ""
    ) {

        alert(
            "관리자 인증이 필요합니다."
        );

        return;

    }


    const confirmed =
        confirm(
            "이 메시지를 삭제할까요?\n\n" +
            messageText
        );


    if (
        !confirmed
    ) {

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


        if (
            !result.success
        ) {

            alert(
                result.message ||
                "메시지를 삭제하지 못했습니다."
            );

            return;

        }


        alert(
            "메시지가 삭제되었습니다."
        );


        await reloadAdminMessages();


        await loadStars();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "메시지를 삭제하지 못했습니다."
        );

    }

}


// =========================================
// 🔄 관리자 메시지 다시 불러오기
// =========================================

async function reloadAdminMessages() {

    if (
        verifiedAdminCode === ""
    ) {

        return;

    }


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


        if (
            !data.success
        ) {

            return;

        }


        adminMessageData =
            data.messages || [];


        updateAdminStats(
            adminMessageData
        );


        const keyword =
            messageSearch.value
                .trim()
                .toLowerCase();


        if (
            keyword === ""
        ) {

            renderMessages(
                adminMessageData
            );

        } else {

            renderMessages(
                adminMessageData.filter(
                    function (item) {

                        return String(
                            item.message || ""
                        )
                            .toLowerCase()
                            .includes(
                                keyword
                            );

                    }
                )
            );

        }

    } catch (error) {

        console.error(
            error
        );

    }

}


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


        if (
            !confirmed
        ) {

            return;

        }


        resetStarsButton.disabled =
            true;


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


            if (
                !result.success
            ) {

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


            updateAdminStats(
                adminMessageData
            );


            adminStatus.textContent =
                "⭐ 별 초기화 완료";


        } catch (error) {

            console.error(
                error
            );


            alert(
                "별을 초기화하지 못했습니다. 다시 시도해주세요."
            );

        } finally {

            resetStarsButton.disabled =
                false;


            resetStarsButton.textContent =
                "⭐ 별 초기화";

        }

    }
);


// =========================================
// 🌌 사이트 시작
// =========================================

loadStars();
