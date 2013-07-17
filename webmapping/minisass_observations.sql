-- View: minisass_observations

DROP VIEW minisass_observations;

CREATE OR REPLACE VIEW minisass_observations AS 
 SELECT sites.gid AS sites_gid, sites.the_geom, st_x(sites.the_geom) AS x,
        st_y(sites.the_geom) AS y, sites.river_name, sites.site_name,
        sites.description, sites.river_cat, observations.gid AS observations_gid,
        observations.score, observations.obs_date, observations.comment,
        observations.flatworms, observations.worms, observations.leeches,
        observations.crabs_shrimps, observations.stoneflies, observations.minnow_mayflies,
        observations.other_mayflies, observations.damselflies, observations.dragonflies,
        observations.bugs_beetles, observations.caddisflies, observations.true_flies,
        observations.snails, observations.flag, auth_user.username,
        minisass_registration_userprofile.organisation_name,
        minisass_registration_lookup.description as organisation_type
   FROM sites
   LEFT JOIN observations ON sites.gid = observations.site
   LEFT JOIN auth_user ON observations.user_id = auth_user.id
   LEFT JOIN minisass_registration_userprofile ON auth_user.id = minisass_registration_userprofile.user_id
   LEFT JOIN minisass_registration_lookup ON minisass_registration_userprofile.organisation_type_id = minisass_registration_lookup.id
   ORDER BY observations.obs_date;

ALTER TABLE minisass_observations
  OWNER TO minisass;

GRANT SELECT ON TABLE public.minisass_observations TO web_read;
