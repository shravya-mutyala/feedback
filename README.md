# Client Feedback App

A serverless application for collecting client feedback and routing it to their manager via email.

## Architecture

```
Client Browser → CloudFront → S3 (React app)
                                    ↓
                            API Gateway → Lambda → DynamoDB
                                                 → SES (email to manager)
```

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js 20 Lambda functions
- **Infrastructure**: AWS SAM (API Gateway, Lambda, DynamoDB, S3, CloudFront, SES)
- **Email**: Amazon SES

## Prerequisites

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured with appropriate permissions
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [Node.js 20+](https://nodejs.org/)
- A verified email address in Amazon SES (for sending feedback emails)

## Project Structure

```
feedback-app/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackForm.jsx   # Main feedback form
│   │   │   ├── StarRating.jsx     # Star rating component
│   │   │   ├── ThankYou.jsx       # Success page
│   │   │   └── NotFound.jsx       # 404 page
│   │   ├── App.jsx                # Landing page
│   │   ├── config.js              # API URL config
│   │   └── main.jsx               # Entry point
│   └── package.json
├── backend/                  # Lambda functions
│   ├── src/
│   │   ├── handlers/
│   │   │   ├── createLink.js      # POST /links - generate feedback link
│   │   │   ├── getLink.js         # GET /links/{token} - get link info
│   │   │   └── submitFeedback.js  # POST /feedback - submit & email
│   │   └── utils/
│   │       ├── response.js        # API response helpers
│   │       └── email.js           # SES email helper
│   └── package.json
├── infrastructure/           # AWS SAM template
│   ├── template.yaml
│   └── samconfig.toml
├── deploy.sh                 # One-command deployment script
└── README.md
```

## Setup & Deployment

### 1. Verify your sender email in SES

```bash
aws ses verify-email-identity --email-address your-email@example.com
```

> Note: If your SES account is in sandbox mode, you'll also need to verify recipient (manager) emails.

### 2. Update configuration

Edit `infrastructure/samconfig.toml` and set your verified email:

```toml
parameter_overrides = "SenderEmail=your-verified-email@example.com"
```

### 3. Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

Or deploy manually:

```bash
# Backend
cd backend && npm install && cd ..

# SAM
cd infrastructure
sam build
sam deploy
cd ..

# Frontend (after getting API URL from SAM output)
cd frontend
npm install
VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod npm run build
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

## Usage

### Creating a Feedback Link

```bash
curl -X POST https://your-api-url/prod/links \
  -H 'Content-Type: application/json' \
  -d '{
    "clientName": "Jane Smith",
    "managerEmail": "jane.manager@company.com",
    "yourName": "Your Name",
    "expiresInDays": 30
  }'
```

Response:
```json
{
  "token": "abc123-uuid",
  "feedbackUrl": "https://your-cloudfront-url/feedback/abc123-uuid",
  "expiresAt": "2026-09-12T00:00:00.000Z"
}
```

### Send the Link

Share the `feedbackUrl` with your client. They'll see a personalized form and can submit feedback without logging in.

### What Happens on Submit

1. Feedback is saved to DynamoDB
2. The link is marked as "used" (one-time use)
3. A formatted email with ratings and comments is sent to the manager via SES

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:3000. Set `VITE_API_URL` in a `.env` file to point to your API.

### Backend (with SAM local)

```bash
cd infrastructure
sam local start-api
```

This starts a local API Gateway at http://localhost:3000.

## Cost Estimate

For light usage (~50 submissions/month):
- **Lambda**: Free tier (1M requests/month)
- **DynamoDB**: Free tier (25 read/write capacity units)
- **API Gateway**: Free tier (1M API calls/month)
- **S3 + CloudFront**: ~$0.50/month
- **SES**: $0.10 per 1000 emails

**Total: Effectively free for small-scale use.**
