--these are some extra things to run over and above what the django models set up

CREATE INDEX observations_user_id_idx
  ON observations
  USING btree
  (user_id);

CREATE INDEX observations_site_idx
  ON observations
  USING btree
  (site);

CREATE INDEX observations_obs_date_idx
  ON observations
  USING btree
  (obs_date);

CREATE INDEX sites_user_id_idx
  ON sites
  USING btree
  (user_id);



