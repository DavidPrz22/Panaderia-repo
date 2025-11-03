from django.contrib import admin

# Register your models here.
from apps.users.models import User
from apps.inventario.models import MateriasPrimas, ProductosElaborados, ProductosReventa, LotesMateriasPrimas, LotesProductosElaborados, LotesProductosReventa, UnidadesDeMedida

admin.site.register(User)
admin.site.register(MateriasPrimas)
admin.site.register(ProductosElaborados)
admin.site.register(ProductosReventa)
admin.site.register(LotesMateriasPrimas)
admin.site.register(LotesProductosElaborados)
admin.site.register(LotesProductosReventa)
admin.site.register(UnidadesDeMedida)