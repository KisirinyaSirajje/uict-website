const { GoogleGenAI } = require('@google/genai');
const { FAQ, LibraryInfo, ChatLog, Unanswered } = require('../database');

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

        // Fetch Knowledge Base from Database
        const faqs = await FAQ.find({ status: 'approved' });
        const libraryInfos = await LibraryInfo.find();

        let knowledgeText = 'Information about UICTE-LIB:\n';
        libraryInfos.forEach(info => {
            knowledgeText += `- ${info.title}: ${info.content}\n`;
        });
        knowledgeText += '\nFrequently Asked Questions:\n';
        faqs.forEach(faq => {
            knowledgeText += `- Q: ${faq.question}\n  A: ${faq.answer}\n`;
        });

        const SYSTEM_INSTRUCTION = `You are the UICT e-Library AI Assistant. You must answer questions using strictly the following information about the library. Do not invent information. If a user asks about something unrelated, politely decline and steer them back to the library. If you don't know the answer, explicitly say "I'm sorry, I don't have that information. Let me log this question so an administrator can review it."\n\n${knowledgeText}`;

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

        // Log the conversation
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

        res.status(200).json({ response: replyText });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
};
