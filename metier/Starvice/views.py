from django.http import HttpResponse
from django.http.response import HttpResponseForbidden


def login(request):
    username = request.GET.get('username', '')
    password = request.GET.get('password', '')

    if username == '' or password == '':
        return HttpResponseForbidden('Username or password cannot be empty')

    return HttpResponse("Login page")