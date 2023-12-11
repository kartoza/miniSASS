# tests.py
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from monitor.models import Assessment
from rest_framework.test import APIClient


class AssessmentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_assessment_crud_operations(self):
        # Create Assessment
        create_url = reverse('assessment-list-create')
        data = {'assessment_data': {'key': 'value'}}
        response = self.client.post(create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        assessment_id = response.data['assessment']

        # Retrieve Assessment
        retrieve_url = reverse('assessment-retrieve-update-destroy', kwargs={'pk': assessment_id})
        response = self.client.get(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Update Assessment
        update_data = {'assessment_data': {'key': 'updated_value'}}
        response = self.client.put(retrieve_url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Delete Assessment
        response = self.client.delete(retrieve_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

