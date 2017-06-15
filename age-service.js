const cache = require('./cache');

const ages = {
    John: '20',
    Michelle: '34',
    Amy: '31',
    Doug: '22'
}

/*
We create an async function, which accepts a name, and a callback function to
be called once we fetch the age from out database.

To simulate the time it takes to fetch results from an actual database, we set
a timeout of 1 second, and then return the age of the person requested.
*/
const getAgeFromDb = (name, cb) => setTimeout(() => {
    //This is to verify that out database is being called.
    console.log('Fetching from db')

    //Returns "Does not exist" if an unknown name is given
    const age = ages[name] || 'Does not exist'

    // Call the callback function with the result
    cb(age)
}, 5000)


module.exports = (name, cb) => {

    //First, check if the age exists in our cache
    cache.get(name, (err, age) => {
        if (age !== null) {
            //If it does, return it in the callback
            return cb(age)
        }

        /*
        At this point, we know that the data we want does not exist in the cache
        So, we query it from our mock database, like before
        */
        getAgeFromDb(name, age => {
            //Once we get the age from the database, store it in the cache.
            cache.set(name, age, () => {

                //At this point, our data is successfully stored in the redis cache
                // We now return the age through the callback
                cb(age)
            })
        })
    });

    module.exports = getAgeFromDb
}