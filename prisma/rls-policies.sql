-- Supabase Row Level Security (RLS) Policies for MenuPRO
-- Run these SQL commands in your Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user ID from JWT
CREATE OR REPLACE FUNCTION auth.uid_text() RETURNS TEXT
LANGUAGE SQL STABLE
AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    ),
    ''
  )::text
$$;

-- Helper function to get restaurant ID from JWT claims
CREATE OR REPLACE FUNCTION auth.restaurant_id() RETURNS TEXT
LANGUAGE SQL STABLE
AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claim.restaurant_id', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'restaurant_id')
    ),
    ''
  )::text
$$;

-- Helper function to get user role from JWT claims
CREATE OR REPLACE FUNCTION auth.user_role() RETURNS TEXT
LANGUAGE SQL STABLE
AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claim.role', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
    ),
    ''
  )::text
$$;

-- Helper function to check if user has membership in restaurant
CREATE OR REPLACE FUNCTION auth.has_restaurant_access(restaurant_id TEXT) RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM memberships 
    WHERE "userId" = auth.uid_text() 
    AND "restaurantId" = restaurant_id 
    AND "isActive" = true
  );
$$;

-- Helper function to check if user has specific role in restaurant
CREATE OR REPLACE FUNCTION auth.has_restaurant_role(restaurant_id TEXT, required_role TEXT) RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM memberships 
    WHERE "userId" = auth.uid_text() 
    AND "restaurantId" = restaurant_id 
    AND role = required_role::public."MembershipRole"
    AND "isActive" = true
  );
$$;

-- Helper function to check if user has minimum role level
CREATE OR REPLACE FUNCTION auth.has_min_role(restaurant_id TEXT, min_role TEXT) RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM memberships 
    WHERE "userId" = auth.uid_text() 
    AND "restaurantId" = restaurant_id 
    AND CASE min_role
      WHEN 'CUSTOMER' THEN role IN ('CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN', 'OWNER')
      WHEN 'STAFF' THEN role IN ('STAFF', 'MANAGER', 'ADMIN', 'OWNER')
      WHEN 'MANAGER' THEN role IN ('MANAGER', 'ADMIN', 'OWNER')
      WHEN 'ADMIN' THEN role IN ('ADMIN', 'OWNER')
      WHEN 'OWNER' THEN role = 'OWNER'
      ELSE false
    END
    AND "isActive" = true
  );
$$;

-- USERS TABLE POLICIES
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = auth.uid_text());

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid_text());

-- Restaurant staff can view users in their restaurant
CREATE POLICY "Restaurant staff can view restaurant users" ON users
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM memberships m1
      INNER JOIN memberships m2 ON m1."restaurantId" = m2."restaurantId"
      WHERE m1."userId" = auth.uid_text()
      AND m2."userId" = users.id
      AND m1."isActive" = true
      AND m2."isActive" = true
      AND auth.has_min_role(m1."restaurantId", 'STAFF')
    )
  );

-- RESTAURANTS TABLE POLICIES
-- Restaurant members can view their restaurants
CREATE POLICY "Restaurant members can view restaurants" ON restaurants
  FOR SELECT USING (auth.has_restaurant_access(id));

-- Only owners and admins can update restaurants
CREATE POLICY "Admins can update restaurants" ON restaurants
  FOR UPDATE USING (auth.has_min_role(id, 'ADMIN'));

-- Only owners can delete restaurants
CREATE POLICY "Owners can delete restaurants" ON restaurants
  FOR DELETE USING (auth.has_restaurant_role(id, 'OWNER'));

-- MEMBERSHIPS TABLE POLICIES
-- Users can view memberships where they are involved
CREATE POLICY "Users can view own memberships" ON memberships
  FOR SELECT USING (
    "userId" = auth.uid_text() OR 
    auth.has_min_role("restaurantId", 'MANAGER')
  );

-- Managers and above can manage memberships
CREATE POLICY "Managers can manage memberships" ON memberships
  FOR ALL USING (auth.has_min_role("restaurantId", 'MANAGER'));

-- TABLES TABLE POLICIES
-- Restaurant staff can view and manage tables
CREATE POLICY "Restaurant staff can view tables" ON tables
  FOR SELECT USING (auth.has_min_role("restaurantId", 'STAFF'));

CREATE POLICY "Restaurant managers can manage tables" ON tables
  FOR ALL USING (auth.has_min_role("restaurantId", 'MANAGER'));

