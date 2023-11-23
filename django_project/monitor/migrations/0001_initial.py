# -*- coding: utf-8 -*-
from django.db import migrations, models
from django.contrib.gis.db import models as geometry_fields

class Migration(migrations.Migration):

    dependencies = [
        # Add any dependencies if needed
    ]

    operations = [
        migrations.CreateModel(
            name='Organisations',
            fields=[
                ('id', models.AutoField(primary_key=True)),
                ('org_name', models.CharField(max_length=100, blank=True)),
                ('org_type', models.CharField(max_length=11, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Sites',
            fields=[
                ('gid', models.AutoField(primary_key=True)),
                ('the_geom', geometry_fields.PointField()),
                ('site_name', models.CharField(max_length=15)),
                ('river_name', models.CharField(max_length=15)),
                ('description', models.CharField(max_length=255, blank=True)),
                ('river_cat', models.CharField(max_length=5, blank=True)),
                ('user', models.ForeignKey(to='auth.User', on_delete=models.CASCADE)),
                ('time_stamp', models.DateTimeField(auto_now=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Observations',
            fields=[
                ('gid', models.AutoField(primary_key=True)),
                ('user', models.ForeignKey(to='auth.User', on_delete=models.CASCADE, blank=True, null=True)),
                ('flatworms', models.BooleanField(default=False)),
                ('worms', models.BooleanField(default=False)),
                ('leeches', models.BooleanField(default=False)),
                ('crabs_shrimps', models.BooleanField(default=False)),
                ('stoneflies', models.BooleanField(default=False)),
                ('minnow_mayflies', models.BooleanField(default=False)),
                ('other_mayflies', models.BooleanField(default=False)),
                ('damselflies', models.BooleanField(default=False)),
                ('dragonflies', models.BooleanField(default=False)),
                ('bugs_beetles', models.BooleanField(default=False)),
                ('caddisflies', models.BooleanField(default=False)),
                ('true_flies', models.BooleanField(default=False)),
                ('snails', models.BooleanField(default=False)),
                ('score', models.DecimalField(max_digits=4, decimal_places=2, default=0)),
                ('site', models.ForeignKey(related_name='observation',on_delete=models.CASCADE, db_column='site', to='monitor.Sites')),
                ('time_stamp', models.DateTimeField(auto_now=True, blank=True)),
                ('comment', models.CharField(max_length=255, blank=True)),
                ('obs_date', models.DateField(blank=True, null=True)),
                ('flag', models.CharField(default='dirty', max_length=5)),
                ('water_clarity', models.DecimalField(max_digits=8, decimal_places=1, blank=True)),
                ('water_temp', models.DecimalField(max_digits=5, decimal_places=1, blank=True)),
                ('ph', models.DecimalField(max_digits=4, decimal_places=1, blank=True)),
                ('diss_oxygen', models.DecimalField(max_digits=8, decimal_places=2, blank=True)),
                ('diss_oxygen_unit', models.CharField(default='mgl', max_length=8, blank=True)),
                ('elec_cond', models.DecimalField(max_digits=8, decimal_places=2, blank=True)),
                ('elec_cond_unit', models.CharField(default='mSm', max_length=8, blank=True)),
            ],
        ),
    ]
