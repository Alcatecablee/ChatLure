# Set password environment variable
$env:PGPASSWORD = "npg_cq8B5QlGCZAk"

# Database connection details
$dbUrl = "postgresql://neondb_owner:npg_cq8B5QlGCZAk@ep-black-bar-a28eaye5.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require"

Write-Host "Restoring database from chatlure_backup.sql..."
Write-Host "This may take a few moments..."

# Restore the database
psql $dbUrl -f chatlure_backup.sql

Write-Host "Database restore completed!" 