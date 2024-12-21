from django.contrib import admin
from .models import *
from .views import admin_required
# Register your models here.

admin.site.register(Profile)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(TokenDevice)


admin.site.login = admin_required(admin.site.login)