import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { created, badRequest, serverError } from '../utils/response.js';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

/**
 * POST /links
 * Creates a unique feedback link for a client.
 * Each link stores who it's about (yourName) and where feedback goes (managerEmail).
 *
 * Body: {
 *   clientName: string,
 *   yourName: string,
 *   managerEmail: string,
 *   clientEmail: string (optional),
 *   expiresInDays: number (optional, default 30)
 * }
 */
export async function handler(event) {
    try {
        const body = JSON.parse(event.body || '{}');

        const { clientName, yourName, managerEmail, clientEmail, expiresInDays = 30 } = body;

        if (!clientName || !yourName || !managerEmail) {
            return badRequest('clientName, yourName, and managerEmail are required');
        }

        const token = uuidv4();
        const now = new Date();
        const expiresAt = Math.floor(now.getTime() / 1000) + expiresInDays * 24 * 60 * 60;

        const item = {
            token,
            clientName,
            yourName,
            managerEmail,
            clientEmail: clientEmail || '',
            createdAt: now.toISOString(),
            expiresAt,
            used: false,
        };

        await docClient.send(
            new PutCommand({
                TableName: process.env.LINKS_TABLE_NAME,
                Item: item,
            })
        );

        return created({
            token,
            feedbackUrl: `${process.env.FRONTEND_URL || ''}/feedback/${token}`,
            expiresAt: new Date(expiresAt * 1000).toISOString(),
        });
    } catch (error) {
        console.error('Error creating link:', error);
        return serverError('Failed to create feedback link');
    }
}
