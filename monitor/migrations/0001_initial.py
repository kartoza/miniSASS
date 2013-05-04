# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Organisations'
        db.create_table(u'organisations', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('org_name', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('org_type', self.gf('django.db.models.fields.CharField')(max_length=5, blank=True)),
        ))
        db.send_create_signal('monitor', ['Organisations'])

        # Adding model 'Sites'
        db.create_table(u'sites', (
            ('gid', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('the_geom', self.gf('django.contrib.gis.db.models.fields.PointField')()),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('river_cat', self.gf('django.db.models.fields.CharField')(max_length=5, blank=True)),
        ))
        db.send_create_signal('monitor', ['Sites'])

        # Adding model 'Observations'
        db.create_table(u'observations', (
            ('gid', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('flatworms', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('worms', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('leeches', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('crabs_shrimps', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('stoneflies', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('minnow_mayflies', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('other_mayflies', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('damselflies', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('dragonflies', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('bugs_beetles', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('caddisflies', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('true_flies', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('snails', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('score', self.gf('django.db.models.fields.DecimalField')(max_digits=4, decimal_places=2)),
            ('site', self.gf('django.db.models.fields.related.ForeignKey')(related_name='observation', db_column='site', to=orm['monitor.Sites'])),
            ('time_stamp', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, auto_now_add=True, blank=True)),
            ('comment', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('sample_date', self.gf('django.db.models.fields.DateField')(blank=True)),
            ('flag', self.gf('django.db.models.fields.CharField')(default='dirty', max_length=5)),
        ))
        db.send_create_signal('monitor', ['Observations'])

        # Adding model 'ObservationPlugin'
        db.create_table('cmsplugin_observationplugin', (
            ('cmsplugin_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['cms.CMSPlugin'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('monitor', ['ObservationPlugin'])


    def backwards(self, orm):
        # Deleting model 'Organisations'
        db.delete_table(u'organisations')

        # Deleting model 'Sites'
        db.delete_table(u'sites')

        # Deleting model 'Observations'
        db.delete_table(u'observations')

        # Deleting model 'ObservationPlugin'
        db.delete_table('cmsplugin_observationplugin')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'cms.cmsplugin': {
            'Meta': {'object_name': 'CMSPlugin'},
            'changed_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'creation_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '15', 'db_index': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['cms.CMSPlugin']", 'null': 'True', 'blank': 'True'}),
            'placeholder': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['cms.Placeholder']", 'null': 'True'}),
            'plugin_type': ('django.db.models.fields.CharField', [], {'max_length': '50', 'db_index': 'True'}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        },
        'cms.placeholder': {
            'Meta': {'object_name': 'Placeholder'},
            'default_width': ('django.db.models.fields.PositiveSmallIntegerField', [], {'null': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'slot': ('django.db.models.fields.CharField', [], {'max_length': '50', 'db_index': 'True'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'monitor.observationplugin': {
            'Meta': {'object_name': 'ObservationPlugin', 'db_table': "'cmsplugin_observationplugin'", '_ormbases': ['cms.CMSPlugin']},
            'cmsplugin_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['cms.CMSPlugin']", 'unique': 'True', 'primary_key': 'True'})
        },
        'monitor.observations': {
            'Meta': {'object_name': 'Observations', 'db_table': "u'observations'"},
            'bugs_beetles': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'caddisflies': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'comment': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'crabs_shrimps': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'damselflies': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'dragonflies': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'flag': ('django.db.models.fields.CharField', [], {'default': "'dirty'", 'max_length': '5'}),
            'flatworms': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'gid': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'leeches': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'minnow_mayflies': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'other_mayflies': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'sample_date': ('django.db.models.fields.DateField', [], {'blank': 'True'}),
            'score': ('django.db.models.fields.DecimalField', [], {'max_digits': '4', 'decimal_places': '2'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'observation'", 'db_column': "'site'", 'to': "orm['monitor.Sites']"}),
            'snails': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'stoneflies': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'time_stamp': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'auto_now_add': 'True', 'blank': 'True'}),
            'true_flies': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'worms': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        },
        'monitor.organisations': {
            'Meta': {'object_name': 'Organisations', 'db_table': "u'organisations'"},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'org_name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'org_type': ('django.db.models.fields.CharField', [], {'max_length': '5', 'blank': 'True'})
        },
        'monitor.schools': {
            'Meta': {'object_name': 'Schools', 'db_table': "u'schools'", 'managed': 'False'},
            'geom': ('django.contrib.gis.db.models.fields.PointField', [], {}),
            'gid': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'natemis': ('django.db.models.fields.IntegerField', [], {}),
            'phase': ('django.db.models.fields.CharField', [], {'max_length': '12'}),
            'province': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'school': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'monitor.sites': {
            'Meta': {'object_name': 'Sites', 'db_table': "u'sites'"},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'gid': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'river_cat': ('django.db.models.fields.CharField', [], {'max_length': '5', 'blank': 'True'}),
            'the_geom': ('django.contrib.gis.db.models.fields.PointField', [], {})
        }
    }

    complete_apps = ['monitor']