import datetime
from django.db import models, migrations

class Migration(migrations.Migration):

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='CMSPlugin',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('changed_date', models.DateTimeField(auto_now=True, blank=True)),
                ('creation_date', models.DateTimeField(default=datetime.datetime.now)),
                ('language', models.CharField(max_length=15, db_index=True)),
                ('level', models.PositiveIntegerField(db_index=True)),
                ('lft', models.PositiveIntegerField(db_index=True)),
                ('parent', models.ForeignKey(to='cms.CMSPlugin', null=True, blank=True)),
                ('placeholder', models.ForeignKey(to='cms.Placeholder', null=True)),
                ('plugin_type', models.CharField(max_length=50, db_index=True)),
                ('position', models.PositiveSmallIntegerField(null=True, blank=True)),
                ('rght', models.PositiveIntegerField(db_index=True)),
                ('tree_id', models.PositiveIntegerField(db_index=True)),
            ],
            options={
                'db_table': 'cms_cmsplugin',
            },
        ),
        migrations.CreateModel(
            name='Placeholder',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID')),
                ('default_width', models.PositiveSmallIntegerField(null=True)),
                ('slot', models.CharField(max_length=50, db_index=True)),
            ],
            options={
                'db_table': 'cms_placeholder',
            },
        ),
        migrations.CreateModel(
            name='RSSFeedConfig',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(
                    to='cms.CMSPlugin',
                    on_delete=models.CASCADE,
                    primary_key=True,
                    serialize=False,
                    auto_created=True,
                )),
                ('feed_url', models.URLField(max_length=200)),
            ],
            options={
                'db_table': 'cmsplugin_rssfeedconfig',
            },
            bases=('cms.cmsplugin',),
        ),
    ]
