from django.urls import path
from .views import *

urlpatterns = [
    path('login/',LoginView.as_view()),#done
    path('register/',RegisterView.as_view()),#done
    path('change-password/',ChangePasswordView.as_view()),#done
    path('info/',user_info),#done

    path('add-product/',AddProductView.as_view()),#done
    path('edit-product/<int:id>/',EditProductView.as_view()),#done
    path('delete-product/<int:id>/',DeleteProductView.as_view()),#done
    path('products/',ProductPublicView.as_view()),#done
    path('products/filter/', ProductPublicFilter.as_view()),
    path('products/<str:username>/',ProductUserPublicView.as_view()),#done
    path('my-products/<str:username>/',ProductUserView.as_view()),#done
    path('product/<int:id>/',ProductInfoView.as_view()),#done
    path('admin-products/',ProductAdminView.as_view()),#done
    path('edit-place/<int:id>/',EditProductAdminView.as_view()),#done

    path('@<str:username>/', ProfilePublicView.as_view()),#done
    path('profile/<str:username>/', ProfileView.as_view()),#done
    path('users/',ProfileAdminView.as_view()),#done
    path('locked/<int:id>/',EditProfileAdminView.as_view()),#done

    path('create-payment/',CreatePaymentView.as_view()),#done
    path('payment/<str:code>/',PaymentStatusView.as_view()),#done
    path('review/<str:code>/',ReviewView.as_view()),#done
    path('orders/',OrderView.as_view()),#done
    path('all-orders/',OrderAdminView.as_view()),

    path('search/<str:word>/',SearchView.as_view()),

    path('upload-image/', ImageUploadView.as_view()),
    path('get-token/',get_random_token),
    path('clear-tokens/',clear_expired_tokens),
    path('tested/',tested),

    path('set-discount/',EditDiscountView.as_view()),

    path('hide-product/',HideProductView.as_view())
]