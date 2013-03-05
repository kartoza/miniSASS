# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'miniSASSmonitor'
        db.create_table('monitor_minisassmonitor', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nearest_place_name', self.gf('django.db.models.fields.CharField')(max_length=80)),
            ('date_created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal('monitor', ['miniSASSmonitor'])

        # Adding model 'MonitorPlugin'
        db.create_table('cmsplugin_monitorplugin', (
            ('cmsplugin_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['cms.CMSPlugin'], unique=True, primary_key=True)),
            ('monitor', self.gf('django.db.models.fields.related.ForeignKey')(related_name='plugins', to=orm['monitor.miniSASSmonitor'])),
        ))
        db.send_create_signal('monitor', ['MonitorPlugin'])


    def backwards(self, orm):
        # Deleting model 'miniSASSmonitor'
        db.delete_table('monitor_minisassmonitor')

        # Deleting model 'MonitorPlugin'
        db.delete_table('cmsplugin_monitorplugin')


    models = {
        'cms.cmsplugin': {
            'Meta': {'object_name': 'CMSPlugin'},
            'changed_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'creation_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2013, 3, 5, 0, 0)'}),
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
        'monitor.minisassmonitor': {
            'Meta': {'object_name': 'miniSASSmonitor'},
            'date_created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nearest_place_name': ('django.db.models.fields.CharField', [], {'max_length': '80'})
        },
        'monitor.monitorplugin': {
            'Meta': {'object_name': 'MonitorPlugin', 'db_table': "'cmsplugin_monitorplugin'", '_ormbases': ['cms.CMSPlugin']},
            'cmsplugin_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['cms.CMSPlugin']", 'unique': 'True', 'primary_key': 'True'}),
            'monitor': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'plugins'", 'to': "orm['monitor.miniSASSmonitor']"})
        }
    }

    complete_apps = ['monitor']