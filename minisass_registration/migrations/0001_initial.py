# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Lookup'
        db.create_table('minisass_registration_lookup', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('container', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['minisass_registration.Lookup'], null=True, blank=True)),
            ('rank', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('active', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('minisass_registration', ['Lookup'])


    def backwards(self, orm):
        # Deleting model 'Lookup'
        db.delete_table('minisass_registration_lookup')


    models = {
        'minisass_registration.lookup': {
            'Meta': {'object_name': 'Lookup'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'container': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['minisass_registration.Lookup']", 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'rank': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'})
        }
    }

    complete_apps = ['minisass_registration']