require('dotenv').config();
const { LibraryInfo, connectDB } = require('./database');

async function seed() {
    await connectDB();
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
        }
    ]);
    console.log('Successfully added demo content!');
    process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
