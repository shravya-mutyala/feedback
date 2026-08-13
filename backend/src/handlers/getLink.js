import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { success, notFound, badRequest, serverError } from '../utils/response.js';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

/**
 * GET /links/{token}
 * Retrieves client info for a feedback link (used by frontend to personalize the form).
 */
export async function handler(event) {
    try {
        const token = event.pathParameters?.token;

        if (!token) {
            return badRequest('Token is required');
        }

        const result = await docClient.send(
            new GetCommand({
                TableName: process.env.LINKS_TABLE_NAME,
                Key: { token },
            })
        );

        if (!result.Item) {
            return notFound('Feedback link not found or expired');
        }

        const { clientName, yourName, used, expiresAt } = result.Item;

        if (used) {
            return badRequest('This feedback link has already been used');
        }

        const now = Math.floor(Date.now() / 1000);
        if (expiresAt && now > expiresAt) {
            return badRequest('This feedback link has expired');
        }

        return success({
            clientName,
            yourName,
            token,
        });
    } catch (error) {
        console.error('Error getting link:', error);
        return serverError('Failed to retrieve feedback link');
    }
}
