from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('minisass_authentication','0004_alter_lookup_id_alter_userprofile_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='is_expert',
            field=models.BooleanField(default=False),
        ),
    ]
