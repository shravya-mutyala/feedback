/**
 * Simple local Express server to test the feedback app without AWS.
 * This mocks DynamoDB with an in-memory store and skips SES emails.
 *
 * Run: node local-server.js
 * API available at: http://localhost:3001
 */

import { randomUUID } from 'crypto';
import http from 'http';

// In-memory store (simulates DynamoDB)
const links = new Map();
const feedbacks = new Map();

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
        const url = req.url;

        // POST /links — Generate a feedback link
        if (req.method === 'POST' && url === '/links') {
            const data = JSON.parse(body || '{}');
            const { clientName, yourName, managerEmail } = data;

            if (!clientName || !yourName || !managerEmail) {
                respond(res, 400, { error: 'clientName, yourName, and managerEmail are required' });
                return;
            }

            const token = randomUUID();
            const link = {
                token,
                clientName,
                yourName,
                managerEmail,
                createdAt: new Date().toISOString(),
                used: false,
            };

            links.set(token, link);
            console.log(`✅ Link created: /feedback/${token} (for ${clientName}, routes to ${managerEmail})`);

            respond(res, 201, {
                token,
                feedbackUrl: `http://localhost:3000/feedback/${token}`,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
            return;
        }

        // GET /links/:token — Get link info
        const getLinkMatch = url.match(/^\/links\/(.+)$/);
        if (req.method === 'GET' && getLinkMatch) {
            const token = getLinkMatch[1];
            const link = links.get(token);

            if (!link) {
                respond(res, 404, { error: 'Feedback link not found or expired' });
                return;
            }

            if (link.used) {
                respond(res, 400, { error: 'This feedback link has already been used' });
                return;
            }

            respond(res, 200, { clientName: link.clientName, yourName: link.yourName, token });
            return;
        }

        // POST /feedback — Submit feedback
        if (req.method === 'POST' && url === '/feedback') {
            const data = JSON.parse(body || '{}');
            const { token, wentWell, wouldRecommend, additionalComments } = data;

            if (!token) {
                respond(res, 400, { error: 'Token is required' });
                return;
            }

            const link = links.get(token);
            if (!link) {
                respond(res, 404, { error: 'Feedback link not found' });
                return;
            }

            if (link.used) {
                respond(res, 400, { error: 'Feedback has already been submitted for this link' });
                return;
            }

            // Save feedback
            const feedbackId = randomUUID();
            feedbacks.set(feedbackId, {
                id: feedbackId,
                token,
                clientName: link.clientName,
                yourName: link.yourName,
                managerEmail: link.managerEmail,
                wentWell,
                wouldRecommend,
                additionalComments,
                createdAt: new Date().toISOString(),
            });

            // Mark link as used
            link.used = true;

            console.log(`📧 Feedback submitted! Would email ${link.managerEmail}:`);
            console.log(`   From client: ${link.clientName}`);
            console.log(`   About: ${link.yourName}`);
            console.log(`   Comments: ${wentWell || '(none)'}`);
            console.log(`   Would recommend: ${wouldRecommend}`);

            respond(res, 200, { message: 'Feedback submitted successfully', id: feedbackId });
            return;
        }

        respond(res, 404, { error: 'Not found' });
    });
});

function respond(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

server.listen(3001, () => {
    console.log('');
    console.log('🚀 Local feedback API running at http://localhost:3001');
    console.log('');
    console.log('Endpoints:');
    console.log('  POST /links        — Generate a feedback link');
    console.log('  GET  /links/:token — Get link info');
    console.log('  POST /feedback     — Submit feedback');
    console.log('');
    console.log('Frontend should be at http://localhost:3000');
    console.log('Go to http://localhost:3000/generate to create a link');
    console.log('');
});
