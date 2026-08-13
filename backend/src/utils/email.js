import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient();

/**
 * Send feedback summary email to the client's manager
 */
export async function sendFeedbackEmail({ managerEmail, clientName, yourName, feedback }) {
    const ratingsSummary = feedback.ratings
        .map((r) => `  • ${r.category}: ${r.score}/5`)
        .join('\n');

    const htmlBody = `
    <h2>Client Feedback Received</h2>
    <p><strong>Client:</strong> ${clientName}</p>
    <p><strong>About:</strong> ${yourName}</p>
    <hr/>
    <h3>Ratings</h3>
    <ul>
      ${feedback.ratings.map((r) => `<li><strong>${r.category}:</strong> ${r.score}/5</li>`).join('')}
    </ul>
    <h3>What went well?</h3>
    <p>${feedback.wentWell || 'No response'}</p>
    <h3>What could be improved?</h3>
    <p>${feedback.couldImprove || 'No response'}</p>
    <h3>Would recommend?</h3>
    <p>${feedback.wouldRecommend ? 'Yes' : 'No'}</p>
    ${feedback.additionalComments ? `<h3>Additional Comments</h3><p>${feedback.additionalComments}</p>` : ''}
  `;

    const textBody = `
Client Feedback Received
========================
Client: ${clientName}
About: ${yourName}

Ratings:
${ratingsSummary}

What went well?
${feedback.wentWell || 'No response'}

What could be improved?
${feedback.couldImprove || 'No response'}

Would recommend: ${feedback.wouldRecommend ? 'Yes' : 'No'}

${feedback.additionalComments ? `Additional Comments:\n${feedback.additionalComments}` : ''}
  `;

    const command = new SendEmailCommand({
        Source: process.env.SES_FROM_EMAIL,
        Destination: {
            ToAddresses: [managerEmail],
        },
        Message: {
            Subject: {
                Data: `Client Feedback: ${clientName} → ${yourName}`,
            },
            Body: {
                Html: { Data: htmlBody },
                Text: { Data: textBody },
            },
        },
    });

    await ses.send(command);
}
