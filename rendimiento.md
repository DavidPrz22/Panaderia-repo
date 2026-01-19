Implementa un sistema de rendimiento para las recetas de los productos elaborados.
El rendimiento se refiere a la cantidad de producto que se obtiene de la receta en la unidad de medida del producto.

Agrega un campo de rendimiento al modelo receta.
En ```/home/davidprz/projects/PanaderiaSystem/backend/djangobackend/apps/produccion/models.py```
este campo es opcional.

Instrucciones:
    Backend: 
    - Agrega el campo rendimiento al modelo receta.
    - Agrega el campo rendimiento al serializer de receta.
    - Agrega el campo rendimiento al viewset de receta.
    - Agrega el campo rendimiento a la action 'get_receta_detalles' de la receta principal.

    Frontend: 

    Para la feature de recetas:
    ```/home/davidprz/projects/PanaderiaSystem/frontend/src/features/recetas/```
    - Agrega el campo rendimiento al schema de receta. /home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Recetas/schemas/schemas.ts

    - Agrega el campo rendimiento al formulario de receta para crear receta y editar receta.
    ```/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Recetas/components/RecetasFormShared.tsx```

    - Agrega el campo rendimiento al panel de detalles de receta.
    ```/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Recetas/components/RecetasDetalles.tsx```


    Para la feature de produccion:
    ```/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Production```

    En el apartado de produccion, cuando se seleccione un producto en 
    ```/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Production/components/ProductionRegisterCard.tsx```
    y el backend trae la receta para producir,

    si la receta tiene rendimiento, el valor del input, campo cantidad del producto elaborado se cambia a la cantidad de rendimiento de la receta, si no tiene rendimiento, el valor del input, campo cantidad del producto elaborado se deja como esta.
    ```/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Production/components/ProductionCantidad.tsx```

    Agrega un pequeño texto que indique el rendimiento de la receta.
    ```/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Production/components/ProductionForm.tsx```

