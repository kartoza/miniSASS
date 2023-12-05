from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('minisass_authentication'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='is_expert',
            field=models.BooleanField(default=False),
        ),
    ]
