import pytest

def calcular_operaciones(num1, num2, operacion):
    if operacion == 'suma':
        return num1 + num2
    elif operacion == 'resta':
        return num1 - num2
    elif operacion == 'multiplicacion':
        return num1 * num2
    else:
        raise ValueError('Operación no soportada')

def test_calcular_suma():
    assert calcular_operaciones(5, 3, 'suma') == 8, 'La función debería retornar 8 para suma'

def test_calcular_resta():
    assert calcular_operaciones(5, 3, 'resta') == 2, 'La función debería retornar 2 para resta'

def test_calcular_multiplicacion():
    assert calcular_operaciones(5, 3, 'multiplicacion') == 20, 'La función debería retornar 15 para multiplicación'

def test_calcular_operacion_no_soportada():
    with pytest.raises(ValueError):
        calcular_operaciones(5, 3, 'division')