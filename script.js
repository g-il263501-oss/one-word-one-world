const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const starCount = document.getElementById("star-count");
const starsContainer = document.getElementById("stars");

let messages = [];

submitButton.addEventListener("click", async function () {
    const message = messageInput.value.trim();

    if (message === "") {
        alert("한마디를 입력해주세요!");
        return;
    }

    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbzAwNOaa7QgC5FfN5rrSgfS7Qv_zSi_2izKd4k65OGzHPnscCN2U84Qy8SuHoJchh5P0w/exec",
            {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    message: message
                })
            }
        );

        const result = await response.json();

        if (result.success) {
            messages.push(message);

            const star = document.createElement("div");
            star.innerHTML = "⭐";

            star.style.position = "fixed";
            star.style.left = Math.random() * 90 + "%";
            star.style.top = Math.random() * 80 + "%";
            star.style.fontSize = "25px";

            starsContainer.appendChild(star);

            starCount.innerHTML =
                "⭐ " + messages.length + "개의 마음";

            messageInput.value = "";

            alert("당신의 한마디가 별이 되었어요! ⭐");
        } else {
            alert("메시지를 저장하지 못했어요.");
        }

    } catch (error) {
        alert("메시지를 보내지 못했어요. 다시 시도해주세요.");
        console.error(error);
    }
});
