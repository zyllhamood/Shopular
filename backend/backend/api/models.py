from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')#auth anon

    discount = models.IntegerField(default=0,blank=True)

    name = models.CharField(max_length=100,blank=True)#auth
    price = models.DecimalField(max_digits=10, decimal_places=2)#auth
    simple_description = models.CharField(max_length=250,blank=True)#auth
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    category = models.CharField(max_length=20)
    platform = models.CharField(max_length=20,blank=True,default='')
    hide = models.BooleanField(default=False)

    delivery_message = models.TextField(blank=True)
    

    place = models.IntegerField(default=0)#admin
    created_at = models.DateTimeField(default=timezone.now)#auto
    def __str__(self):
        return self.name

class Order(models.Model):
    username_buyer = models.CharField(max_length=100, blank=True)#anon
    social_user = models.CharField(max_length=50, blank=True)#anon
    email_buyer = models.EmailField(max_length=120, blank=True)#anon

    crypto = models.CharField(max_length=10, blank=True)#anon
    address = models.CharField(max_length=100, blank=True)
    amount = models.FloatField(blank=True, null=True)
    actually_paid = models.FloatField(blank=True, null=True)
    message = models.TextField(blank=True)#after confirmed

    code_url = models.CharField(max_length=50, blank=True)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')#anon
    payment_id = models.CharField(max_length=255,blank=True)#anon
    created_at = models.DateTimeField(default=timezone.now)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)#anon
    status = models.CharField(max_length=255,default='pending')

    review_stars = models.IntegerField(default=0)
    review_message = models.CharField(max_length=150,blank=True)

    expiers =  models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return str(self.code_url)

class Profile(models.Model):
    username = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(blank=True, default="")
    full_name = models.CharField(max_length=30,blank=True)
    bio = models.CharField(max_length=50,blank=True)
    avatar = models.URLField(blank=True)
    sold = models.IntegerField(default=0)
    reviews = models.IntegerField(default=0)
    message = models.TextField(blank=True)
    tele_id = models.CharField(max_length=20, blank=True)
    tele_token = models.CharField(max_length=100, blank=True)
    discord_webhook = models.URLField(blank=True)
    instagram = models.CharField(max_length=50,blank=True)
    email_contact = models.CharField(max_length=120,blank=True)
    telegram = models.CharField(max_length=70,blank=True)
    discord = models.CharField(max_length=70,blank=True)
    snapchat = models.CharField(max_length=50,blank=True)
    twitter = models.CharField(max_length=50,blank=True)
    api_key = models.CharField(max_length=100,blank=True,default='')
    other_payment = models.TextField(blank=True)
    lock = models.BooleanField(default=False)
    def __str__(self):
        return self.username.username

class Sent(models.Model):
    code_url = models.CharField(max_length=50)

class TokenDevice(models.Model):
    token = models.TextField()
    end_time = models.DateTimeField()

    def __str__(self):
        return self.token
    
