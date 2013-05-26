<#--
Body section of the GetFeatureInfo template, it's provided with one feature collection, and
will be called multiple times if there are various feature collections
-->
<table class="featureInfo">
  <tr>
    <th>Site Name</th>
    <th>Description</th>
    <th>Category</th>
    <th>Date</th>
    <th>Comment</th>
    <th>Flat worms</th>
    <th>Worms</th>
    <th>Leeches</th>
    <th>Crabs/Shrimps</th>
    <th>Stoneflies</th>
    <th>Minnow mayflies</th>
    <th>Other mayflies</th>
    <th>Damselflies</th>
    <th>Dragonflies</th>
    <th>Bugs/beetles</th>
    <th>Caddisflies</th>
    <th>True flies</th>
    <th>Snails</th>
    <th>Score</th>
  </tr>

<#assign odd = false>
<#list features as feature>
  <#if odd>
    <tr class="odd">
  <#else>
    <tr>
  </#if>
  <#assign odd = !odd>
    <td>${feature.name.value}</td>
    <td>${feature.description.value}</td>
    <td>${feature.river_cat.value}</td>
    <td>${feature.obs_date.value?date("yyyy/MM/dd")}</td>
    <td>${feature.comment.value}</td>
    <td>${feature.flatworms.rawValue?string("Yes","No")}</td>
    <td>${feature.worms.rawValue?string("Yes","No")}</td>
    <td>${feature.leeches.rawValue?string("Yes","No")}</td>
    <td>${feature.crabs_shrimps.rawValue?string("Yes","No")}</td>
    <td>${feature.stoneflies.rawValue?string("Yes","No")}</td>
    <td>${feature.minnow_mayflies.rawValue?string("Yes","No")}</td>
    <td>${feature.other_mayflies.rawValue?string("Yes","No")}</td>
    <td>${feature.damselflies.rawValue?string("Yes","No")}</td>
    <td>${feature.dragonflies.rawValue?string("Yes","No")}</td>
    <td>${feature.bugs_beetles.rawValue?string("Yes","No")}</td>
    <td>${feature.caddisflies.rawValue?string("Yes","No")}</td>
    <td>${feature.true_flies.rawValue?string("Yes","No")}</td>
    <td>${feature.snails.rawValue?string("Yes","No")}</td>
    <td>${feature.score.value}</td>
  </tr>
</#list>
</table>
<br/>
