-- Add company/institution URL columns
ALTER TABLE experience ADD COLUMN IF NOT EXISTS company_url TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS institution_url TEXT;
