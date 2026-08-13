import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { success, badRequest, notFound, serverError } from '../utils/response.js';
import { sendFeedbackEmail } from '../utils/email.js';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

/**
 * POST /feedback
 * Submits feedback and emails it to the manager stored in the link.
 *
 * Body: {
 *   token: string,
 *   ratings: [{ category: string, score: number }],
 *   wentWell: string,
 *   couldImprove: string,
 *   wouldRecommend: boolean,
 *   additionalComments: string (optional)
 * }
 */
export async function handler(event) {
    try {
        const body = JSON.parse(event.body || '{}');
        const { token, ratings, wentWell, couldImprove, wouldRecommend, additionalComments } = body;

        if (!token) {
            return badRequest('Token is required');
        }

        // Validate the link exists and hasn't been used
        const linkResult = await docClient.send(
            new GetCommand({
                TableName: process.env.LINKS_TABLE_NAME,
                Key: { token },
            })
        );

        if (!linkResult.Item) {
            return notFound('Feedback link not found or expired');
        }

        const link = linkResult.Item;

        if (link.used) {
            return badRequest('Feedback has already been submitted for this link');
        }

        const now = Math.floor(Date.now() / 1000);
        if (link.expiresAt && now > link.expiresAt) {
            return badRequest('This feedback link has expired');
        }

        // Save the feedback
        const feedbackId = uuidv4();
        const createdAt = new Date().toISOString();

        const feedbackItem = {
            id: feedbackId,
            createdAt,
            token,
            clientName: link.clientName,
            yourName: link.yourName,
            managerEmail: link.managerEmail,
            ratings: ratings || [],
            wentWell: wentWell || '',
            couldImprove: couldImprove || '',
            wouldRecommend: wouldRecommend ?? true,
            additionalComments: additionalComments || '',
        };

        await docClient.send(
            new PutCommand({
                TableName: process.env.TABLE_NAME,
                Item: feedbackItem,
            })
        );

        // Mark the link as used
        await docClient.send(
            new UpdateCommand({
                TableName: process.env.LINKS_TABLE_NAME,
                Key: { token },
                UpdateExpression: 'SET used = :used',
                ExpressionAttributeValues: { ':used': true },
            })
        );

        // Send email to the manager stored in this link
        await sendFeedbackEmail({
            managerEmail: link.managerEmail,
            clientName: link.clientName,
            yourName: link.yourName,
            feedback: { ratings: ratings || [], wentWell, couldImprove, wouldRecommend, additionalComments },
        });

        return success({
            message: 'Feedback submitted successfully',
            id: feedbackId,
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return serverError('Failed to submit feedback');
    }
}
