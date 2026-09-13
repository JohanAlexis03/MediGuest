# Requerimientos Funcionales — MediQuest (Gherkin)

Funcionalidad: Registro de estudiante
  Como estudiante nuevo de APH
  Quiero crear una cuenta en MediQuest
  Para poder resolver casos clínicos

  Escenario: Un estudiante nuevo crea su cuenta
    Dado que soy un estudiante nuevo sin credenciales
    Cuando toco el botón "Registrar"
    Y completo mi correo y mi contraseña
    Entonces el sistema crea mi cuenta
    Y me permite ingresar al aplicativo

Funcionalidad: Inicio de sesión
  Como estudiante registrado
  Quiero ingresar con mis credenciales
  Para resolver casos clínicos

  Escenario: El estudiante ingresa con credenciales válidas
    Dado que soy un estudiante autenticado en la base de datos
    Cuando ingreso mi usuario y mi contraseña
    Y presiono el botón "Iniciar sesión"
    Entonces el sistema valida mis credenciales
    Y me muestra la pantalla de casos clínicos

  Escenario: El estudiante ingresa con credenciales incorrectas
    Dado que soy un estudiante registrado en la base de datos
    Cuando ingreso mi usuario y una contraseña incorrecta
    Y presiono el botón "Iniciar sesión"
    Entonces el sistema me muestra el mensaje "Usuario o contraseña incorrectos"
    Y no me permite ingresar al aplicativo

Funcionalidad: Resolución de casos clínicos
  Como estudiante de APH
  Quiero resolver casos clínicos interactivos
  Para fortalecer mi razonamiento clínico

  Escenario: El estudiante responde correctamente
    Dado que soy un estudiante autenticado
    Y que seleccioné el caso "Dolor abdominal"
    Cuando respondo la pregunta "¿Cuál es el diagnóstico más probable?"
    Con la opción "C. Colecistitis aguda"
    Y envío mis respuestas
    Entonces el sistema evalúa mis respuestas
    Y me muestra mi puntuación obtenida

  Escenario: El estudiante se equivoca y recibe explicación
    Dado que soy un estudiante autenticado
    Y que seleccioné el caso "Dolor abdominal"
    Cuando respondo la pregunta "¿Cuál es el diagnóstico más probable?"
    Con la opción "A. Apendicitis aguda"
    Y envío mis respuestas
    Entonces el sistema me indica que la respuesta es incorrecta
    Y me explica por qué la opción correcta es "C. Colecistitis aguda"