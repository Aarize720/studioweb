-- Migration: Add 'completed' status to orders table
-- Date: 2024

-- Drop the existing constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new constraint with 'completed' status
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'));