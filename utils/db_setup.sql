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

--extra fields added 30 Oct 2014
  alter TABLE observations add column water_clarity numeric(6,1);
 alter TABLE observations add column  water_temp numeric(4,1);
alter TABLE observations add column   ph numeric(4,1);
alter TABLE observations add column   diss_oxygen numeric(4,2);
 alter TABLE observations add column  diss_oxygen_unit character varying(6);
 alter TABLE observations add column  elec_cond numeric(4,2);
 alter TABLE observations add column  elec_cond_unit character varying(6);




