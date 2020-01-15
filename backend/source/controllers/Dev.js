const axios = require('axios')
const Dev = require('../models/Dev.js')

module.exports = {
    async index(request, response) {
        const { user } = request.headers

        const loggedDev = await Dev.findById(user)

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev. likes } },
                { _id: { $nin: loggedDev. dislikes } }
            ]
        }).sort({_id: -1})

        return response.json(users)
    },

    async store(request, response) {
        
        const { username: user } = request.body

        const userExists = await Dev.findOne({ user })

        if (userExists) {
            console.log(`User ${user} already exists.`)
            return response.json(userExists)
        }

        const githubResponse = await axios.get(`https://api.github.com/users/${user}`)

        const { name, bio, avatar_url: avatar } = githubResponse.data

        const dev = await Dev.create({
            name,
            user,
            bio,
            avatar
        })
        
        console.log(`User ${user} created.`)
        return response.json(dev)
    }
}