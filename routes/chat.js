const { GoogleGenAI } = require('@google/genai');
const { connectDB, FAQ, LibraryInfo, ChatLog, Unanswered } = require('../database');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, history = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
            return res.status(200).json({ 
                response: 'The AI is currently unavailable because the API key is not configured.' 
            });
        }

        // Connect DB & Fetch Knowledge Base from Database
        let faqs = [];
        let libraryInfos = [];
        try {
            await connectDB();
            faqs = await FAQ.find({ status: 'approved' });
            libraryInfos = await LibraryInfo.find();
        } catch (dbErr) {
            console.warn('⚠️ Knowledge base DB fetch error:', dbErr.message);
        }

        // Built-in Default Library Knowledge (ensures standard questions are answered out-of-the-box)
        const defaultKnowledge = `
UICT e-Library Core Information & Policies:
- Borrowing Books: Registered UICT students and staff can borrow physical books from the circulation desk using a valid UICT ID card. Students can borrow up to 3 books for a loan period of 14 days. Renewal is permitted once before the due date if there are no holds.
- Returning & Renewing: Return books to the return counter during working hours. Renewals can be done at the circulation desk or online prior to the due date.
- Opening Hours: Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 4:00 PM. Closed Sundays and public holidays. Digital repository (UICTE-LIB) is online 24/7.
- Repository Communities: Engineering, Information Technology, Management, and UICT Partners.
- Searching & Downloading: Use the top search bar to find past exam papers, project reports, and books. Navigate to the item page and click "Download PDF".
- Submitting Research: Final student project reports and research papers must be submitted electronically in PDF format to the department librarian along with supervisor approval.
- Membership: All registered UICT students, lecturers, and staff are eligible with valid UICT identification.
`;

        let knowledgeText = defaultKnowledge + '\nDatabase Information:\n';
        libraryInfos.forEach(info => {
            knowledgeText += `- ${info.title}: ${info.content}\n`;
        });
        if (faqs.length > 0) {
            knowledgeText += '\nFrequently Asked Questions:\n';
            faqs.forEach(faq => {
                knowledgeText += `- Q: ${faq.question}\n  A: ${faq.answer}\n`;
            });
        }

        const SYSTEM_INSTRUCTION = `You are the UICT e-Library AI Assistant for the Uganda Institute of Information and Communication Technology (UICT).
Your primary task is to help users with queries about the library, borrowing books, opening hours, digital repository navigation, downloading past papers, communities, and research submissions.

Rules:
1. Answer standard library questions (e.g. borrowing books, returning books, library hours, downloading papers, search, membership) directly using the Knowledge Base below.
2. Keep responses friendly, concise, helpful, and formatted neatly with clear steps or bullet points when appropriate.
3. If a question is completely unrelated to UICT or library services, politely steer the user back to library topics.
4. ONLY if a question is a complex administrative request, personal user account issue, or specific policy query that CANNOT be answered from the Knowledge Base, explicitly include the phrase: "I'm sorry, I don't have that information. Let me log this question so an administrator can review it."

Knowledge Base:
${knowledgeText}`;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Convert frontend history to GenAI history format
        // Expected frontend format: [{role: 'user', parts: [{text: '...'}]}, {role: 'model', parts: [{text: '...'}]}]
        // OR simply an array of strings, but let's assume it sends the standard Gemini format
        
        let contents = [];
        if (Array.isArray(history) && history.length > 0) {
            contents = [...history];
        }
        
        // Append the current message
        contents.push({ role: 'user', parts: [{ text: message }] });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });

        const replyText = response.text;
        
        // Determine if the question was answered
        const wasAnswered = !replyText.includes("Let me log this question so an administrator can review it");

        // Log the conversation (non-blocking if DB fails)
        try {
            await ChatLog.create({
                message: message,
                response: replyText,
                wasAnswered: wasAnswered
            });

            // Log to unanswered if not answered
            if (!wasAnswered) {
                await Unanswered.create({
                    question: message,
                    status: 'pending'
                });
            }
        } catch (logErr) {
            console.warn('⚠️ Could not log chat to database:', logErr.message);
        }

        res.status(200).json({ response: replyText });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
};
