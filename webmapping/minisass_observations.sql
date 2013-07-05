-- View: minisass_observations

DROP VIEW minisass_observations;

CREATE OR REPLACE VIEW minisass_observations AS 
 SELECT sites.gid AS sites_gid, sites.the_geom, st_x(sites.the_geom) AS x, st_y(sites.the_geom) AS y, sites.river_name, sites.site_name, sites.description, sites.river_cat, observations.gid AS observations_gid, observations.score, observations.obs_date, observations.comment, observations.flatworms, observations.worms, observations.leeches, observations.crabs_shrimps, observations.stoneflies, observations.minnow_mayflies, observations.other_mayflies, observations.damselflies, observations.dragonflies, observations.bugs_beetles, observations.caddisflies, observations.true_flies, observations.snails, observations.flag
   FROM sites
   LEFT JOIN observations ON sites.gid = observations.site
  ORDER BY observations.obs_date;

ALTER TABLE minisass_observations
  OWNER TO minisass;

GRANT SELECT ON TABLE public.minisass_observations TO web_read;
