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
    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        // 1. Show User Message
        appendUserMessage(text);
        inputField.value = '';
        
        // 2. Show Typing Indicator
        const typingId = showTypingIndicator();
        
        // 3. Process Query via Gemini API Backend (Vercel Serverless Function)
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            removeTypingIndicator(typingId);
            
            if (data.response) {
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
            question: "Where can I find past papers?",
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
        },
        {
            keywords: ['opening hours', 'time', 'open', 'close', 'hours'],
            question: "What is the library opening hours?",
            answer: "The library is open from 8:00 AM to 10:00 PM on weekdays, and 9:00 AM to 5:00 PM on weekends. During public holidays, please check the website for specific schedules."
        },
        {
            keywords: ['borrow', 'lend', 'checkout', 'take out'],
            question: "How do I borrow a book?",
            answer: "To borrow a book, present your valid student or staff ID card at the circulation desk along with the books you wish to borrow."
        },
        {
            keywords: ['return', 'bring back'],
            question: "How do I return a book?",
            answer: "You can return borrowed books at the main circulation desk during opening hours, or use the book drop box located outside the library after hours."
        },
        {
            keywords: ['e-resources', 'online', 'databases', 'journals'],
            question: "How do I access e-resources?",
            answer: "E-resources can be accessed through the e-Library portal. Some premium databases may require you to log in with your institutional credentials."
        },
        {
            keywords: ['who', 'eligible', 'use', 'services', 'outsider'],
            question: "Who can use the library services?",
            answer: "All registered students, faculty, and staff of UICT have full access to library services. Alumni and external researchers may apply for special access memberships."
        },
        {
            keywords: ['renew', 'extend', 'keep longer'],
            question: "How do I renew a book?",
            answer: "Books can be renewed online through your library account, or in person at the circulation desk, provided no other user has placed a reservation on them."
        },
        {
            keywords: ['reference', 'section', 'located', 'where'],
            question: "Where is the reference section located?",
            answer: "The reference section is typically located on the ground floor of the main library building. Please ask the front desk for directions."
        },
        {
            keywords: ['catalogue', 'catalog', 'search for books'],
            question: "How do I search for books in the catalogue?",
            answer: "Use the online Public Access Catalog (OPAC) terminal in the library or access it via the library website to search by author, title, subject, or ISBN."
        },
        {
            keywords: ['services', 'offer', 'provide'],
            question: "What services does the library offer?",
            answer: "We offer book borrowing, study spaces, computer labs, printing and photocopying, e-resources access, research support, and information literacy training."
        },
        {
            keywords: ['reservation', 'reserve', 'hold', 'steps'],
            question: "What are the reservation steps on how to borrow books?",
            answer: "To reserve a book, find it in the online catalogue, click 'Place Hold', log in to your account, and confirm. You will be notified when it's ready for pickup."
        },
        {
            keywords: ['what is uicte-lib', 'about uicte-lib', 'purpose of library'],
            question: "What is UICTE-LIB?",
            answer: "UICTE-LIB is the Uganda Institute of Information and Communication Technology e-library. It preserves and provides access to research output from the UICT community."
        },
        {
            keywords: ['list of communities', 'which departments', 'available communities'],
            question: "What communities or departments are in the e-library?",
            answer: "The e-library currently features communities for Engineering, Information Technology, Management, and UICT Partners."
        },
        {
            keywords: ['uict partners', 'partners community'],
            question: "What is the UICT Partners community?",
            answer: "The UICT Partners community fosters the development of ICT skills, enhances access to training resources, and supports national ICT capacity-building initiatives."
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
