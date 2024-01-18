# Generated by Django 4.2.7 on 2024-01-18 09:02

from django.db import migrations, models


def add_observation_collector_name(apps, schema_editor):
    Observation = apps.get_model('monitor', 'Observations')
    for observation in Observation.objects.all():
        observation.collector_name = f'{observation.user.first_name} {observation.user.last_name}'.strip()
        observation.save()


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0010_alter_sites_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='observations',
            name='collector_name',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.RunPython(add_observation_collector_name, lambda a, b: None)
    ]