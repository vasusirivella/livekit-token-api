require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

app.get('/token', async (req, res) => {
    const { room, identity } = req.query;

    if (!room || !identity) {
        return res.status(400).json({ error: 'Missing room or identity' });
    }

    const token = new AccessToken(apiKey, apiSecret, {
        identity,
        // ttl: 31536000, // 365 days
        ttl: 3600
    });

    token.addGrant({
        roomJoin: true,
        room,
        canPublish: true,
        canSubscribe: true,
    });

    try {
        const jwt = await token.toJwt();
        console.log('jwt', jwt);
        res.json({ token: jwt });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Token server listening at http://localhost:${PORT}`);
});
