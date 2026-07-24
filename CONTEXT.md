# Horariofy

## Descripción

Horariofy es una aplicación web para crear horarios universitarios de forma visual mediante una interfaz de arrastrar y soltar (drag & drop).

La idea nace de un problema personal: cada inicio de ciclo termino usando Canva para diseñar mi horario porque las opciones existentes son poco atractivas o demasiado complejas.

El objetivo no es competir con Google Calendar, sino crear la forma más rápida y agradable de construir un horario bonito que pueda descargarse como imagen y compartirse.

---

# Objetivo del proyecto

Crear una herramienta donde un estudiante pueda construir su horario en menos de cinco minutos.

El usuario solo debe:

- Crear sus cursos.
- Arrastrarlos hacia una grilla semanal.
- Ajustar su duración.
- Descargar el resultado como una imagen.

Todo debe sentirse rápido, intuitivo y visual.

---

# Público objetivo

- Estudiantes universitarios.
- Estudiantes de instituto.
- Personas que quieran organizar una semana mediante bloques.

Inicialmente el enfoque está completamente orientado al entorno universitario.

---

# Filosofía del producto

El horario es el protagonista.

La aplicación no debe sentirse como un formulario, sino como un editor visual similar a Canva o Figma.

La mayor parte del tiempo el usuario interactúa directamente con la grilla.

---

# MVP

La primera versión será completamente local.

No tendrá:

- Autenticación.
- Base de datos.
- Backend.
- Sincronización.

Toda la información se almacenará en LocalStorage.

El objetivo del MVP es validar la experiencia de uso.

---

# Flujo principal

1. El usuario crea uno o varios cursos.
2. Cada curso aparece como una tarjeta.
3. El usuario arrastra la tarjeta hacia la grilla.
4. La tarjeta se ajusta automáticamente a la celda correspondiente.
5. El usuario puede cambiar la duración del bloque.
6. Los cambios se guardan automáticamente.
7. El usuario exporta el horario como imagen.

---

# Funcionalidades del MVP

## Gestión de cursos

Cada curso tendrá:

- Nombre.
- Profesor.
- Aula o ubicación.
- Color.

Los colores pueden asignarse automáticamente.

---

## Grilla semanal

La grilla estará compuesta por:

Columnas:

- Lunes
- Martes
- Miércoles
- Jueves
- Viernes

Filas:

- Horas configurables.

Ejemplo:

7:00
8:00
9:00
10:00

---

## Drag & Drop

El usuario podrá:

- Arrastrar cursos.
- Reubicarlos.
- Cambiar de día.
- Moverlos entre horarios.
- Ajustarlos automáticamente a la grilla.

---

## Redimensionar bloques

Cada tarjeta podrá aumentar o disminuir su duración arrastrando su borde inferior.

---

## Detección de conflictos

Si dos cursos ocupan el mismo horario:

- Se mostrará una advertencia visual.
- No se permitirá la superposición.

---

## Guardado automático

Cada modificación actualizará automáticamente LocalStorage.

No existirá botón de guardar.

---

## Exportación

El horario podrá exportarse inicialmente como:

- PNG.

En versiones futuras:

- PDF.
- SVG.

---

# Funcionalidades futuras

- Varios horarios.
- Horarios por ciclo.
- Inicio de sesión.
- Sincronización en la nube.
- Compartir mediante enlace.
- Temas personalizados.
- Paletas de colores.
- Fondos.
- Plantillas.
- Modo móvil mejorado.
- Horarios para sábados.
- Intervalos personalizados.

---

# Stack tecnológico

## Frontend

- Next.js
- React
- TypeScript

## Estilos

- Tailwind CSS
- shadcn/ui

## Estado global

- Zustand

## Drag & Drop

- dnd-kit

## Animaciones

- Motion

## Exportación

- html-to-image

## Persistencia

- LocalStorage

---

# Principios de diseño

La interfaz debe sentirse:

- Limpia.
- Moderna.
- Minimalista.
- Rápida.
- Espaciosa.
- Fácil de entender.

Debe evitar formularios innecesarios.

El usuario debería poder construir un horario casi sin leer instrucciones.

---

# Inspiración

No buscamos copiar otras aplicaciones.

Solo tomaremos inspiración de:

- Figma.
- Canva.
- Linear.
- Notion.
- Raycast.
- Apple Calendar.
- Google Calendar (únicamente las interacciones de arrastrar y soltar).

---

# Arquitectura

Separar claramente:

- Componentes.
- Estado.
- Lógica de negocio.
- Utilidades.
- Tipos.

Evitar lógica compleja dentro de los componentes siempre que sea posible.

---

# Estructura inicial (Elegir esta de forma opcional, la cosa es que sea escalable)

src/

app/

components/
    schedule/
    sidebar/
    toolbar/
    ui/

features/
    courses/
    schedule/
    export/

stores/

hooks/

types/

utils/

lib/

---

# Principios de desarrollo

- Mantener componentes pequeños.
- Priorizar la legibilidad.
- Evitar abstracciones innecesarias.
- Aprovechar TypeScript al máximo.
- Escribir código fácil de mantener.
- Mantener una estructura consistente durante todo el proyecto.

---

# Definición de terminado

Una funcionalidad se considera terminada cuando:

- Funciona correctamente.
- No presenta errores visibles.
- Es responsive.
- Es accesible.
- Mantiene la consistencia visual del proyecto.
- Se integra naturalmente con el resto de la aplicación.

---

# Visión a largo plazo

Horariofy debe convertirse en la forma más sencilla y estética de crear un horario universitario.

El objetivo no es añadir cientos de funciones, sino ofrecer una experiencia excelente alrededor de una única tarea: diseñar un horario bonito en pocos minutos.

La aplicación debe sentirse como una herramienta de diseño, no como un sistema administrativo.