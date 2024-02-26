const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
let textarea = document.getElementById("chattext");

let userMessage;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `
    <li class="chat outgoing">
        <p>${message}</p>
        <i class="material-icons-outlined">person</i>
    </li>
    ` :
     `
    <li class="chat incoming">
        <i class="material-icons-outlined">smart_toy</i>
        <p>${message}</p>
    </li>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = async (message) => {
    const API_KEY = "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";
    const API_URL = "https://api.openai.com/v1/chat/completions";
    textarea.value = "";
    let json = {
        model: "gpt-3.5-turbo",
        messages:[{role:"user",content: message}]
    };
    const reqOpt = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify(json)
    }

    // Send POST request to API, get response
    const response = await fetch(API_URL, reqOpt);
    const reply = await response.json();
    return reply;
}

const handleChat = async () => {
    userMessage = chatInput.value.trim();
    textarea.textContent = "";
    if (!userMessage) return;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    let resp = await generateResponse(userMessage);
    let message = resp.choices[0].message.content;
    setTimeout(() => {
        // Dispaly "Thinking..." message while waiting for the response
        chatbox.appendChild(createChatLi(message, "incoming"));
    }, 3000);
}

sendChatBtn.addEventListener("click", handleChat);