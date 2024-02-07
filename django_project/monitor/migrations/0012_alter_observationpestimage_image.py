from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0011_observations_collector_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='observationpestimage',
            name='ml_prediction',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='observationpestimage',
            name='ml_score',
            field=models.FloatField(null=True, blank=True),
        ),
    ]
