import { getUserData } from "../controllers/AuthController.js";
export const Clients = new Set();
export const SubmissionsClient = new Set();
export const users = new Map();
export const getUser = async (req, res) => {
    try {
        const email = req.params.email;
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        // Get initial data
        const initialUserData = await getUserData(email);
        if (!initialUserData) {
            throw new Error("USER_NOT_FOUND");
        }

        if (!users.has(email)) {
            users.set(email, new Set());
        }
        users.get(email).add(res);

        res.write(`event: initial_user_data\n`);
        res.write(`data: ${JSON.stringify(initialUserData)}\n\n`);
        console.log(`SSE client for ${email} connected. (getUser)`);

        const heartbeatInterval = setInterval(() => {
            res.write(`event: keep-alive\n\n`);
        }, 30000);

        req.on("close", () => {
            clearInterval(heartbeatInterval);
            const set = users.get(email);
            if (set) {
                set.delete(res);
                if (set.size === 0) {
                    users.delete(email);
                }
            }
            console.log(`SSE client for ${email} disconnected. (getUser)`);
        });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: 'Failed to establish SSE connection.' });
        } else {
            res.write(`event: error\n`);
            res.write(`data: ${JSON.stringify({ message: 'Failed to retrieve initial user data.', code: 'INITIAL_DATA_ERROR' })}\n\n`);
            res.end();
        }
    }
};

export const sendUserUpdater = async (email) => {
    try {
        await getUserData(email, true);
        const connections = users.get(email);
        if (connections && connections.size > 0) {
            const updatedUser = await getUserData(email);
            for (const res of connections) {
                res.write(`event: user_update\n`);
                res.write(`data: ${JSON.stringify(updatedUser)}\n\n`);
            }
            console.log(`Sent updated data to all connections for ${email}`);
        }
    } catch (error) {
        const connections = users.get(email);
        if (connections) {
            for (const res of connections) {
                res.write(`event: error\n`);
                res.write(`data: ${JSON.stringify({ message: 'Failed to retrieve user data.', code: 'SEND_UPDATE_ERROR' })}\n\n`);
                res.end();
            }
        }
    }
};
