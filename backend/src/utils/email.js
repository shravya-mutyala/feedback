import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient();

/**
 * Send feedback summary email to the manager
 */
export async function sendFeedbackEmail({ managerEmail, clientName, yourName, feedback }) {
    const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1e293b; margin-bottom: 24px;">Client Feedback Received</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 100px;">Client:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${clientName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">About:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${yourName}</td>
        </tr>
      </table>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

      <h3 style="color: #1e293b; margin-bottom: 8px;">Comments</h3>
      <p style="color: #334155; line-height: 1.6; background: #f8fafc; padding: 12px 16px; border-radius: 8px;">
        ${feedback.wentWell || 'No comments provided'}
      </p>

      <h3 style="color: #1e293b; margin-bottom: 8px;">Would recommend?</h3>
      <p style="color: #334155; font-weight: 500;">
        ${feedback.wouldRecommend ? '👍 Yes' : '👎 No'}
      </p>
    </div>
  `;

    const textBody = `
Client Feedback Received
========================

Client: ${clientName}
About: ${yourName}

Comments:
${feedback.wentWell || 'No comments provided'}

Would recommend: ${feedback.wouldRecommend ? 'Yes' : 'No'}
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
