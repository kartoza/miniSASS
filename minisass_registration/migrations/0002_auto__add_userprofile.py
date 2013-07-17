# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'UserProfile'
        db.create_table('minisass_registration_userprofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('organisation_type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['minisass_registration.Lookup'])),
            ('organisation_name', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
        ))
        db.send_create_signal('minisass_registration', ['UserProfile'])


    def backwards(self, orm):
        # Deleting model 'UserProfile'
        db.delete_table('minisass_registration_userprofile')


    models = {
        'minisass_registration.lookup': {
            'Meta': {'object_name': 'Lookup'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'container': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['minisass_registration.Lookup']", 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'rank': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'})
        },
        'minisass_registration.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'organisation_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'organisation_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['minisass_registration.Lookup']"})
        }
    }

    complete_apps = ['minisass_registration']