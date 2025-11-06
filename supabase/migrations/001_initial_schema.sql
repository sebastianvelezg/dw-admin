-- DW Admin Database Schema
-- This migration creates all necessary tables for the DW Admin application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- CLIENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo', 'Prospecto')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- ==============================================
-- PROJECTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'En Progreso' CHECK (status IN ('Pendiente', 'En Progreso', 'Completado', 'Cancelado')),
  priority TEXT DEFAULT 'Media' CHECK (priority IN ('Baja', 'Media', 'Alta')),
  category TEXT,
  start_date DATE NOT NULL,
  deadline DATE,
  budget DECIMAL(12, 2) DEFAULT 0,
  spent DECIMAL(12, 2) DEFAULT 0,
  total_paid DECIMAL(12, 2) DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ==============================================
-- TASKS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En Progreso', 'Completado', 'Cancelada')),
  priority TEXT DEFAULT 'Media' CHECK (priority IN ('Baja', 'Media', 'Alta')),
  assigned_to TEXT,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- ==============================================
-- MEETINGS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS meetings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in minutes
  location TEXT,
  attendees TEXT[], -- Array of attendee names
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_project_id ON meetings(project_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);

-- ==============================================
-- PROJECT LINKS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS project_links (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'Other' CHECK (type IN ('Repository', 'Design', 'Documentation', 'Deployment', 'Other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_links_user_id ON project_links(user_id);
CREATE INDEX IF NOT EXISTS idx_project_links_project_id ON project_links(project_id);

-- ==============================================
-- TEAM MEMBERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS team_members (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_project_id ON team_members(project_id);

-- ==============================================
-- PAYMENT MILESTONES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS payment_milestones (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  percentage INTEGER NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Pagada', 'Vencida')),
  due_date DATE,
  paid_date DATE,
  invoice_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_milestones_user_id ON payment_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_milestones_project_id ON payment_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_payment_milestones_status ON payment_milestones(status);

-- ==============================================
-- INVOICES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS invoices (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Borrador', 'Enviada', 'Pagada', 'Vencida', 'Cancelada')),
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

-- ==============================================
-- INVOICE ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id BIGINT REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_user_id ON invoice_items(user_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- ==============================================
-- QUOTES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS quotes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
  quote_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  title TEXT,
  issue_date DATE NOT NULL,
  valid_until DATE NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Borrador' CHECK (status IN ('Borrador', 'Enviada', 'Aceptada', 'Rechazada', 'Expirada')),
  accepted_date DATE,
  rejected_date DATE,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);

-- ==============================================
-- QUOTE ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS quote_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quote_id BIGINT REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quote_items_user_id ON quote_items(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);

-- ==============================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_links_updated_at BEFORE UPDATE ON project_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_milestones_updated_at BEFORE UPDATE ON payment_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_items_updated_at BEFORE UPDATE ON invoice_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_items_updated_at BEFORE UPDATE ON quote_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Users can view their own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Meetings policies
CREATE POLICY "Users can view their own meetings" ON meetings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meetings" ON meetings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meetings" ON meetings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meetings" ON meetings FOR DELETE USING (auth.uid() = user_id);

-- Project links policies
CREATE POLICY "Users can view their own project links" ON project_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own project links" ON project_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own project links" ON project_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own project links" ON project_links FOR DELETE USING (auth.uid() = user_id);

-- Team members policies
CREATE POLICY "Users can view their own team members" ON team_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own team members" ON team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own team members" ON team_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own team members" ON team_members FOR DELETE USING (auth.uid() = user_id);

-- Payment milestones policies
CREATE POLICY "Users can view their own payment milestones" ON payment_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payment milestones" ON payment_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payment milestones" ON payment_milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payment milestones" ON payment_milestones FOR DELETE USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view their own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own invoices" ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own invoices" ON invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own invoices" ON invoices FOR DELETE USING (auth.uid() = user_id);

-- Invoice items policies
CREATE POLICY "Users can view their own invoice items" ON invoice_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own invoice items" ON invoice_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own invoice items" ON invoice_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own invoice items" ON invoice_items FOR DELETE USING (auth.uid() = user_id);

-- Quotes policies
CREATE POLICY "Users can view their own quotes" ON quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quotes" ON quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quotes" ON quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quotes" ON quotes FOR DELETE USING (auth.uid() = user_id);

-- Quote items policies
CREATE POLICY "Users can view their own quote items" ON quote_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quote items" ON quote_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quote items" ON quote_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quote items" ON quote_items FOR DELETE USING (auth.uid() = user_id);
