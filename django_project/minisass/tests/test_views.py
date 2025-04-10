import datetime
from unittest import mock

import pytz
from django.urls import reverse
from rest_framework import status
from rest_framework.fields import DateTimeField
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from minisass.models import Video, GroupScores, MobileApp
from minisass.serializers.serializers import VideoSerializer, GroupScoresSerializer


class VideoAPITestCase(APITestCase):
    def setUp(self):
        self.video = Video.objects.create(title="Test Video", embed_code="test_embed_code")

        self.client = APIClient()

    def test_read_video_list(self):
        url = reverse('video-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        serialized_data = VideoSerializer(Video.objects.all(), many=True).data
        self.assertEqual(response.data, serialized_data)

    def test_update_video(self):
        # Create a new Video instance
        video = Video.objects.create(title='Original Title', embed_code='Original Embed Code')

        # Update the video's title
        video.title = 'Updated Title'
        video.save()

        # Retrieve the updated video from the database
        updated_video = Video.objects.get(id=video.id)

        # Check if the title was successfully updated
        self.assertEqual(updated_video.title, 'Updated Title')

    def test_delete_video(self):
        # Create a new Video instance
        video = Video.objects.create(title='Test Video2', embed_code='Test Embed Code')

        # Delete the video from the database
        video.delete()

        # Attempt to retrieve the deleted video from the database
        with self.assertRaises(Video.DoesNotExist):
            deleted_video = Video.objects.get(title='Test Video2')


class GroupScoresAPITestCase(APITestCase):
    def setUp(self):
        self.group_score = GroupScores.objects.create(name="Test Group", sensitivity_score=1.23)
        self.client = APIClient()

    def test_read_group_scores_list(self):
        url = reverse('group-scores')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        serialized_data = GroupScoresSerializer(GroupScores.objects.all(), many=True).data
        self.assertEqual(response.data, serialized_data)
    
    def test_update_group_scores(self):
        # Create a new GroupScores instance
        group_scores = GroupScores.objects.create(name='Original Group', sensitivity_score=2.5)

        # Update the group scores' name
        group_scores.name = 'Updated Group'
        group_scores.save()

        # Retrieve the updated group scores from the database
        updated_group_scores = GroupScores.objects.get(id=group_scores.id)

        # Check if the name was successfully updated
        self.assertEqual(updated_group_scores.name, 'Updated Group')

    def test_delete_group_scores(self):
        # Create a new GroupScores instance
        group_scores = GroupScores.objects.create(name='Test Group2', sensitivity_score=3.5)

        # Delete the group scores from the database
        group_scores.delete()

        # Attempt to retrieve the deleted group scores from the database
        with self.assertRaises(GroupScores.DoesNotExist):
            deleted_group_scores = GroupScores.objects.get(name='Test Group2')


class GetMobileAppTest(APITestCase):
    def setUp(self):
        MobileApp.objects.create(name='v.1.1')
        self.mobile_app = MobileApp.objects.create(name='v.1.2', active=True)

    def test_get_mobile_app(self):
        """
        Test the API will return latest active mobile app.
        """

        url = reverse('get-mobile-app')
        mocked = datetime.datetime(2024, 1, 8, 0, 0, 0, tzinfo=pytz.utc)
        with mock.patch('django.utils.timezone.now', mock.Mock(return_value=mocked)):
            response = self.client.get(url)
            self.assertEquals(response.status_code, 200)
            self.assertEquals(
                response.json(),
                {
                    'id': self.mobile_app.id,
                    'date': DateTimeField().to_representation(self.mobile_app.date),
                    'name': 'v.1.2',
                    'file': None,
                    'active': True
                }
            )
