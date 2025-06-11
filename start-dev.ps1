# Set environment variables
$env:NODE_ENV = "development"
$env:DATABASE_URL = "postgresql://neondb_owner:npg_cq8B5QlGCZAk@ep-black-bar-a28eaye5.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require"
$env:SESSION_SECRET = "your-super-secret-session-key"

# Clerk environment variables (you need to set these with your actual keys)
$env:CLERK_PUBLISHABLE_KEY = "pk_test_bmF0aXZlLXB1cC0zOS5jbGVyay5hY2NvdW50cy5kZXYk"
$env:CLERK_SECRET_KEY = "sk_test_4Dlrf4WsNBLJbWP7vvoDr1HsR34w3AU443gnLnXczR"
$env:VITE_CLERK_PUBLISHABLE_KEY = "pk_test_bmF0aXZlLXB1cC0zOS5jbGVyay5hY2NvdW50cy5kZXYk"

# Start the development server
Write-Host "Starting ChatLure development server..."
Write-Host "Database: Connected to Neon PostgreSQL"
Write-Host "Environment: Development"
Write-Host ""

npx tsx server/index.ts 