# Buscador Rápido de Contenedores Portuarios

## 1. Problemática
En la operativa diaria de los terminales portuarios y garitas de acceso (*gates*), los operarios de patio y despachadores necesitan verificar rápidamente la información crítica de los contenedores (peso, categoría de carga, estado y ubicación asignada en el patio). 

Actualmente, esta información suele consultarse en reportes estáticos extensos o mediante accesos lentos a sistemas de gestión principal (como TOS / Navis N4). Esto genera congestión en las garitas de entrada/salida, pérdida de tiempo en la asignación de maquinaria de patio y posibles errores humanos al interpretar listas masivas de datos.

## 2. Usuario Objetivo
* **Operarios de Garita (Gate Operators):** Encargados del registro y validación del ingreso/salida de camiones con contenedores.
* **Supervisores de Patio:** Personal operativo encargado de verificar la correcta ubicación física de las unidades.
* **Despachadores Logísticos:** Personal a cargo de la gestión puntual de unidades prioritarias o con requerimientos especiales (p. ej. carga refrigerada/Reefer).

## 3. Objetivo de la Solución
Desarrollar una aplicación web ligera, intuitiva y de rápida respuesta que permita consultar los datos esenciales de cualquier contenedor en tiempo real mediante su código de identificación, optimizando el tiempo de respuesta en la garita y mejorando el flujo operativo de la terminal.

## 4. Funcionalidades Principales
* **Búsqueda Instantánea:** Consulta por código de serie de contenedor con validación básica de formato (p. ej., `MSKU1234567`).
* **Visualización de Ficha Operativa:** Presentación clara y diferenciada de datos clave:
  * Estado operativo (En Patio, En Tránsito, Inspección, Descargado).
  * Peso bruto y tipo de carga (General, Refrigerado/Reefer, Carga Peligrosa/IMO).
  * Coordenadas de ubicación asignada en el patio (Bloque, Fila, Bahía, Altura).
* **Alertas Visuales:** Indicadores de color para cargas especiales (p. ej., rojo/amarillo para IMO o Reefer).
* **Historial Rápido de Consultas:** Registro automático en el navegador (`localStorage`) de los últimos contenedores buscados para acceso en un clic.
* **Diseño Responsivo e Industrial:** Interfaz adaptable a pantallas de escritorios de garita o dispositivos móviles de patio.