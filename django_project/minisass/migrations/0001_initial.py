from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('embed_code', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='GroupScores',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('sensitivity_score', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
        ),
    ]
