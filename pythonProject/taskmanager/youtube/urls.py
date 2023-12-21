from . import views
from .views import save_search_phrase
from django.urls import path
from .views import toggle_favorite_video
from .views import favorites
from .views import youtube_search

urlpatterns = [
    path('', views.index),
    path('index', views.index),
    path('about', views.about),
    path('favorites', views.favorites),
    path('favorites/', favorites, name='favorites'),
    path('indexdark', views.indexdark),
    path('favoritesdark', views.favoritesdark),
    path('save_search_phrase/', save_search_phrase, name='save_search_phrase'),
    path('toggle_favorite_video/', toggle_favorite_video, name='toggle_favorite_video'),
    path('youtube_search/', youtube_search, name='youtube_search'),
]