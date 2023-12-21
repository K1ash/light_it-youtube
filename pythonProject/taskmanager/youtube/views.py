from .models import Articles
from django.shortcuts import render
from django.http import JsonResponse
from .models import SearchPhrase
from django.views.decorators.csrf import csrf_exempt
import json
from .models import FavorittVideo
from django.utils import timezone
from django.views.decorators.http import require_POST
import logging
import requests

@csrf_exempt
def youtube_search(request):
    if request.method == 'GET':
        api_key = 'AIzaSyAGzU0Ta8QS33Kyl6C3kF7WF5Oz2Vgp0dE'
        search_query = request.GET.get('q', '')
        max_results = request.GET.get('maxResults', 10)

        # Ваша логіка обробки запиту та взаємодії з YouTube API
        api_url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&q={search_query}&key={api_key}&maxResults={max_results}'
        response = requests.get(api_url)
        data = response.json()

        # Ваша логіка обробки відповіді та збереження результатів на бекенді

        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Метод не підтримується'}, status=405)




logger = logging.getLogger(__name__)

@csrf_exempt
@require_POST
def toggle_favorite_video(request):
    try:
        video_id = request.POST.get('video_id')

        # Перевірка, чи відео вже в обраному
        if FavorittVideo.objects.filter(video_id=video_id).exists():
            # Видалення відео з обраного
            FavorittVideo.objects.filter(video_id=video_id).delete()
            message = 'Відео видалено з обраного.'
        else:
            # Додавання відео до обраного
            title = request.POST.get('title')
            thumbnail_url = request.POST.get('thumbnail_url')
            published_at = timezone.now()  # Використовуйте правильний спосіб отримання часу публікації
            FavorittVideo.objects.create(
                video_id=video_id,
                title=title,
                thumbnail_url=thumbnail_url,
                published_at=published_at
            )
            message = 'Відео додано до обраного.'

        return JsonResponse({'message': message})
    except Exception as e:
        # Залогуйте виняток або виведіть деталі для відладки
        logger.error(f"Помилка в toggle_favorite_video: {e}")
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)


@csrf_exempt
def save_search_phrase(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        phrase = data.get('phrase', '')
        if phrase:
            SearchPhrase.objects.create(phrase=phrase)
            return JsonResponse({'message': 'Search phrase saved successfully'})
        else:
            return JsonResponse({'error': 'Invalid data'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)





def index(reguest):

    return render(reguest, 'youtube/index.html')

def about(reguest):
    return render(reguest, 'youtube/about.html')

def favorites(reguest):
    news = Articles.objects.all()
    return render(reguest, 'youtube/favorites.html', {'news': news})

def indexdark(reguest):
    return render(reguest, 'youtube/indexdark.html')

def favoritesdark(reguest):
    return render(reguest, 'youtube/favoritesdark.html')


