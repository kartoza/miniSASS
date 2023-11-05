import json
from minisass_authentication.serializers import UserSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login
from minisass_authentication.models import UserProfile, Lookup

# from django.http import HttpResponse
# from django.utils import simplejson as json
# from django.shortcuts import redirect
# from django.shortcuts import render_to_response
# from django.template import RequestContext

# from registration.backends import get_backend

# from monitor.models import Schools


# def school_names(request):
#     """ Return school names matching the string passed in
#     """
#     result = []
#     query = request.GET.get('term')
#     if query:
#         qs = Schools.objects.filter(school__istartswith=query).values('school')
#         result = [itm['school'] for itm in qs]
#     content = json.dumps(result)
#     return HttpResponse(content, 
#                         content_type="application/json; charset=utf-8")


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data['password'])
            user.first_name = request.data.get('name')
            user.last_name = request.data.get('surname')
            user.save()
            
            # Create a User Profile
            firstname = request.data.get('name')
            lastname = request.data.get('surname')
            organisation_type_description = request.data.get('organizationType')
            
            if firstname and lastname:
                # Retrieve the Lookup object based on the description.
                # This assumes that the 'description' field in the Lookup model is unique.
                try:
                    organisation_type = Lookup.objects.get(description__iexact=organisation_type_description)
                except Lookup.DoesNotExist:
                    # If no match is found, use the default description "Organisation Type".
                    organisation_type = Lookup.objects.get(description__iexact="Organisation Type")
                
                user_profile = UserProfile.objects.create(
                    user=user,
                    organisation_type=organisation_type,
                    organisation_name=request.data.get('organizationName', ''),
                    country=request.data.get('country', None)
                )
                user_profile.save()
            else:
                return Response({'error': 'Missing required fields for User Profile creation.'}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        print('request ', request.data)

        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
