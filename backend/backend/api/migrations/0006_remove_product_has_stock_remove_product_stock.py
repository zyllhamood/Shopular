# Generated by Django 5.0.7 on 2024-07-14 09:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_sent_tokendevice'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='has_stock',
        ),
        migrations.RemoveField(
            model_name='product',
            name='stock',
        ),
    ]