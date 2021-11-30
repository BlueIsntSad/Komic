const  User = require('./server/models/user');

const mongoose = require('mongoose');

database = process.env.db_URI
mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then((result) => {
        console.log("Database connection successfully!");
    })
    .catch((err) => console.log(err));


var Users = [
    new User({
        name: 'Alex',
        account: '@SuperHandsomeAlex',
        avatar: 'img/avatar_1.png',
        about: 'Cras ultrices rhoncus sem ac hendrerit. Integer et fermentum neque, sed imperdiet mi. Donec eget lacinia velit. Pellentesque blandit elit mi, vitae scelerisque odio molestie quis. Etiam sit amet urna nulla. Quisque lacinia lacus convallis, venenatis nunc at, volutpat tortor. Integer ornare facilisis mollis. Cras lobortis lacinia lacinia.',
        adress: 'Hue, Viet Nam',
        follower: 156,
        views: 6547
    }),
    new User({
        name: 'Bob',
        account: '@Bobby',
        avatar: 'img/avatar_2.png',
        about: 'Nullam pharetra varius sapien, vitae luctus est dictum vel. Aenean et felis viverra, faucibus nibh ac, eleifend ipsum. Cras sed sodales nisl. Sed a sapien sit amet diam rutrum blandit. Sed in lectus sodales, fermentum felis sit amet, blandit arcu.',
        adress: 'Ho Chi Minh, Viet Nam',
        follower: 1264,
        views: 1114
    }),
    new User({
        name: 'Rey',
        account: '@Boyyyy01',
        avatar: 'img/avatar_3.png',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu pulvinar lacus. Mauris id magna vehicula, efficitur neque sit amet, tincidunt libero. Praesent id molestie enim',
        adress: 'Ha Noi, Viet Nam',
        follower: 12,
        views: 9873
    }),
]

var done = 0;
for (var i = 0; i < Users.length; i++) {
    Users[i].save(function(err, result) {
        done++;
        if (done === Users.length) {
            exists();
        }
    });
}

function exists() {
    mongoose.disconnect();
}