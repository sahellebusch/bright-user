CREATE OR REPLACE FUNCTION touch_updated_column()
  RETURNS TRIGGER AS
$$
BEGIN
  IF ROW (NEW.*) IS DISTINCT FROM ROW (OLD.*)
  THEN
    NEW.updated = now();
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$$
  LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS "user"
(
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL
);

DROP TRIGGER IF EXISTS update_user ON "user";

CREATE TRIGGER update_user
  BEFORE UPDATE
  ON "user"
  FOR EACH ROW
EXECUTE PROCEDURE touch_updated_column();
