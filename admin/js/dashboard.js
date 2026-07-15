const API_URL = '/api';

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login.html';
    }
    return token;
}

const token = checkAuth();
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        
        const target = e.target.closest('.nav-item').dataset.target;
        e.target.closest('.nav-item').classList.add('active');
        document.getElementById(target).classList.add('active');
        
        // Change Title
        const titles = {
            'dashboard': 'Dashboard Overview',
            'knowledge': 'Knowledge Base Management',
            'unanswered': 'Unanswered Queries'
        };
        document.getElementById('page-title').innerText = titles[target];

        // Close sidebar on mobile
        document.querySelector('.sidebar').classList.remove('show');

        // Load data based on tab
        if (target === 'dashboard') loadDashboard();
        if (target === 'knowledge') loadKnowledge();
        if (target === 'unanswered') loadUnanswered();
    });
});

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login.html';
}

// Data Fetching Functions
async function loadDashboard() {
    try {
        const res = await fetch(`${API_URL}/stats`, { headers });
        if(res.status === 401) logout();
        const data = await res.json();
        
        document.getElementById('stat-total').innerText = data.totalConversations;
        document.getElementById('stat-unanswered').innerText = data.unansweredCount;
        document.getElementById('stat-faqs').innerText = data.totalFaqs;
        document.getElementById('stat-rate').innerText = `${data.successRate}%`;

        const logsRes = await fetch(`${API_URL}/stats/chat-logs`, { headers });
        const logs = await logsRes.json();
        
        const tbody = document.getElementById('chat-logs-table');
        tbody.innerHTML = logs.map(log => `
            <tr>
                <td>${new Date(log.createdAt).toLocaleString()}</td>
                <td><strong>Q:</strong> ${log.message}<br><small style="color:var(--text-muted)"><strong>A:</strong> ${log.response.substring(0, 100)}...</small></td>
                <td><span class="badge ${log.wasAnswered ? 'badge-success' : 'badge-warning'}">${log.wasAnswered ? 'Answered' : 'Failed'}</span></td>
            </tr>
        `).join('') || '<tr><td colspan="3" style="text-align: center;">No chat logs found.</td></tr>';

    } catch (err) {
        console.error('Failed to load dashboard data', err);
    }
}

async function loadKnowledge() {
    try {
        // Load FAQs
        const faqsRes = await fetch(`${API_URL}/knowledge/faqs`, { headers });
        if(faqsRes.status === 401) logout();
        const faqs = await faqsRes.json();
        
        document.getElementById('faqs-table').innerHTML = faqs.map(faq => `
            <tr>
                <td><strong>${faq.question}</strong></td>
                <td>${faq.category}</td>
                <td><span class="badge badge-success">${faq.status}</span></td>
                <td>
                    <button class="btn" style="padding: 0.25rem 0.5rem" onclick="editFaq('${faq._id}', \`${faq.question}\`, \`${faq.answer.replace(/`/g, '\\`')}\`, '${faq.category}')">Edit</button>
                    <button class="btn btn-danger" style="padding: 0.25rem 0.5rem" onclick="deleteFaq('${faq._id}')">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" style="text-align: center;">No FAQs found.</td></tr>';

        // Load Library Info
        const infoRes = await fetch(`${API_URL}/knowledge/library-info`, { headers });
        const info = await infoRes.json();

        document.getElementById('info-table').innerHTML = info.map(i => `
            <tr>
                <td><strong>${i.title}</strong></td>
                <td>${i.category}</td>
                <td>
                    <button class="btn btn-danger" style="padding: 0.25rem 0.5rem" onclick="deleteInfo('${i._id}')">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="3" style="text-align: center;">No Information found.</td></tr>';

    } catch (err) {
        console.error('Failed to load knowledge base', err);
    }
}

async function loadUnanswered() {
    try {
        const res = await fetch(`${API_URL}/unanswered`, { headers });
        if(res.status === 401) logout();
        const questions = await res.json();
        
        document.getElementById('unanswered-table').innerHTML = questions.map(q => `
            <tr>
                <td>${new Date(q.createdAt).toLocaleDateString()}</td>
                <td><strong>${q.question}</strong></td>
                <td>
                    ${q.status === 'pending' ? 
                        `<button class="btn" style="padding: 0.25rem 0.5rem" onclick="turnIntoFaq('${q._id}', \`${q.question.replace(/`/g, '\\`')}\`)">Create FAQ</button>` : 
                        '<span class="badge badge-success">Resolved</span>'
                    }
                </td>
            </tr>
        `).join('') || '<tr><td colspan="3" style="text-align: center;">No unanswered queries. Great!</td></tr>';

    } catch (err) {
        console.error('Failed to load unanswered queries', err);
    }
}

// Actions
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    // Reset forms
    if(id === 'faq-modal') document.getElementById('faq-form').reset();
    if(id === 'info-modal') document.getElementById('info-form').reset();
}

// FAQ Form Submission
document.getElementById('faq-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('faq-id').value;
    const payload = {
        question: document.getElementById('faq-question').value,
        answer: document.getElementById('faq-answer').value,
        category: document.getElementById('faq-category').value,
        status: 'approved'
    };

    const url = id ? `${API_URL}/knowledge/faqs/${id}` : `${API_URL}/knowledge/faqs`;
    const method = id ? 'PUT' : 'POST';

    await fetch(url, { method, headers, body: JSON.stringify(payload) });
    closeModal('faq-modal');
    loadKnowledge();
});

// Info Form Submission
document.getElementById('info-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('info-id').value;
    const payload = {
        title: document.getElementById('info-title').value,
        content: document.getElementById('info-content').value,
        category: document.getElementById('info-category').value
    };

    const url = id ? `${API_URL}/knowledge/library-info/${id}` : `${API_URL}/knowledge/library-info`;
    const method = id ? 'PUT' : 'POST';

    await fetch(url, { method, headers, body: JSON.stringify(payload) });
    closeModal('info-modal');
    loadKnowledge();
});

// Helpers
function editFaq(id, question, answer, category) {
    document.getElementById('faq-id').value = id;
    document.getElementById('faq-question').value = question;
    document.getElementById('faq-answer').value = answer;
    document.getElementById('faq-category').value = category;
    openModal('faq-modal');
}

async function deleteFaq(id) {
    if(confirm('Are you sure you want to delete this FAQ?')) {
        await fetch(`${API_URL}/knowledge/faqs/${id}`, { method: 'DELETE', headers });
        loadKnowledge();
    }
}

async function deleteInfo(id) {
    if(confirm('Are you sure you want to delete this Library Info?')) {
        await fetch(`${API_URL}/knowledge/library-info/${id}`, { method: 'DELETE', headers });
        loadKnowledge();
    }
}

async function turnIntoFaq(unansweredId, question) {
    // Open FAQ modal pre-filled
    document.getElementById('faq-id').value = '';
    document.getElementById('faq-question').value = question;
    document.getElementById('faq-answer').value = '';
    openModal('faq-modal');
    
    // Mark unanswered as resolved
    await fetch(`${API_URL}/unanswered/${unansweredId}`, { 
        method: 'PUT', 
        headers, 
        body: JSON.stringify({ status: 'resolved' }) 
    });
}

// Init
loadDashboard();
