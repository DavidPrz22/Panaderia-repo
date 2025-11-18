from django.core.management.base import BaseCommand
from apps.core.models import UnidadesDeMedida, ConversionesUnidades
from decimal import Decimal


class Command(BaseCommand):
    help = 'Add additional unit conversions'

    def handle(self, *args, **options):
        try:
            g = UnidadesDeMedida.objects.get(nombre_completo='Gramo', tipo_medida='Peso')
            mg = UnidadesDeMedida.objects.get(nombre_completo='Miligramo', tipo_medida='Peso')
            kg = UnidadesDeMedida.objects.get(nombre_completo='Kilogramo', tipo_medida='Peso')
            l = UnidadesDeMedida.objects.get(nombre_completo='Litro', tipo_medida='Volumen')
            ml = UnidadesDeMedida.objects.get(nombre_completo='Mililitro', tipo_medida='Volumen')

            conversions = [
                (g, mg, Decimal('1000.000000')),
                (mg, g, Decimal('0.001000')),
                (mg, kg, Decimal('0.000001')),
                (kg, mg, Decimal('1000000.000000')),
                (g, kg, Decimal('0.001000')),
                (kg, g, Decimal('1000.000000')),
                (l, ml, Decimal('1000.000000')),
                (ml, l, Decimal('0.001000')),
            ]
            
            for origen, destino, factor in conversions:
                ConversionesUnidades.objects.get_or_create(
                    unidad_origen=origen,
                    unidad_destino=destino,
                    defaults={'factor_conversion': factor}
                )
            
            self.stdout.write(self.style.SUCCESS('Successfully added conversions'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))