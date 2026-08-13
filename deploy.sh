#!/bin/bash
# Deploy script for the Client Feedback App
# Prerequisites: AWS CLI configured, SAM CLI installed, Node.js installed

set -e

echo "=== Client Feedback App Deployment ==="

# Step 1: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Step 2: Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Set the API URL (update after first deploy)
echo "🔨 Building frontend..."
npm run build
cd ..

# Step 3: Deploy SAM stack
echo "🚀 Deploying SAM stack..."
cd infrastructure
sam build
sam deploy
cd ..

# Step 4: Get outputs
echo "📋 Getting stack outputs..."
API_URL=$(aws cloudformation describe-stacks \
  --stack-name client-feedback-app \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)

BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name client-feedback-app \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text)

CF_DISTRIBUTION=$(aws cloudformation describe-stacks \
  --stack-name client-feedback-app \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

CF_URL=$(aws cloudformation describe-stacks \
  --stack-name client-feedback-app \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontUrl`].OutputValue' \
  --output text)

echo ""
echo "API URL: $API_URL"
echo "CloudFront URL: https://$CF_URL"
echo ""

# Step 5: Rebuild frontend with correct API URL
echo "🔨 Rebuilding frontend with API URL..."
cd frontend
VITE_API_URL=$API_URL npm run build

# Step 6: Deploy frontend to S3
echo "📤 Uploading frontend to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# Step 7: Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CF_DISTRIBUTION \
  --paths "/*"

cd ..

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is live at: https://$CF_URL"
echo "🔗 API endpoint: $API_URL"
echo ""
echo "To create a feedback link, run:"
echo "  curl -X POST $API_URL/links \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"clientName\": \"John Doe\", \"managerEmail\": \"manager@company.com\", \"yourName\": \"Your Name\"}'"
