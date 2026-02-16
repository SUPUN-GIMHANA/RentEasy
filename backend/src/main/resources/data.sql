-- Initial data for testing
INSERT INTO users (id, email, password, first_name, last_name, role, active, email_verified, created_at, updated_at) 
VALUES 
('admin-001', 'admin@renteasy.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'User', 'ADMIN', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-001', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'John', 'Doe', 'USER', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('anon-user', 'anonymous@renteasy.local', 'anonymous', 'Anonymous', 'User', 'USER', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample Items with Categories and Subcategories

-- VEHICLES - Cars
INSERT INTO items (id, name, description, category, subcategory, price, location, owner_id, available, views, boosted, created_at) 
VALUES 
('item-car-001', 'Toyota Camry 2020', 'Well-maintained sedan, perfect for city travel', 'vehicles', 'Cars', 5000.00, 'Colombo', 'anon-user', true, 5, false, CURRENT_TIMESTAMP),
('item-car-002', 'Honda Civic Hybrid', 'Fuel-efficient family car', 'vehicles', 'Cars', 4500.00, 'Colombo', 'anon-user', true, 3, false, CURRENT_TIMESTAMP),
('item-car-003', 'BMW 3 Series', 'Luxury sedan with premium features', 'vehicles', 'Cars', 8000.00, 'Colombo', 'anon-user', true, 10, false, CURRENT_TIMESTAMP);

-- VEHICLES - Motorbikes
INSERT INTO items (id, name, description, category, subcategory, price, location, owner_id, available, views, boosted, created_at) 
VALUES 
('item-bike-001', 'Harley Davidson', 'Classic motorcycle', 'vehicles', 'Motorbikes', 6000.00, 'Colombo', 'anon-user', true, 8, false, CURRENT_TIMESTAMP),
('item-bike-002', 'Royal Enfield', 'Reliable cruiser bike', 'vehicles', 'Motorbikes', 3500.00, 'Colombo', 'anon-user', true, 12, false, CURRENT_TIMESTAMP);

-- VEHICLES - Bicycles
INSERT INTO items (id, name, description, category, subcategory, price, location, owner_id, available, views, boosted, created_at) 
VALUES 
('item-bicycle-001', 'Mountain Bike', 'Professional grade mountain bike', 'vehicles', 'Bicycles', 500.00, 'Colombo', 'anon-user', true, 4, false, CURRENT_TIMESTAMP);

-- CLOTHING - Party Costumes
INSERT INTO items (id, name, description, category, subcategory, price, location, owner_id, available, views, boosted, created_at) 
VALUES 
('item-costume-001', 'Princess Costume', 'Beautiful princess dress for parties', 'clothing', 'Party costumes', 300.00, 'Colombo', 'anon-user', true, 7, false, CURRENT_TIMESTAMP),
('item-costume-002', 'Superhero Outfit', 'Complete superhero costume', 'clothing', 'Party costumes', 250.00, 'Colombo', 'anon-user', true, 6, false, CURRENT_TIMESTAMP);

-- ELECTRONICS - Cameras
INSERT INTO items (id, name, description, category, subcategory, price, location, owner_id, available, views, boosted, created_at) 
VALUES 
('item-camera-001', 'Canon EOS R5', 'Professional digital camera', 'electronics', 'Cameras', 4000.00, 'Colombo', 'anon-user', true, 15, false, CURRENT_TIMESTAMP),
('item-camera-002', 'Sony A7III', 'High-resolution mirrorless camera', 'electronics', 'Cameras', 3500.00, 'Colombo', 'anon-user', true, 10, false, CURRENT_TIMESTAMP);

-- ELECTRONICS - Laptops
INSERT INTO items (id, name, description, category, subcategory, price, location, owner_id, available, views, boosted, created_at) 
VALUES 
('item-laptop-001', 'MacBook Pro 16', 'High-performance laptop', 'electronics', 'Laptops/monitors/projectors', 2000.00, 'Colombo', 'anon-user', true, 20, false, CURRENT_TIMESTAMP);

-- SPORTS - Outdoor Courts
INSERT INTO items (id, name, description, category, subcategory, price, location, owner_id, available, views, boosted, created_at) 
VALUES 
('item-sports-001', 'Tennis Court', 'Professional outdoor court', 'sports', 'Outdoor courts', 200.00, 'Colombo', 'anon-user', true, 8, false, CURRENT_TIMESTAMP);

-- PROPERTIES - Apartments
INSERT INTO items (id, name, description, category, subcategory, price, location, owner_id, available, views, boosted, created_at) 
VALUES 
('item-prop-001', 'Luxury Apartment', '2-bedroom apartment in city center', 'properties', 'Apartments/Houses', 2500.00, 'Colombo', 'anon-user', true, 12, false, CURRENT_TIMESTAMP);
