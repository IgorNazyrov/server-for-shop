ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_shipping_information_check,
DROP CONSTRAINT IF EXISTS products_return_policy_check;

ALTER TABLE products 
ALTER COLUMN shipping_information TYPE TEXT,
ALTER COLUMN availability_status TYPE TEXT,
ALTER COLUMN return_policy TYPE TEXT;