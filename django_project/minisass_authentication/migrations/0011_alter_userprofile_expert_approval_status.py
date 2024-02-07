from django.db import migrations, models
from django.conf import settings

class Migration(migrations.Migration):

    dependencies = [
        ('minisass_authentication', '0010_passwordhistory'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='expert_approval_status',
            field=models.CharField(choices=[('PENDING', 'PENDING'), ('APPROVED', 'APPROVED'), ('REJECTED', 'REJECTED')], default='PENDING', max_length=255),
        ),
    ]
