const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const starCount = document.getElementById("star-count");
const starsContainer = document.getElementById("stars");

let messages = [];

submitButton.addEventListener("click", function () {
    const message = messageInput.value.trim();

    if (message === "") {
        alert("한마디를 입력해주세요!");
        return;
    }

    messages.push(message);

    const star = document.createElement("div");
    star.innerHTML = "⭐";

    star.style.position = "fixed";
    star.style.left = Math.random() * 90 + "%";
    star.style.top = Math.random() * 80 + "%";
    star.style.fontSize = "25px";
    star.style.cursor = "pointer";

    starsContainer.appendChild(star);

    starCount.innerHTML = "⭐ " + messages.length + "개의 마음";

    messageInput.value = "";
});