-- MENU_VERSIONS TABLE POLICIES
-- Restaurant staff can view menu versions
CREATE POLICY "Restaurant staff can view menu versions" ON menu_versions
  FOR SELECT USING (auth.has_min_role("restaurantId", 'STAFF'));

-- Customers can view published menu versions
CREATE POLICY "Customers can view published menus" ON menu_versions
  FOR SELECT USING (
    "isPublished" = true AND 
    auth.has_restaurant_access("restaurantId")
  );

-- Managers can manage menu versions
CREATE POLICY "Managers can manage menu versions" ON menu_versions
  FOR ALL USING (auth.has_min_role("restaurantId", 'MANAGER'));

-- MENU_ITEMS TABLE POLICIES
-- Restaurant staff can view menu items
CREATE POLICY "Restaurant staff can view menu items" ON menu_items
  FOR SELECT USING (auth.has_min_role("restaurantId", 'STAFF'));

-- Customers can view menu items from published versions
CREATE POLICY "Customers can view published menu items" ON menu_items
  FOR SELECT USING (
    auth.has_restaurant_access("restaurantId") AND
    EXISTS(
      SELECT 1 FROM menu_versions mv 
      WHERE mv.id = "menuVersionId" 
      AND mv."isPublished" = true
    )
  );

-- Managers can manage menu items
CREATE POLICY "Managers can manage menu items" ON menu_items
  FOR ALL USING (auth.has_min_role("restaurantId", 'MANAGER'));

-- ORDERS TABLE POLICIES
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING ("userId" = auth.uid_text());

-- Restaurant staff can view restaurant orders
CREATE POLICY "Restaurant staff can view restaurant orders" ON orders
  FOR SELECT USING (auth.has_min_role("restaurantId", 'STAFF'));

-- Customers can create orders
CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (
    auth.has_restaurant_access("restaurantId") AND
    ("userId" = auth.uid_text() OR "userId" IS NULL)
  );

-- Restaurant staff can update order status
CREATE POLICY "Restaurant staff can update orders" ON orders
  FOR UPDATE USING (auth.has_min_role("restaurantId", 'STAFF'));

-- ORDER_ITEMS TABLE POLICIES
-- Users can view order items for their orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM orders o 
      WHERE o.id = "orderId" 
      AND (
        o."userId" = auth.uid_text() OR 
        auth.has_min_role(o."restaurantId", 'STAFF')
      )
    )
  );

-- Order items can be inserted with orders
CREATE POLICY "Order items can be created with orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM orders o 
      WHERE o.id = "orderId" 
      AND (
        o."userId" = auth.uid_text() OR 
        auth.has_restaurant_access(o."restaurantId")
      )
    )
  );

-- Restaurant staff can update order items
CREATE POLICY "Restaurant staff can update order items" ON order_items
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM orders o 
      WHERE o.id = "orderId" 
      AND auth.has_min_role(o."restaurantId", 'STAFF')
    )
  );

-- AUDIT_LOGS TABLE POLICIES
-- Restaurant admins can view audit logs for their restaurant
CREATE POLICY "Admins can view restaurant audit logs" ON audit_logs
  FOR SELECT USING (
    auth.has_min_role("restaurantId", 'ADMIN') OR
    "userId" = auth.uid_text()
  );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create indexes for RLS performance
CREATE INDEX IF NOT EXISTS idx_memberships_user_restaurant ON memberships("userId", "restaurantId");
CREATE INDEX IF NOT EXISTS idx_memberships_restaurant_role ON memberships("restaurantId", role);
CREATE INDEX IF NOT EXISTS idx_orders_user_restaurant ON orders("userId", "restaurantId");
CREATE INDEX IF NOT EXISTS idx_menu_versions_published ON menu_versions("restaurantId", "isPublished");

-- Comments for documentation
COMMENT ON FUNCTION auth.uid_text() IS 'Get current user ID from JWT token';
COMMENT ON FUNCTION auth.restaurant_id() IS 'Get restaurant ID from JWT claims';
COMMENT ON FUNCTION auth.user_role() IS 'Get user role from JWT claims';
COMMENT ON FUNCTION auth.has_restaurant_access(TEXT) IS 'Check if user has access to restaurant';
COMMENT ON FUNCTION auth.has_restaurant_role(TEXT, TEXT) IS 'Check if user has specific role in restaurant';
COMMENT ON FUNCTION auth.has_min_role(TEXT, TEXT) IS 'Check if user has minimum role level in restaurant';