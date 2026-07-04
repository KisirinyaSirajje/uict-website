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
    const handleSend = () => {
        const text = inputField.value.trim();
        if (!text) return;

        // 1. Show User Message
        appendUserMessage(text);
        inputField.value = '';
        
        // 2. Show Typing Indicator
        const typingId = showTypingIndicator();
        
        // 3. Process Query (Simulate network delay)
        setTimeout(() => {
            removeTypingIndicator(typingId);
            const response = getFaqResponse(text);
            appendBotMessage(response);
        }, 1000 + Math.random() * 1000); // 1-2s delay
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

    // ─────────────────────────────────────────────────────────
    // DUMMY FAQ DATA & SIMPLE MATCHING LOGIC (E-LIBRARY SPECIFIC)
    // ─────────────────────────────────────────────────────────
    
    const dummyFaqs = [
        {
            keywords: ['search', 'find', 'look for', 'discover'],
            question: "How do I search the repository?",
            answer: 'You can use the search bar on the homepage to find items by title, author, or keyword. Alternatively, click "All of UICT eLib" in the navigation bar to browse by specific filters.'
        },
        {
            keywords: ['community', 'communities', 'collections', 'departments'],
            question: "What are communities and collections?",
            answer: 'Communities represent departments or research areas (e.g., Engineering, Information Technology). Each community holds specific collections of research papers, projects, and publications.'
        },
        {
            keywords: ['download', 'pdf', 'access', 'read', 'get'],
            question: "How do I download a document?",
            answer: 'Click on the title of the item you want from the search results, then look for the "Files" or "View/Open" link at the bottom of the item record to download the full PDF.'
        },
        {
            keywords: ['login', 'account', 'register', 'sign in'],
            question: "Do I need to log in to use the e-Library?",
            answer: 'Most research outputs are open access and do not require a login. However, logging in allows you to save searches, subscribe to email alerts for new additions, or submit your own research.'
        },
        {
            keywords: ['upload', 'submit', 'publish', 'my research'],
            question: "How can I submit my research to the repository?",
            answer: 'You must log in with your authorized UICT credentials. Once logged in, navigate to your community collection and click "Submit a new item to this collection".'
        },
        {
            keywords: ['statistics', 'views', 'downloads'],
            question: "Can I see how many times a paper was downloaded?",
            answer: 'Yes! Click the "Statistics" link in the top navigation bar to view overall repository usage, or check the statistics tab on an individual item page to see its specific views and downloads.'
        },
        {
            keywords: ['past papers', 'exam', 'examination', 'papers'],
            question: "Where can I find examination past papers?",
            answer: 'Past papers are available in the respective department collections. For example, navigate to Engineering -> Department of Software Engineering, or Information Technology -> Department of Computer Science, and look for the "Examination Past Papers" collection.'
        },
        {
            keywords: ['audio', 'visual', 'video', 'multimedia'],
            question: "Does the repository contain audio-visual materials?",
            answer: 'Yes! Some departments have "Audio-Visuals" collections that contain recorded lectures, presentations, and other multimedia research outputs.'
        },
        {
            keywords: ['project reports', 'report', 'projects'],
            question: "How do I access student project reports?",
            answer: 'Student project reports are archived in the "Project Reports" collections under specific departments. You can browse them by navigating to the respective community.'
        },
        {
            keywords: ['books', 'book chapters', 'chapter'],
            question: "Can I read books and book chapters here?",
            answer: 'Yes, many departments maintain a "Books & Book Chapters" collection which contains uploaded chapters and open-access books published by UICT staff and partners.'
        }
    ];

    function getFaqResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        // Basic keyword matching
        for (const faq of dummyFaqs) {
            for (const keyword of faq.keywords) {
                if (lowerQuery.includes(keyword)) {
                    return faq.answer;
                }
            }
        }
        
        // Fallback: Display available questions
        let fallbackMsg = "Hello! I'd be happy to help you with the e-library. Here are some topics I can answer for you:<br><br><ul style='margin-left: 20px; line-height: 1.6;'>";
        
        // List the questions
        dummyFaqs.forEach(faq => {
            fallbackMsg += `<li><strong>${faq.question}</strong></li>`;
        });
        
        fallbackMsg += "</ul><br>Please feel free to ask me about any of the topics above!";
        return fallbackMsg;
    }
});
