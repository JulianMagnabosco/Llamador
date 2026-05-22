from django.apps import AppConfig


class InicioConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'inicio'
    # def ready(self):
    #     # Makes sure all signal handlers are connected
    #     from inicio import handlers  # noqa
