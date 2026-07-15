/**
 * chat.js
 * Client-side FAQ Bot logic using Dummy Data
 */

document.addEventListener('DOMContentLoaded', () => {
    const fab = document.getElementById('chatbot-fab');
    const widget = document.getElementById('chat-widget');
    const closeBtn = document.getElementById('chat-close');
    const messagesArea = document.getElementById('chat-messages');
    const inputField = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    
    let chatHistory = [];

    // Toggle Chat Widget
    fab.addEventListener('click', () => {
        widget.classList.remove('hidden');
        inputField.focus();
        
        // Add welcome message if empty
        if (messagesArea.children.length === 0) {
            appendBotMessage("Hello! I'm the UICT e-Library Assistant. I can help you search the repository, browse communities, and find research outputs. How can I assist you today?");
        }
    });

    closeBtn.addEventListener('click', () => {
        widget.classList.add('hidden');
    });

    // Send Message Logic
    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        // 1. Show User Message
        appendUserMessage(text);
        inputField.value = '';
        
        // 2. Show Typing Indicator
        const typingId = showTypingIndicator();
        
        // 3. Process Query via Gemini API Backend
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text, history: chatHistory })
            });

            const data = await response.json();
            removeTypingIndicator(typingId);
            
            if (data.response) {
                // Update history state
                chatHistory.push({ role: 'user', parts: [{ text }] });
                chatHistory.push({ role: 'model', parts: [{ text: data.response }] });

                // Convert markdown bold to HTML strong tags for basic formatting
                const formattedResponse = data.response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Convert markdown newlines to HTML br tags
                const finalHtml = formattedResponse.replace(/\n/g, '<br>');
                appendBotMessage(finalHtml);
            } else {
                appendBotMessage("Sorry, I received an invalid response from the server.");
            }
        } catch (error) {
            console.error('Error fetching AI response:', error);
            removeTypingIndicator(typingId);
            appendBotMessage("Sorry, I am having trouble connecting to the server. Please ensure the backend is running.");
        }
    };

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // UI Helpers
    function appendUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'msg-row user';
        div.innerHTML = `
            <div class="msg-avatar"><i class="bi bi-person-fill"></i></div>
            <div class="bubble">${escapeHtml(text)}</div>
        `;
        messagesArea.appendChild(div);
        scrollToBottom();
    }

    function appendBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'msg-row bot';
        div.innerHTML = `
            <div class="msg-avatar"><i class="bi bi-robot"></i></div>
            <div class="bubble">${text}</div>
        `;
        messagesArea.appendChild(div);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.className = 'msg-row bot';
        div.id = id;
        div.innerHTML = `
            <div class="msg-avatar"><i class="bi bi-robot"></i></div>
            <div class="bubble">
                <div class="typing"><span></span><span></span><span></span></div>
            </div>
        `;
        messagesArea.appendChild(div);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

});
