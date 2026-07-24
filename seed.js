require('dotenv').config();
const { FAQ, LibraryInfo, connectDB } = require('./database');

async function seed() {
    await connectDB();

    // Clear existing to avoid duplicates during re-seeding
    await LibraryInfo.deleteMany({});
    await FAQ.deleteMany({});

    // Seed Library Info
    await LibraryInfo.insertMany([
        {
            title: 'Engineering', 
            category: 'Community', 
            content: 'The Engineering community contains 158 items including research papers, course materials, and projects related to various engineering disciplines at UICT.'
        }, 
        {
            title: 'Information Technology', 
            category: 'Community', 
            content: 'Information Technology community has 98 items with two sub-communities covering software development, networking, and IT infrastructure.'
        }, 
        {
            title: 'Management', 
            category: 'Community', 
            content: 'The Management community contains 127 items spanning business administration, project management, and organizational leadership.'
        }, 
        {
            title: 'UICT Partners', 
            category: 'Community', 
            content: "The partnership fosters the development of ICT skills and innovation, enhances access to training resources, and supports national ICT capacity-building initiatives. Through this collaboration, UICT aligns its programs with industry standards and government priorities, contributing to Uganda's digital transformation and socio-economic growth."
        },
        {
            title: 'Library Hours & Access',
            category: 'General',
            content: 'UICT Main Library is open Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 4:00 PM. Closed on Sundays and public holidays. Digital repository (UICTE-LIB) is accessible 24/7 online.'
        },
        {
            title: 'Borrowing & Circulation Policy',
            category: 'Services',
            content: 'Registered UICT students and staff can borrow physical books from the circulation desk using a valid UICT ID card. Students can borrow up to 3 books for 14 days. Books can be renewed once if no reserve hold exists.'
        }
    ]);

    // Seed FAQs
    await FAQ.insertMany([
        {
            question: 'How can I borrow a book?',
            answer: 'To borrow a book, visit the UICT Library circulation desk with your valid UICT student or staff ID card. Registered students can borrow up to 3 books for a standard loan period of 14 days.',
            category: 'Services',
            status: 'approved'
        },
        {
            question: 'How do I return or renew borrowed books?',
            answer: 'You can return books to the library return desk during working hours. To renew a book, present your student ID and the book at the circulation desk before the due date, provided another reader has not requested it.',
            category: 'Services',
            status: 'approved'
        },
        {
            question: 'What are the library opening hours?',
            answer: 'The library is open Monday – Friday from 8:00 AM to 6:00 PM and Saturday from 9:00 AM to 4:00 PM. The digital repository (UICTE-LIB) is available online 24/7.',
            category: 'General',
            status: 'approved'
        },
        {
            question: 'How do I search for past papers or project reports?',
            answer: 'Use the top search bar on the UICTE-LIB website to search by keyword, module name, or course code. Alternatively, browse through communities (Engineering, IT, Management) and select your specific collection.',
            category: 'Digital Repository',
            status: 'approved'
        },
        {
            question: 'How can I download materials and past papers?',
            answer: 'Navigate to the desired collection, select the item (e.g. Past Exam Paper or Project Report), and click the "Download PDF" button to download the document directly to your device.',
            category: 'Digital Repository',
            status: 'approved'
        },
        {
            question: 'How do I submit my final project or thesis to the repository?',
            answer: 'Submit a digital PDF copy of your final approved project report along with your supervisor approval clearance to your department librarian for upload to UICTE-LIB.',
            category: 'Submission',
            status: 'approved'
        },
        {
            question: 'Who is eligible to use the library?',
            answer: 'All registered UICT students, teaching staff, and administrative staff are eligible for library membership upon presenting their valid UICT identification.',
            category: 'General',
            status: 'approved'
        }
    ]);

    console.log('Successfully seeded FAQs and Library Info content!');
    process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });

