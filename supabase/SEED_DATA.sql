-- Optional seed data for development
-- Run after migrations

-- Departments
INSERT INTO departments (name, description) VALUES
  ('Housekeeping', 'Room cleaning and maintenance'),
  ('Front Office', 'Guest check-in and reservations'),
  ('Maintenance', 'Repairs and upkeep');

-- Roles
INSERT INTO roles (name, description) VALUES
  ('Supervisor', 'Can manage staff and assignments'),
  ('Room Attendant', 'Cleans and prepares rooms'),
  ('Inspector', 'Quality checks rooms');

-- Shifts
INSERT INTO shifts (name, start_time, end_time) VALUES
  ('AM', '06:00', '14:00'),
  ('PM', '14:00', '22:00'),
  ('Night', '22:00', '06:00');

-- Consumables categories
INSERT INTO consumables (name, category, unit_price, billable) VALUES
  ('Mini Bar - Water', 'mini_bar', 5.00, true),
  ('Mini Bar - Coke', 'mini_bar', 4.00, true),
  ('Laundry - Shirt', 'laundry', 8.00, true),
  ('Towels - Extra', 'towels', 0, false);
