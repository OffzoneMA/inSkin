const {User} = require('./user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const settings = require('../../../config/settings')

describe('user.generateAuthToken', () => {  
    it('should return a valid JWT', () => {
        const payload = {_id: mongoose.Types.ObjectId().toHexString()}
       const user = new User(payload)
       const token = user.generateAuthToken();
       const decoded = jwt.verify(token, settings.jwtPrivateKey)
       expect(decoded.user).toMatchObject(payload)
    })
})