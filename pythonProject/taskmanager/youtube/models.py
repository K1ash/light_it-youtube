from django.db import models

class FavorittVideo(models.Model):
    video_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    thumbnail_url = models.URLField()
    published_at = models.DateTimeField()



class SearchPhrase(models.Model):
    phrase = models.CharField(max_length=255)



class Articles(models.Model):
    title = models.CharField('Название Видео', max_length=50)
    anons = models.CharField('Описание', max_length=250)
    full_text = models.TextField('Статья')
    date = models.DateTimeField('Дата Публикации')



    def __str__(self):
        return self.title

