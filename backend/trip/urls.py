from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, get_route

router = DefaultRouter()
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('route/', get_route, name="get_route"),
]