from django.contrib import admin
from .models import Articles
from .models import SearchPhrase
from .models import FavorittVideo


admin.site.register(FavorittVideo)
admin.site.register(Articles)
admin.site.register(SearchPhrase)
