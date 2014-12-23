<#--
Body section of the GetFeatureInfo template, it's provided with one feature collection, and
will be called multiple times if there are various feature collections
-->
<#assign observation = 0>
<#list features as feature>
<#assign observation = observation + 1>
</#list>
${observation}#
<div id="observation_tabs">
  <#assign observation = 0>
  <#list features as feature>
  <#assign observation = observation + 1>
  <div id="id_tab_${observation}" class="x-hide-display">
    <input type="hidden" name="name_sites_gid_${observation}" value="${feature.sites_gid.value}" id="id_sites_gid_${observation}" />
    <table id="id_obs_${observation}" class="featureInfo">
      <tr>
        <td id="obs_site_details">
          <table id="obs_table_left">
            <tr><td class="section_header" colspan="2">Site Details</td></tr>
            <tr><td class="tdlabel">River name:</td><td class="tddata">${feature.river_name.value}</td></tr>
            <tr><td class="tdlabel">Site name:</td><td class="tddata">${feature.site_name.value}</td></tr>
            <tr><td class="tdlabel">Site description:</td><td class="tddata">${feature.description.value}</td></tr>
            <#if (feature.y.rawValue > 0)>
              <tr><td class="tdlabel">Latitude (N):</td><td class="tddata">${feature.y.rawValue?string("0.00000")}</td></tr>
            <#else>
              <tr><td class="tdlabel">Latitude (S):</td><td class="tddata">${feature.y.rawValue?string("0.00000")}</td></tr>
            </#if>
            <#if (feature.x.rawValue > 0)>
            <tr><td class="tdlabel">Longitude (E):</td><td class="tddata">${feature.x.rawValue?string("0.00000")}</td></tr>
            <#else>
            <tr><td class="tdlabel">Longitude (W):</td><td class="tddata">${feature.x.rawValue?string("0.00000")}</td></tr>
            </#if>
            <tr><td class="tdlabel">River category:</td><td class="tddata">${feature.river_cat.value}</td></tr>
            <tr><td class="section_header" colspan="2"><br />Observation Details</td></tr>
            <tr><td class="tdlabel">Date:</td><td class="tddata"><#if feature.obs_date.value != "">${feature.obs_date.value?date("yyyy/MM/dd")}</#if></td></tr>
            <tr><td class="tdlabel">Username:</td><td class="tddata">${feature.username.value}</td></tr>
            <tr><td class="tdlabel">Organisation type:</td><td class="tddata">${feature.organisation_type.value}</td></tr>
            <tr><td class="tdlabel">Organisation name:</td><td class="tddata">${feature.organisation_name.value}</td></tr>
            <tr><td class="tdlabel">Comments/notes:</td><td class="tddata">${feature.comment.value}</td></tr>
            <tr><td class="section_header" colspan="2"><br />Measured Parameters</td></tr>
            <tr><td class="tdlabel">Water clarity:</td><td>${feature.water_clarity.value} cm</td></tr>
            <tr><td class="tdlabel">Water temperature:</label></td><td>${feature.water_temp.value}&deg;C</td></tr>
            <tr><td class="tdlabel">pH:</label></td><td>${feature.ph.value}</td></tr>
            <tr><td class="tdlabel">Dissolved oxygen:</label></td><td>${feature.diss_oxygen.value} ${feature.diss_oxygen_unit.value}</td></tr>
            <tr><td class="tdlabel">Electrical conductivity:</label></td><td>${feature.elec_cond.value} ${feature.elec_cond_unit.value}</td></tr>
          </table>
        </td>
        <td id="obs_groups">
          <table id="obs_table_right">
            <tr><th>Groups</th><th>Present</th></tr>
            <tr><td class="tdlabel">Flat worms</td>
                <td class="tddata"><#if feature.flatworms.value != "">${feature.flatworms.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Worms</td>
                <td class="tddata"><#if feature.worms.value != "">${feature.worms.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Leeches</td>
                <td class="tddata"><#if feature.leeches.value != "">${feature.leeches.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Crabs/Shimps</td>
                <td class="tddata"><#if feature.crabs_shrimps.value != "">${feature.crabs_shrimps.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Stoneflies</td>
                <td class="tddata"><#if feature.stoneflies.value != "">${feature.stoneflies.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Minnow mayflies</td>
                <td class="tddata"><#if feature.minnow_mayflies.value != "">${feature.minnow_mayflies.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Other mayflies</td>
                <td class="tddata"><#if feature.other_mayflies.value != "">${feature.other_mayflies.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Damselflies</td>
                <td class="tddata"><#if feature.damselflies.value != "">${feature.damselflies.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Dragonflies</td>
                <td class="tddata"><#if feature.dragonflies.value != "">${feature.dragonflies.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Bugs/beetles</td>
                <td class="tddata"><#if feature.bugs_beetles.value != "">${feature.bugs_beetles.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Caddisflies</td>
                <td class="tddata"><#if feature.caddisflies.value != "">${feature.caddisflies.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">True flies</td>
                <td class="tddata"><#if feature.true_flies.value != "">${feature.true_flies.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <tr><td class="tdlabel">Snails</td>
                <td class="tddata"><#if feature.snails.value != "">${feature.snails.rawValue?string("Yes","No")}</#if></td><td></td>
            </tr>
            <#assign crabURL = "">
            <#assign healthClass = "">
            <#if feature.score.rawValue?is_number>
              <#if feature.score.rawValue = 0 >
                <#assign crabURL = "/static/img/icon_crab_u_large.png">
                <#assign healthClass = "&nbsp;">
              </#if>
              <#if (feature.score.rawValue > 0) && (feature.score.rawValue <= 4.3) && (feature.river_cat.value = "sandy")>
                <#assign crabURL = "/static/img/icon_crab_u_large.png">
                <#assign healthClass = "Very Poor">
              </#if>
              <#if (feature.score.rawValue > 0) && (feature.score.rawValue <= 5.1) && (feature.river_cat.value = "rocky")>
                <#assign crabURL = "/static/img/icon_crab_v_large.png">
                <#assign healthClass = "Very Poor">
              </#if>
              <#if (feature.score.rawValue > 4.3) && (feature.score.rawValue <= 4.9) && (feature.river_cat.value = "sandy")>
                <#assign crabURL = "/static/img/icon_crab_p_large.png">
                <#assign healthClass = "Poor">
              </#if>
              <#if (feature.score.rawValue > 5.1) && (feature.score.rawValue <= 6.1) && (feature.river_cat.value = "rocky")>
                <#assign crabURL = "/static/img/icon_crab_p_large.png">
                <#assign healthClass = "Poor">
              </#if>
              <#if (feature.score.rawValue > 4.9) && (feature.score.rawValue <= 5.8) && (feature.river_cat.value = "sandy")>
                <#assign crabURL = "/static/img/icon_crab_f_large.png">
                <#assign healthClass = "Fair">
              </#if>
              <#if (feature.score.rawValue > 6.1) && (feature.score.rawValue <= 6.8) && (feature.river_cat.value = "rocky")>
                <#assign crabURL = "/static/img/icon_crab_f_large.png">
                <#assign healthClass = "Fair">
              </#if>
              <#if (feature.score.rawValue > 5.8) && (feature.score.rawValue <= 6.9) && (feature.river_cat.value = "sandy")>
                <#assign crabURL = "/static/img/icon_crab_g_large.png">
                <#assign healthClass = "Good">
              </#if>
              <#if (feature.score.rawValue > 6.8) && (feature.score.rawValue <= 7.9) && (feature.river_cat.value = "rocky")>
                <#assign crabURL = "/static/img/icon_crab_g_large.png">
                <#assign healthClass = "Good">
              </#if>
              <#if (feature.score.rawValue > 6.9) && (feature.river_cat.rawValue = "sandy")>
                <#assign crabURL = "/static/img/icon_crab_n_large.png">
                <#assign healthClass = "Natural">
              </#if>
              <#if (feature.score.rawValue > 7.9) && (feature.river_cat.rawValue = "rocky")>
                <#assign crabURL = "/static/img/icon_crab_n_large.png">
                <#assign healthClass = "Natural">
              </#if>
              <tr><td class="tdlabel">Average score:</td>
                <td class="tdtotal">${feature.score.value}</td>
                <td class="tdtotal"><img src="${crabURL}" alt="crab" id="id_crab"/></td></tr>
              <tr><td></td>
                <td class="tdtotal" colspan="2">${healthClass}</td>
              </tr>
            <#else>
              <tr><td class="tdlabel">Average score:</td>
                <td class="tdtotal">&nbsp;</td>
                <td class="tdtotal"><img src="/static/img/icon_crab_u_large.png" alt="crab" id="id_crab"/></td></tr>
              <tr><td>&nbsp;</td>
                <td class="tdtotal" colspan="2">Undefined</td>
              </tr>
            </#if>
          </table>
        </td>
      </tr>
    </table>
    <br />
  </div>
  </#list>
</div>
