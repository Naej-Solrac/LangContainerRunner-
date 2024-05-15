def calcular_operaciones(num1, num2, operacion):
    if operacion == 'suma':
        return num1 + num2
    elif operacion == 'resta':
        return num1 - num2
    elif operacion == 'multiplicacion':
        return num1 * num2
    else:
        raise ValueError('Operación no soportada')

resultado_suma = calcular_operaciones(5, 3, 'suma')
print('Resultado suma:', resultado_suma)
resultado_resta = calcular_operaciones(5, 3, 'resta')
print('Resultado resta:', resultado_resta)
resultado_multiplicacion = calcular_operaciones(5, 3, 'multiplicacion')
print('Resultado multiplicación:', resultado_multiplicacion)