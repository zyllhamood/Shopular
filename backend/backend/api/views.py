from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from .serializers import *
from .permissions import *
from .pagination import *
from rest_framework.generics import ListAPIView,CreateAPIView,RetrieveAPIView,RetrieveUpdateAPIView,DestroyAPIView
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import BaseThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from django_ratelimit.decorators import ratelimit
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST,require_GET
from rest_framework.views import APIView
from rest_framework import status
from datetime import datetime
from datetime import timedelta
import pytz
from django.middleware.csrf import CsrfViewMiddleware
from django.utils import timezone
from django.contrib.auth import update_session_auth_hash
from requests import Session
import requests,json,string,random,re
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt,csrf_protect
import logging
from Crypto.Cipher import AES
import base64
from django.contrib.admin.views.decorators import user_passes_test
def send_message(self,msg):
    try:
        
        id = '1282345978'
        token = '5476245380:AAGZdtWpfpUlc_CWUIRfZmIueJLXtdtNcSU'
        url = f'https://api.telegram.org/bot{token}/sendMessage?chat_id={id}&text={msg}'
        resp = requests.get(url).text
    except:
        pass

def generate_random_token(length=50):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def get_random_token(request):
    token = generate_random_token()
    #TokenDevice.objects.filter(token=token).delete()  # Delete old tokens before creating new ones
    #send_message(token)
    end_time = timezone.now() + timedelta(minutes=5)
    key = b'mytsurgikey12345'  # 16 bytes key
    pad = lambda s: s + (16 - len(s) % 16) * ' '
    padded_data = pad(token)

    cipher = AES.new(key, AES.MODE_ECB)
    encrypted_bytes = cipher.encrypt(padded_data.encode())
    encrypted_base64 = base64.b64encode(encrypted_bytes).decode()
    print(encrypted_base64)
    
    TokenDevice.objects.get_or_create(token=encrypted_base64, end_time=end_time)

    return JsonResponse({'token': token})
@csrf_exempt
def tested(request):
    token = request.headers.get('X-CSRFToken')
    if(check_token(token)):
        return JsonResponse({'token': token})
    else:
        return JsonResponse({"not working token": token})

def check_token(token):
    try:
        token_device = TokenDevice.objects.filter(token=token).last()
        if timezone.now() > token_device.end_time:
            token_device.delete()
            return False
        return True
    except TokenDevice.DoesNotExist:
        return False
    

class LoginRateThrottle(BaseThrottle):
    def allow_request(self, request, view):
        @ratelimit(key='ip', rate='5/m', block=True, method='POST')
        def rate_limit_check(request):
            return True
        if not rate_limit_check(request):
            request.limited = True
            self.wait = 3600
            return False
        return True
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Get the user from the validated data
        user = self.user

        # Check if the user's profile is locked
        try:
            profile = Profile.objects.get(username=user)
            if profile.lock:
                raise serializers.ValidationError({"error": "Your user has been locked"}, code='authorization')
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"error": "Profile does not exist"}, code='authorization')

        return data

