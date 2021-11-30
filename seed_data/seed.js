const manga = require('./seed_manga');
const chapter = require('./seed_chapter');
const user = require('./seed_user');
const comment = require('./seed_comment');

async function seed() {
    await chapter();
    await manga();
    await user();
    await comment();
    console.log('>>>>>>>> Data generate successfull <<<<<<<<<');
}