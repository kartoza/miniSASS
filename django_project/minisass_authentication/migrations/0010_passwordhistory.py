# Generated by Django 4.2.7 on 2024-01-04 04:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def create_password_history(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    PasswordHistory = apps.get_model('minisass_authentication', 'PasswordHistory')
    for user in User.objects.all():
        PasswordHistory.objects.get_or_create(
            user=user,
            hashed_password=user.password
        )


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('minisass_authentication', '0009_alter_userprofile_expert_approval_status_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PasswordHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hashed_password', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RunPython(create_password_history, lambda a, b: None)
    ]
