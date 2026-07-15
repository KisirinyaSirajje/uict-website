const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.warn('⚠️ MONGODB_URI is not defined in the environment. Skipping database connection.');
            return;
        }

        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// --- SCHEMAS ---

// User Schema (for Administrators)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'librarian', 'user'], default: 'user' }
}, { timestamps: true });

// FAQ Schema (for Knowledge Base)
const FAQSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['draft', 'approved'], default: 'approved' }
}, { timestamps: true });

// Library Info Schema (For policies, opening hours, etc.)
const LibraryInfoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: 'General' }
}, { timestamps: true });

// Chat Log Schema (For dashboard statistics and monitoring)
const ChatLogSchema = new mongoose.Schema({
    userId: { type: String, default: 'anonymous' },
    message: { type: String, required: true },
    response: { type: String, required: true },
    wasAnswered: { type: Boolean, default: true } // If AI says "I don't know", mark as false
}, { timestamps: true });

// Unanswered Question Schema (Questions that need human review)
const UnansweredSchema = new mongoose.Schema({
    question: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }
}, { timestamps: true });

// --- MODELS ---
const User = mongoose.model('User', UserSchema);
const FAQ = mongoose.model('FAQ', FAQSchema);
const LibraryInfo = mongoose.model('LibraryInfo', LibraryInfoSchema);
const ChatLog = mongoose.model('ChatLog', ChatLogSchema);
const Unanswered = mongoose.model('Unanswered', UnansweredSchema);

module.exports = {
    connectDB,
    User,
    FAQ,
    LibraryInfo,
    ChatLog,
    Unanswered
};
