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
    <table id="id_obs_${observation}" class="featureInfo">
      <tr>
        <td id="obs_site_details">
          <table id="obs_table_left">
            <tr><td class="section_header" colspan="2">Site Details</td></tr>
            <tr><td class="tdlabel">River name:</td><td class="tddata">${feature.river_name.value}</td></tr>
            <tr><td class="tdlabel">Site name:</td><td class="tddata">${feature.site_name.value}</td></tr>
            <tr><td class="tdlabel">Site description:</td><td class="tddata">${feature.description.value}</td></tr>
            <tr><td class="tdlabel">Latitude (S):</td><td class="tddata">${feature.y.value}</td></tr>
            <tr><td class="tdlabel">Longitude (E):</td><td class="tddata">${feature.x.value}</td></tr>
            <tr><td class="tdlabel">River category:</td><td class="tddata">${feature.river_cat.value}</td></tr>
            <tr><td class="section_header" colspan="2"><br />Observation Details</td></tr>
            <tr><td class="tdlabel">Date:</td><td class="tddata"><#if feature.obs_date.value != "">${feature.obs_date.value?date("yyyy/MM/dd")}</#if></td></tr>
            <tr><td class="tdlabel">Username:</td><td class="tddata">${feature.username.value}</td></tr>
            <tr><td class="tdlabel">Organisation type:</td><td class="tddata">${feature.organisation_type.value}</td></tr>
            <tr><td class="tdlabel">Organisation name:</td><td class="tddata">${feature.organisation_name.value}</td></tr>
            <tr><td class="tdlabel">Comments/notes:</td><td class="tddata">${feature.comment.value}</td></tr>
          </table>
        </td>
        <td id="obs_groups">
          <table id="obs_table_right">
            <tr><th>Groups</th><th>Present</th></tr>
            <tr><td class="tdlabel">Flat worms</td>
                <td class="tddata"><#if feature.flatworms.value != "">${feature.flatworms.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Worms</td>
                <td class="tddata"><#if feature.worms.value != "">${feature.worms.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Leeches</td>
                <td class="tddata"><#if feature.leeches.value != "">${feature.leeches.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Crabs/Shimps</td>
                <td class="tddata"><#if feature.crabs_shrimps.value != "">${feature.crabs_shrimps.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Stoneflies</td>
                <td class="tddata"><#if feature.stoneflies.value != "">${feature.stoneflies.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Minnow mayflies</td>
                <td class="tddata"><#if feature.minnow_mayflies.value != "">${feature.minnow_mayflies.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Other mayflies</td>
                <td class="tddata"><#if feature.other_mayflies.value != "">${feature.other_mayflies.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Damselflies</td>
                <td class="tddata"><#if feature.damselflies.value != "">${feature.damselflies.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Dragonflies</td>
                <td class="tddata"><#if feature.dragonflies.value != "">${feature.dragonflies.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Bugs/beetles</td>
                <td class="tddata"><#if feature.bugs_beetles.value != "">${feature.bugs_beetles.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Caddisflies</td>
                <td class="tddata"><#if feature.caddisflies.value != "">${feature.caddisflies.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">True flies</td>
                <td class="tddata"><#if feature.true_flies.value != "">${feature.true_flies.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Snails</td>
                <td class="tddata"><#if feature.snails.value != "">${feature.snails.rawValue?string("Yes","No")}</#if></td>
            </tr>
            <tr><td class="tdlabel">Average score:</td><td class="tddata">${feature.score.value}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <br />
  </div>
  </#list>
</div>
