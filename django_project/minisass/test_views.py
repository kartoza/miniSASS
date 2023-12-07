from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from minisass.models import Video, GroupScores
from minisass.serializers import VideoSerializer, GroupScoresSerializer
from rest_framework.test import APIClient
from django.contrib.auth.models import User

class VideoAPITestCase(APITestCase):
    def setUp(self):
        self.video = Video.objects.create(title="Test Video", embed_code="test_embed_code")

        self.client = APIClient()

    def test_read_video_list(self):
        url = reverse('video-list')
        response = get(url)
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
        response = get(url)
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
