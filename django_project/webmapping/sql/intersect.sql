CREATE OR REPLACE FUNCTION point_intersects_admin(lat double precision, long double precision)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_countries b
    WHERE ST_Intersects(b.geom, ST_SetSRID(ST_MakePoint(long, lat), 4326))
  );
END;
$$ LANGUAGE plpgsql;

-- Usage SELECT point_intersects_admin(40.7128, -74.0060) AS intersects; will return true if it intersects