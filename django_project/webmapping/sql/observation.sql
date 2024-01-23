CREATE OR REPLACE VIEW public.minisass_observations
 AS
 with filtered as (
 SELECT sites.gid AS sites_gid,
    sites.river_name,
    sites.site_name,
    sites.description as site_description,
    sites.river_cat,
    observations.gid AS observations_gid,
    observations.score,
    observations.water_clarity,
    observations.water_temp,
    observations.ph,
    observations.diss_oxygen,
    observations.diss_oxygen_unit,
    observations.elec_cond,
    observations.elec_cond_unit,
    observations.obs_date,
    observations.comment,
    observations.flatworms,
    observations.worms,
    observations.leeches,
    observations.crabs_shrimps,
    observations.stoneflies,
    observations.minnow_mayflies,
    observations.other_mayflies,
    observations.damselflies,
    observations.dragonflies,
    observations.bugs_beetles,
    observations.caddisflies,
    observations.true_flies,
    observations.snails,
    observations.flag,
    auth_user.username,
    minisass_authentication_userprofile.organisation_name,
    minisass_authentication_lookup.description AS organisation_type,
	sites.the_geom,
    st_x(sites.the_geom) AS x,
    st_y(sites.the_geom) AS y,
	ROW_NUMBER() OVER(PARTITION BY sites.gid
                                 ORDER BY observations.obs_date DESC) AS rank
   FROM sites
     LEFT JOIN observations ON sites.gid = observations.site_id
     LEFT JOIN auth_user ON observations.user_id = auth_user.id
     LEFT JOIN minisass_authentication_userprofile ON auth_user.id = minisass_authentication_userprofile.user_id
     LEFT JOIN minisass_authentication_lookup ON minisass_authentication_userprofile.organisation_type_id = minisass_authentication_lookup.id
	 LEFT JOIN monitor_siteimage ON sites.gid = monitor_siteimage.site_id
	 LEFT JOIN monitor_observationpestimage ON observations.gid = monitor_observationpestimage.observation_id
  ORDER BY observations.obs_date asc  )
  select * from filtered where rank = 1;