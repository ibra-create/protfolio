-- Migration: 009_persistent_rate_limit.sql
-- Creates a persistent cross-isolate rate-limit table for portfolio-chat.
-- No raw IP addresses are stored; only SHA-256 hashed anonymous identifiers.

CREATE TABLE IF NOT EXISTS chat_rate_limit (
  key_hash        TEXT NOT NULL,
  minute_ts       BIGINT NOT NULL,
  minute_count    INT NOT NULL DEFAULT 0,
  day_ts          BIGINT NOT NULL,
  day_count       INT NOT NULL DEFAULT 0,
  last_seen       BIGINT NOT NULL,
  PRIMARY KEY (key_hash)
);

CREATE INDEX IF NOT EXISTS chat_rate_limit_last_seen_idx ON chat_rate_limit (last_seen);

ALTER TABLE chat_rate_limit ENABLE ROW LEVEL SECURITY;
-- No anon policies: access is exclusively via the SECURITY DEFINER function below.

CREATE OR REPLACE FUNCTION check_chat_rate_limit(
  p_key_hash TEXT,
  p_requests_per_minute INT DEFAULT 10,
  p_requests_per_day INT DEFAULT 50
) RETURNS TABLE (allowed BOOLEAN, retry_after_seconds INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  now_ms BIGINT := EXTRACT(EPOCH FROM NOW())::BIGINT * 1000;
  min_ts BIGINT := (now_ms / 60000) * 60000;
  v_day_ts BIGINT;
  rec chat_rate_limit;
  is_allowed BOOLEAN;
  retry_secs INT := 0;
BEGIN
  v_day_ts := EXTRACT(EPOCH FROM DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC'))::BIGINT * 1000;

  IF random() < 0.01 THEN
    DELETE FROM chat_rate_limit WHERE last_seen < (now_ms - 90000000);
  END IF;

  INSERT INTO chat_rate_limit (key_hash, minute_ts, minute_count, day_ts, day_count, last_seen)
  VALUES (p_key_hash, min_ts, 1, v_day_ts, 1, now_ms)
  ON CONFLICT (key_hash) DO UPDATE SET
    minute_count = CASE WHEN chat_rate_limit.minute_ts = min_ts THEN chat_rate_limit.minute_count + 1 ELSE 1 END,
    minute_ts    = min_ts,
    day_count    = CASE WHEN chat_rate_limit.day_ts = v_day_ts THEN chat_rate_limit.day_count + 1 ELSE 1 END,
    day_ts       = v_day_ts,
    last_seen    = now_ms
  RETURNING * INTO rec;

  IF rec.minute_count > p_requests_per_minute THEN
    is_allowed := FALSE;
    retry_secs := 60 - ((now_ms % 60000) / 1000)::INT;
  ELSIF rec.day_count > p_requests_per_day THEN
    is_allowed := FALSE;
    retry_secs := (86400 - EXTRACT(EPOCH FROM NOW() - DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC'))::INT);
  ELSE
    is_allowed := TRUE;
  END IF;

  RETURN QUERY SELECT is_allowed, retry_secs;
END;
$$;
