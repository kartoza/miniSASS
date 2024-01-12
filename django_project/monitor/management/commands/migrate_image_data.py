# import os.path
#
# import boto3
# from django.core.management.base import BaseCommand
# from django.conf import settings
# from monitor.models import Observations, ObservationPestImage, SiteImage, site_image_path, observation_pest_image_path
#
#
# class Command(BaseCommand):
#     help = 'Migrate images data from current minIO to https://minio.do.kartoza.com'
#
#     def add_arguments(self, parser):
#         parser.add_argument('--copy-image', type=str, help='Copy image to  new location')
#         parser.add_argument('--update-path', type=str, help='Update image path to new location')
    #     parser.add_argument('-b', '--bucket', type=str, help='MinIO Bucket')
    #     parser.add_argument('-u', '--url', type=str, help='MinIO endpoint URL')
    #     parser.add_argument('-k', '--access-key', type=str, help='MinIO access key')
    #     parser.add_argument('-s', '--secret-key', type=str, help='MinIO secret key')

    # def handle(self, *args, **kwargs):
        # true_words = ['1', 'yes', 'no']
        #
        # # setup minIO client
        # copy_image = kwargs.get('copy_image')
        # copy_image = 'false' if not copy_image else copy_image
        # if copy_image.lower() in true_words:
        #     s3 = boto3.client(
        #         's3',
        #         endpoint_url=settings.MINIO_ENDPOINT,
        #         aws_access_key_id=settings.MINIO_ACCESS_KEY,
        #         aws_secret_access_key=settings.MINIO_SECRET_KEY
        #     )
        #
        #
        #
        # update_path = kwargs.get('update_path')
        # update_path = 'false' if not update_path else update_path
        # if update_path.lower() in true_words:
        #     # for image in SiteImage.objects.all():
        #     #     old_path = image.image.name.replace('demo/', 'old_minisass/')
        #     #     old_path = os.path.join('minisass', old_path)
        #     #     new_path = site_image_path(image, os.path.basename(old_path))
        #     #     print(new_path)
        #         # print(image.image.name)
        #
        #         # image.save()
        #
        #     # for image in ObservationPestImage.objects.all():
        #     for image in ObservationPestImage.objects.filter(id=16):
        #         old_path = image.image.name.replace('demo/', 'old_minisass/')
        #         # image.image.name = os.path.join('minisass', old_path)
        #         print(old_path)
        #         # image.save()

        # for image in ObservationPestImage.objects.all():
        #     image.image.name = 'demo/1416/2519/demoiselle-4857850_640.jpg'
        #     image.save()
            # if image.observation.user.userprofile.is_expert:
            #     image.valid = True
            # print(image.image.name)
            # old_path = image.image.name.replace('demo/', 'old_minisass/')
            # old_path = os.path.join('minisass', old_path)
            # print(old_path)
            # print('---')
            # image.image.name = old_path

            # print(old_path, len(old_path))
            # image.save()

        # for image in SiteImage.objects.all():
        #     old_path = image.image.name.replace('demo/', 'old_minisass/')
        #     old_path = os.path.join('minisass', old_path)
        #     image.image.name = old_path
        #     print(len(old_path))
            # image.save()