#@method_decorator(csrf_exempt, name='dispatch')
#@method_decorator(csrf_protect, name='dispatch')
class LoginView(TokenObtainPairView):
    throttle_classes = [LoginRateThrottle]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        #here check token
        username = request.data.get('username', '').lower()
        request.data['username'] = username
        token = request.headers.get('X-CSRFToken')
        if not check_token(token):
            return Response({'error': ''},status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        try:
            # First check if the user is locked
            username = request.data.get('username')
            user = User.objects.get(username=username)
            profile = Profile.objects.get(username=user)
            if profile.lock:
                return Response({"error": "Your user has been locked"}, status=status.HTTP_401_UNAUTHORIZED)

            # Then validate the credentials
            serializer.is_valid(raise_exception=True)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
        except Profile.DoesNotExist:
            return Response({"error": "Profile does not exist"}, status=status.HTTP_401_UNAUTHORIZED)
        except serializers.ValidationError:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
class RegisterRateThrottle(BaseThrottle):
    def allow_request(self, request, view):
        @ratelimit(key='ip', rate='2/m', block=True, method='POST')
        def rate_limit_check(request):
            return True
        if not rate_limit_check(request):
            request.limited = True
            self.wait = 3600
            return False
        return True
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    throttle_classes = [RegisterRateThrottle]
    def create(self, request, *args, **kwargs):
        request.data['username'] = request.data.get('username', '').lower()
        request.data['email'] = request.data.get('email', '').lower()
        token = request.headers.get('X-CSRFToken')
        if not check_token(token):
            return Response({'error': ''},status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({"message": "User registered successfully", "username": serializer.data.get('username')}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            errors = []
            for field, messages in e.detail.items():
                for message in messages:
                    errors.append(f"{field}: {message}")
            return Response({"message": ", ".join(errors)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(ratelimit(key='ip', rate='2/m', block=True), name='dispatch')
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        user = request.user
        
        old_password = request.data.get("oldPassword")
        new_password = request.data.get("newPassword")
        if not user.check_password(old_password):
            return Response(
                {"oldPassword": ["Wrong password."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save()
        return Response(
            {"message": "Password changed successfully."}, status=status.HTTP_200_OK
        )
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    try:
        profile = Profile.objects.get(username=user)
        if profile.lock:
            return Response({"error": "Your account has been locked"}, status=status.HTTP_403_FORBIDDEN)
    except Profile.DoesNotExist:
        return Response({"error": "Profile does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserInfoSerializer(user, many=False)
    return Response(serializer.data)
@method_decorator(ratelimit(key='ip', rate='2/m', block=True), name='dispatch')
class AddProductView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
#@method_decorator(ratelimit(key='ip', rate='3/m', block=True), name='dispatch')
class EditProductView(RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated,IsOwner]
    serializer_class = ProductSerializer
    lookup_field = "id"

@method_decorator(ratelimit(key='ip', rate='10/m', block=True), name='dispatch')
class DeleteProductView(DestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated,IsOwner]
    serializer_class = ProductSerializer
    lookup_field = "id"

@method_decorator(ratelimit(key='ip', rate='10/m', block=True), name='dispatch')
class ProductPublicView(ListAPIView):
    serializer_class = ProductPublicSerializer
    pagination_class = ProductPagination
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        token = request.headers.get('X-CSRFToken')
        if not check_token(token):
            self.permission_denied(
                request, message='Invalid CSRF Token', code=status.HTTP_403_FORBIDDEN
            )

    def get_queryset(self):
        locked_users = Profile.objects.filter(lock=True).values_list('username', flat=True)
        print(locked_users)
        return Product.objects.filter(hide=False).exclude(user__in=locked_users).order_by('-created_at')
class ProductPublicFilter(ListAPIView):
    serializer_class = ProductPublicSerializer
    pagination_class = ProductPagination

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        token = request.headers.get('X-CSRFToken')
        if not check_token(token):
            self.permission_denied(
                request, message='Invalid CSRF Token', code=status.HTTP_403_FORBIDDEN
            )

    def post(self, request, *args, **kwargs):
        locked_users = Profile.objects.filter(lock=True).values_list('username', flat=True)
        queryset = Product.objects.filter(hide=False).exclude(user__in=locked_users).order_by('-created_at')

        categories = request.data.get('categories', [])
        platforms = request.data.get('platforms', [])
        max_price = request.data.get('max_price')
        min_price = request.data.get('min_price')

        if categories:
            queryset = queryset.filter(category__in=categories)

        if platforms:
            queryset = queryset.filter(platform__in=platforms)

        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
@method_decorator(ratelimit(key='ip', rate='5/m', block=True), name='dispatch')
class ProductUserView(ListAPIView):
    serializer_class = ProductUser
    permission_classes = [IsAuthenticated,IsOwner]
    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return Product.objects.filter(user=user).order_by('-created_at')
@method_decorator(ratelimit(key='ip', rate='5/m', block=True), name='dispatch')
class ProductUserPublicView(ListAPIView):
    serializer_class = ProductPublicSerializer
    pagination_class = ProductPagination
    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return Product.objects.filter(user=user, hide=False).order_by('-created_at')

class ProductInfoView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductInfoSerializer
    lookup_field = "id"

@method_decorator(ratelimit(key='ip', rate='20/m', block=True), name='dispatch')
class ProductAdminView(ListAPIView):
    queryset = Product.objects.filter(hide=False).order_by('-created_at')
    serializer_class = ProductAdminSerializer
    permission_classes = [IsAdminUser]
@method_decorator(ratelimit(key='ip', rate='20/m', block=True), name='dispatch')
class EditProductAdminView(RetrieveUpdateAPIView):
    queryset = Product.objects.filter(hide=False)
    permission_classes = [IsAdminUser]
    serializer_class = ProductPlace
    lookup_field = "id"
    
@method_decorator(ratelimit(key='ip', rate='5/m', block=True), name='dispatch')
class ProfilePublicView(RetrieveAPIView):
    queryset = Profile.objects.filter(lock=False)
    serializer_class = ProfilePublicSerializer
    lookup_field = "username"
    def get_object(self):
        username = self.kwargs.get(self.lookup_field)
        return get_object_or_404(Profile, username__username=username,lock=False)

class ProfileView(RetrieveUpdateAPIView):
    queryset = Profile.objects.filter(lock=False)
    serializer_class = ProfileSerializer
    lookup_field = "username"
    permission_classes = [IsAuthenticated, IsOwnerProfile]
    def get_object(self):
        username = self.kwargs.get(self.lookup_field)
        profile = get_object_or_404(Profile, username__username=username,lock=False)
        
        self.check_object_permissions(self.request, profile)
        return profile

class ProfileAdminView(ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileAdminSerializer
    permission_classes = [IsAdminUser]
class EditProfileAdminView(RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileAdminSerializer
    lookup_field = "id"
    permission_classes = [IsAdminUser]
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        
        lock = self.request.query_params.get('lock')
        
        if lock is not None:
            try:
                lock = lock.lower() in ['true', '1']
            except ValueError:
                return Response({"error": "Invalid value for lock"}, status=status.HTTP_400_BAD_REQUEST)
        
        if lock is not None:
            instance.lock = lock
            instance.save()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

def generate_payment_code(length=24):
    characters = string.ascii_letters + string.digits
    while True:
        payment_code = ''.join(random.choice(characters) for _ in range(length))
        if not Order.objects.filter(code_url=payment_code).exists():
            return payment_code
def convert_to_local_time(iso_time_str, local_timezone='Asia/Riyadh'):
    utc_time = datetime.strptime(iso_time_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    
    utc_time = utc_time.replace(tzinfo=pytz.UTC)
    
    local_time = utc_time.astimezone(pytz.timezone(local_timezone))
    
    return local_time
def discount_fun(original_price, discount_percentage):
    # Calculate the discount amount
    discount_amount = (original_price * discount_percentage) / 100
    # Subtract the discount amount from the original price
    discounted_price = original_price - discount_amount
    # Return the discounted price
    return discounted_price
@method_decorator(ratelimit(key='ip', rate='3/m', block=True), name='dispatch')
class CreatePaymentView(APIView):
    def post(self, request, *args, **kwargs):
        token = request.headers.get('X-CSRFToken')
        if not check_token(token):
            return Response({'error': ''},status=status.HTTP_403_FORBIDDEN)
        names = ""
        price = 0
        id_product = request.data.get("id")
        info_product = Product.objects.get(id=id_product)
        product_name = info_product.name
        discount = info_product.discount
        product_price = info_product.price
        if discount > 0:
            product_price = discount_fun(product_price, discount)
        
            
        if not id_product:
            return Response(
                {"error": "Missing name or price"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        crypto = request.data['crypto']
        
        username_buyer = request.data['username_buyer']
        social_user = request.data['social_user']
        email_buyer = request.data['email_buyer']
        seller_id = request.data['seller']
        time_zone_request = request.data['timezone']
        seller = Profile.objects.get(id=seller_id)
        url = 'https://api.nowpayments.io/v1/payment'
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': seller.api_key,
        }

        
        user = User.objects.get(username=seller.username)
        new_order = Order.objects.create(seller=user)
        order_id = new_order.id
        crypto_order = ''
        if crypto == 'usdt':
            crypto_order = 'usdttrc20'
        else:
            crypto_order = crypto
        data = {
            "price_amount": float(product_price),
            "price_currency": "usd",
            "pay_currency": str(crypto_order),
            "ipn_callback_url": "https://nowpayments.io",
            "order_id": order_id,
            "order_description": product_name
        }
        resp = requests.post(url,headers=headers,json=data).json()
        try:
            expires_date = convert_to_local_time(resp['expiration_estimate_date'],time_zone_request)
            order = Order.objects.get(id=order_id)
            order.payment_id = resp['payment_id']
            order.username_buyer = username_buyer
            order.social_user = social_user
            order.email_buyer = email_buyer
            order.crypto = crypto
            order.address = resp['pay_address']
            order.amount = resp['pay_amount']
            order.product = info_product
            order.code_url = generate_payment_code()
            order.expiers = expires_date
            order.save()

            response = {
                "payment_id": resp['payment_id'],
                "address": resp['pay_address'],
                "amount": resp['pay_amount'],
                "expires": expires_date,
                "order_id": order_id,

                "social_user": social_user,
                "seller": user.username,
                "url": f'{order.code_url}'
                
            }
            return Response(response,status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)},status.HTTP_400_BAD_REQUEST)
def send_telegram(id,token,msg):
    try:
        url = f'https://api.telegram.org/bot{token}/sendMessage?chat_id={id}&text={msg}'
        resp = requests.get(url).text
    except:
        pass
def send_discord(webhook,title,msg):
    try:
        
        data2 = {}
        data2["embeds"] = [
            {
                "color": 6536547,
                "thumbnail": {"url": f""},
                "description": msg,
                "footer": {"text": f'', "icon_url": f""},
                "author": {"name": ""},
                "title": title}
        ]
        try:
            response2 = requests.post(webhook, json=data2)
        except:
            pass
    except:
        pass
@method_decorator(ratelimit(key='ip', rate='15/m', block=True), name='dispatch')
class PaymentStatusView(APIView):
    def get(self, request, code):
        
        order = Order.objects.get(code_url=code)
        payment_id = order.payment_id
        seller_id = order.seller.pk
        seller = Profile.objects.get(id=seller_id)
        url = f'https://api.nowpayments.io/v1/payment/{payment_id}'
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': seller.api_key,
        }
        resp = requests.get(url,headers=headers).json()
        

        
        try:
            payment_status = resp['payment_status']
            order = Order.objects.get(payment_id=payment_id)
            order.status = payment_status
            order.actually_paid = resp['actually_paid']
            order.save()
            response = {
                "payment_status": payment_status,
                "address": resp['pay_address'],
                "amount": resp['pay_amount'],
                "actually_paid": resp['actually_paid'],
                "crypto": resp['pay_currency'],
                "order_id": resp['order_id'],
                "name": resp['order_description'],
                "expires": order.expiers,
                "status": order.status,
                #"username": order.username_buyer
                
            }
            
            if resp['payment_status'] == 'confirmed' or resp['payment_status'] == 'finished' or resp['payment_status'] == 'sending':
                order = Order.objects.get(payment_id=payment_id)
                message = order.product.delivery_message
                review_stars = order.review_stars
                review_message = order.review_message

                order.message = message
                order.status = 'confirmed'
                
                if review_stars != 0:
                    response['review_stars'] = order.review_stars
                if review_message != '':
                    response['review_message'] = order.review_message
                response['message'] = message

                order.save()
                if not Sent.objects.filter(code_url=code).exists():
                    seller_profile = Profile.objects.get(username=order.seller)
                    tele_id = seller_profile.tele_id
                    tele_token = seller_profile.tele_token
                    send_telegram(tele_id, tele_token, f'New order confirmed: {order.product.name}')#edit
                    discord_webhook = seller_profile.discord_webhook
                    send_discord(discord_webhook, 'New order confirmed', order.product.name)
                    Sent.objects.create(code_url=code)

            return JsonResponse(response)
        except Exception as e:
            return JsonResponse({"error": str(e)})
@method_decorator(ratelimit(key='ip', rate='5/m', block=True), name='dispatch')
class ReviewView(APIView):
    def post(self, request, code):
        
        order = Order.objects.get(code_url=code)
        if order.status != 'confirmed':
            return JsonResponse({"error": "Order not confirmed yet"})
        review_message = request.data['message']
        review_stars = request.data['stars']

        if order.review_message == '':
            order.review_message = review_message
        if order.review_stars == 0:
            order.review_stars = int(review_stars)
        order.save()
        try:
            
            response = {
                'message': order.review_message,
                'stars': order.review_stars,
            }
            return JsonResponse(response)
        except Exception as e:
            return JsonResponse({"error": str(e)})
        
@method_decorator(ratelimit(key='ip', rate='5/m', block=True), name='dispatch')
class EditDiscountView(APIView):
    permission_classes = [IsAuthenticated,IsOwner]
    def post(self, request):

        percentage = request.data.get("percentage")
        products_data = request.data.get("ids", [])
        

        if percentage > 100:
            return JsonResponse({"error": "Percentage must be less than or equal to 100"})
        try:
            if products_data == []:
                for item in Product.objects.filter(user=request.user):
                    item.discount = 0
                    item.save()
            for id_product in products_data:
                product = Product.objects.get(id=id_product)
                if product.user == request.user:
                    product.discount = percentage
                    product.save()
            response = {
                'products_data': products_data,
                'percentage': percentage,
            }
            return JsonResponse(response)
        except Exception as e:
            return JsonResponse({"error": str(e)})


@method_decorator(ratelimit(key='ip', rate='10/m', block=True), name='dispatch')
class OrderView(ListAPIView):
    serializer_class = OrderUserSerializer
    permission_classes = [IsAuthenticated,IsOwner]
    def get_queryset(self):
        return Order.objects.filter(seller=self.request.user).order_by('-created_at')
class OrderAdminView(ListAPIView):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

def ask_ai(word):
    r = Session()
    my_uuid = '4f846038-07cd-48b4-9a35-c8e02119a751'
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0",
        "Accept": "*/*",
    }
    url = f'https://chatthing.ai/api/bots/{my_uuid}/chats/new'
    resp = r.post(url,headers=headers)
    print(f'new chat : {resp.status_code}')
    my_id = resp.json()['id']
    url = f"https://chatthing.ai/api/bots/{my_uuid}/chats/{my_id}/messages"
    headers['Content-Type'] = 'application/json'

    locked_users = Profile.objects.filter(lock=True).values_list('username', flat=True)
    products = Product.objects.filter(hide=False).exclude(user__in=locked_users)

    products_list = [f"{product.name}:{product.simple_description}" for product in products]
    products_strings = ",".join(products_list)
    #products_strings = 'lkis:username instagram email not linked,Guess Instagram X:Guesser Instagram accept combo,Shahid VIP:Shahid account 3 months,Netflix Standard:Netflix Account for one user'
    msg = f'I have a list of product strings in the format (name_product:description) contained in {products_strings}. These products can include tools like checkers, cracking, gusser, bot, claimer, swaped, various accounts, usernames, or any other digital items. I need to perform an advanced search to identify products whose names or descriptions are closely related to the keyword {word}. Ensure to return the result as a single line of product names separated by commas, in the format (NameProduct1,NameProduct2,NameProduct3,...) I do not want any more details like to say based on you requets or any words I just need the list just only the list so the return from you will be ( LIST )'
    if '\n' in msg:
        msg = msg.replace('\n','')
    data = '{"message":"'+msg+'"}'
    resp = r.post(url,headers=headers,data=data)
    # print(f'send chat : {resp.status_code}')
    # print(f'resp chat : {resp.text}')
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0",
        "Accept": "*/*",
    }
    url = f'https://chatthing.ai/api/bots/{my_uuid}/chats/{my_id}/messages'
    resp = r.get(url,headers=headers)
    # print(f'resp chat : {resp.status_code}')
    # print(f'resp chat : {resp.text}')
    return resp.json()[2]['message']

@method_decorator(ratelimit(key='ip', rate='5/m', block=True), name='dispatch')
class SearchView(APIView):
    def get(self, request, word):
        
        resp = ask_ai(word)
        names = resp.split(',')
        products = Product.objects.filter(name__in=names)
        

        serializer = ProductPublicSerializer(products, many=True)
        try:
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error": str(e)})

@method_decorator(ratelimit(key='ip', rate='5/m', block=True), name='dispatch')
class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['image']

        # Upload the image to Imgur
        try:
            image_url = self.upload_image_to_imgur(image_file)
            return Response({"url": image_url}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def upload_image_to_imgur(self, image_file):
        headers = {"Authorization": "Client-ID aa22e62ec19c124"}
        url = "https://api.imgur.com/3/image"

        files = {'image': image_file}

        response = requests.post(url, headers=headers, files=files)

        if response.status_code == 200:
            json_response = response.json()
            return json_response['data']['link']
        else:
            raise Exception(f"Failed to upload image. Status code: {response.status_code}, Response: {response.text}")
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def clear_expired_tokens(request):
    now = timezone.now()
    expired_tokens = TokenDevice.objects.filter(end_time__lte=now)
    expired_count = expired_tokens.count()
    expired_tokens.delete()
    return Response({'status': 'done', 'expired_count': expired_count},status=status.HTTP_200_OK)

def admin_required(view_func):
    decorated_view_func = user_passes_test(
        lambda u: u.is_active and u.is_superuser,
        login_url="https://www.igstore.io/login",
        redirect_field_name=None,
    )(view_func)
    return decorated_view_func

class HideProductView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('id')
        product = get_object_or_404(Product, id=product_id)

        # Set hide to True
        product.hide = True
        product.save()

        return Response({"message": "Product hidden successfully."}, status=status.HTTP_200_OK)