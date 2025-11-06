# Supabase Database Setup

This directory contains the database migrations for the DW Admin application.

## Setup Instructions

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push the migrations
supabase db push
```

## Database Schema

The migration creates the following tables:

### Core Tables
- **clients** - Client information and contact details
- **projects** - Projects with budget, deadlines, and progress tracking
- **tasks** - Project tasks with status and assignments
- **meetings** - Project meetings with attendees and notes
- **project_links** - External links (repos, designs, docs, etc.)
- **team_members** - Team members assigned to projects
- **payment_milestones** - Payment tracking with percentages

### Financial Tables
- **invoices** - Invoice records
- **invoice_items** - Line items for invoices
- **quotes** - Quote/proposal records
- **quote_items** - Line items for quotes

## Security

All tables have Row Level Security (RLS) enabled. Users can only:
- View their own data
- Insert their own data
- Update their own data
- Delete their own data

This ensures complete data isolation between users.

## Features

- **Automatic timestamps** - All tables have `created_at` and `updated_at` fields
- **Cascade deletes** - Related data is automatically cleaned up
- **Foreign key constraints** - Data integrity is maintained
- **Indexes** - Optimized queries for common operations
- **Check constraints** - Data validation at database level
