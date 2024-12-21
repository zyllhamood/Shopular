from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from django.db.models import Count
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
def get_recommended_products(product_name, product_description):
    # Get all products
    locked_users = Profile.objects.filter(lock=True).values_list('username', flat=True)
    products = Product.objects.filter(hide=False).exclude(name=product_name).exclude(user__in=locked_users)

    # Create a DataFrame from the product data
    data = {
        'name': [product.name for product in products],
        'simple_description': [product.simple_description for product in products]
    }
    df = pd.DataFrame(data)

    # Add the input product to the DataFrame
    input_product = pd.DataFrame({'name': [product_name], 'simple_description': [product_description]})
    df = pd.concat([df, input_product], ignore_index=True)

    # Create a TF-IDF Vectorizer and transform the descriptions
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['simple_description'])

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Get the similarity scores for the input product
    sim_scores = list(enumerate(cosine_sim[-1]))

    # Sort the products based on similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the indices of the most similar products (excluding the input product itself)
    similar_products_indices = [i[0] for i in sim_scores[1:5]]  # limiting to top 5 recommendations

    # Get the recommended products
    recommended_products = df.iloc[similar_products_indices]

    # Return the names of the recommended products
    return recommended_products['name'].tolist()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    def create(self, validated_data):
        try:
            user = User.objects.create_user(**validated_data)
            Profile.objects.create(username=user,email=user.email)
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        return user
class UserInfoSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id", "username", "is_superuser","email","avatar"]
    def get_avatar(self, obj):
        try:
            profile = Profile.objects.get(username=obj)
            if profile.avatar:
                return profile.avatar
        except Profile.DoesNotExist:
            pass
        
        # Generate the avatar URL using UI Avatars
        name = obj.username
        default_avatar_url = f"https://ui-avatars.com/api/?name={name}"
        return default_avatar_url

class ProfilePublicSerializer(serializers.ModelSerializer):
    sold = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    all_reviews = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['username','avatar','full_name','bio','sold','reviews','all_reviews','email_contact','instagram','telegram','discord','snapchat','twitter','other_payment']

    def get_sold(self, obj):
        return Order.objects.filter(seller=obj.username, status='confirmed').count()
    def get_all_reviews(self, obj):
        return Order.objects.filter(seller=obj.username, review_stars__gt=0).count()
    def get_reviews(self, obj):
        # Annotate the orders to count the frequency of each review_stars value
        review_counts = Order.objects.filter(seller=obj.username, review_stars__gt=0).values('review_stars').annotate(count=Count('review_stars')).order_by('-count', '-review_stars')
        
        # Get the most frequent review_stars value
        if review_counts:
            return review_counts[0]['review_stars']
        return None
    
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')

    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'full_name', 'bio', 'avatar', 'message', 'tele_id', 'tele_token', 'discord_webhook', 'instagram', 'email_contact', 'telegram', 'discord', 'twitter', 'snapchat','api_key', 'other_payment']
class ProfileAdminSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'username', 'user_id', 'lock', 'reviews', 'full_name']

    def get_user_id(self, obj):
        return obj.username.id

    def get_username(self, obj):
        return obj.username.username
class ProductPublicSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    sales = serializers.SerializerMethodField()
    stars = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id','user','avatar','discount','name','price','simple_description','image_url','category','platform','hide','place','created_at','reviews','sales','stars']
    def get_user(self, obj):
        return obj.user.username
    def get_reviews(self, obj):
        return Order.objects.filter(product=obj, review_stars__gt=0).count() #here the code
    def get_stars(self, obj):
        review_counts = Order.objects.filter(product=obj, review_stars__gt=0).values('review_stars').annotate(count=Count('review_stars')).order_by('-count', '-review_stars')        
        if review_counts:
            return review_counts[0]['review_stars']
        return 0
    def get_sales(self, obj):
        return Order.objects.filter(product=obj, status='confirmed').count()
    def get_avatar(self, obj):
        try:
            profile = Profile.objects.get(username=obj.user)
            if profile.avatar:
                return profile.avatar
        except Profile.DoesNotExist:
            pass
        
        # Generate the avatar URL using UI Avatars
        name = obj.user.username
        default_avatar_url = f"https://ui-avatars.com/api/?name={name}"
        return default_avatar_url
class ProductInfoSerializer(serializers.ModelSerializer):
    sales = serializers.SerializerMethodField()
    other_payment = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    stars = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    username_rating = serializers.SerializerMethodField()
    username_avatar = serializers.SerializerMethodField()
    recommended = serializers.SerializerMethodField()
    accepting_crypto = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id','user','recommended','discount','username','accepting_crypto','username_rating','username_avatar', 'name', 'price', 'description','simple_description', 'image_url', 'hide', 'sales','other_payment','reviews','stars']
    def get_sales(self, obj):
        return Order.objects.filter(product=obj, status='confirmed').count()
    def get_reviews(self, obj):
        return Order.objects.filter(product=obj, review_stars__gt=0).count() #here the code
    def get_stars(self, obj):
        review_counts = Order.objects.filter(product=obj, review_stars__gt=0).values('review_stars').annotate(count=Count('review_stars')).order_by('-count', '-review_stars')        
        if review_counts:
            return review_counts[0]['review_stars']
        return 0
    def get_other_payment(self, obj):
        if obj.user:
            return Profile.objects.get(username=obj.user).other_payment
        return None
    def get_username(self, obj):
        return obj.user.username
        
    
    def get_username_rating(self, obj):
        # Annotate the orders to count the frequency of each review_stars value
        review_counts = Order.objects.filter(seller=obj.user, review_stars__gt=0).values('review_stars').annotate(count=Count('review_stars')).order_by('-count', '-review_stars')
        
        # Get the most frequent review_stars value
        if review_counts:
            return review_counts[0]['review_stars']
        return None
    
    def get_username_avatar(self, obj):
        if obj.user:
            return Profile.objects.get(username=obj.user).avatar
        return None
    def get_recommended(self, obj):
        recommended_product_names = get_recommended_products(obj.name, obj.simple_description)
        recommended_products = Product.objects.filter(hide=False,name__in=recommended_product_names)
        return ProductPublicSerializer(recommended_products, many=True).data
    def get_accepting_crypto(self, obj):
        if obj.user:
            api_key =  Profile.objects.get(username=obj.user).api_key
            if api_key == '' or api_key == None:
                return False
            return True
        return False
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'price', 'description', 'image_url', 'simple_description', 'category','platform', 'hide','delivery_message']
    def create(self, validated_data):
        user = self.context['request'].user
        return Product.objects.create(user=user, **validated_data)
class ProductAdminSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id','user','username','name','image_url','place']
    def get_username(self, obj):
        return obj.user.username

class ProductPlace(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','place','name']
class ProductUser(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','name','category','hide','image_url','discount']   
    


class OrderSerializer(serializers.ModelSerializer):
    seller_username = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = '__all__'
    def get_seller_username(self, obj):
        return obj.seller.username
    
class OrderUserSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'username_buyer', 'social_user', 'email_buyer', 'crypto',
            'address', 'amount', 'message', 'code_url', 'payment_id', 'created_at',
            'status', 'review_stars', 'review_message', 'expiers', 'product', 'product_name', 'actually_paid'
        ]

    def get_product_name(self, obj):
        if obj.product:
            return obj.product.name
        return None