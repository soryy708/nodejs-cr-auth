const { randomBytes, timingSafeEqual } = require('crypto');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { hash } = require('../../common/crypto');

const router = express.Router();
const mongoClientPromise = MongoClient.connect('mongodb://localhost:27017');

// Create a user
(async()=>{
    const saltLength = 64; // in bytes
    const saltRounds = 1024;
    const mongoClient = await mongoClientPromise;
    const db = mongoClient.db('authtest');
    const salt = (await randomBytes(saltLength)).toString('hex');
    await db.collection('user').insertOne({
        _id: 'someUserId',
        username: 'user',
        password: await hash('password', salt, saltRounds),
        salt,
        rounds: saltRounds,
    });
})();

router.post('/', async (req, res) => {
    const nonceLength = 256;
    
    const mongoClient = await mongoClientPromise;
    const db = mongoClient.db('authtest');

    if (req.body.username) { // Challenge request
        const user = await db.collection('user').findOne({ username: req.body.username });
        if (!user) {
            res.status(404).send();
            return;
        }

        const nonce = (await randomBytes(nonceLength)).toString('hex');

        const { insertedId: sessionId } = await db.collection('session').insertOne({
            nonce,
            userId: user._id,
        });

        res.status(200).send({
            nonce,
            salt: user.salt,
            rounds: user.rounds,
            sessionId,
        });

    } else if (req.body.sessionId) { // Challenge response
        if (!req.body.hash) {
            res.status(400).send();
            return;
        }

        // We want the nonce to be single-use, so we delete the session right after retrieving it
        const { value: session } = await db.collection('session').findOneAndDelete({ _id: new ObjectId(req.body.sessionId)});
        if (!session) {
            res.status(404).send();
            return;
        }

        const user = await db.collection('user').findOne({ _id: session.userId });
        if (!user) {
            res.status(500).send();
            return;
        }

        if (!timingSafeEqual(Buffer.from(await hash(user.password, session.nonce, user.rounds)), Buffer.from(req.body.hash))) {
            res.status(403).send();
            return;
        }

        res.status(200).send();

    } else {
        res.status(400).send();
    }
});

module.exports = router;
