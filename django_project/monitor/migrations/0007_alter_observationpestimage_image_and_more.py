# Generated by Django 4.2.7 on 2024-01-11 09:13

import os
import django
from django.db import migrations, models
import monitor.models

class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0006_alter_observations_options_alter_sites_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observationpestimage',
            name='image',
            field=models.ImageField(max_length=250, storage=django.core.files.storage.FileSystemStorage(base_url='/minio-media', location='/home/web/minio'), upload_to=monitor.models.observation_pest_image_path),
        ),
        migrations.AlterField(
            model_name='siteimage',
            name='image',
            field=models.ImageField(max_length=250, storage=django.core.files.storage.FileSystemStorage(base_url='/minio-media', location='/home/web/minio'), upload_to=monitor.models.observation_pest_image_path),
        ),
        migrations.AlterField(
            model_name='observationpestimage',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='pest',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='siteimage',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='siteimage',
            name='image',
            field=models.ImageField(max_length=250,
                                    storage=django.core.files.storage.FileSystemStorage(base_url='/minio-media',
                                                                                        location='/home/web/minio'),
                                    upload_to=monitor.models.site_image_path),
        ),
    ]
