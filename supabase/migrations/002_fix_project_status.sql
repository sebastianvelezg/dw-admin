-- Fix Project Status Values
-- This migration updates the project status values to match the application's requirements

-- Drop the old constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add new constraint with correct status values
ALTER TABLE projects ADD CONSTRAINT projects_status_check
  CHECK (status IN ('Planeación', 'En progreso', 'En revisión', 'Completado', 'En pausa'));

-- Update the default value
ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'En progreso';

-- Migrate any existing data (if any)
-- Update 'Pendiente' to 'Planeación'
UPDATE projects SET status = 'Planeación' WHERE status = 'Pendiente';

-- Update 'En Progreso' to 'En progreso' (case fix)
UPDATE projects SET status = 'En progreso' WHERE status = 'En Progreso';

-- Update 'Cancelado' to 'En pausa'
UPDATE projects SET status = 'En pausa' WHERE status = 'Cancelado';
