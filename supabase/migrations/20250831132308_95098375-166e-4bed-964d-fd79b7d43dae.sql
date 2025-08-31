-- Add shipping address fields to quiet_start_signups table
ALTER TABLE public.quiet_start_signups 
ADD COLUMN shipping_name TEXT,
ADD COLUMN shipping_address_line1 TEXT,
ADD COLUMN shipping_address_line2 TEXT,
ADD COLUMN shipping_city TEXT,
ADD COLUMN shipping_state TEXT,
ADD COLUMN shipping_postal_code TEXT,
ADD COLUMN shipping_country TEXT DEFAULT 'United States',
ADD COLUMN address_collected_at TIMESTAMP WITH TIME ZONE;