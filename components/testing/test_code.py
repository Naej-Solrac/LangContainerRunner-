import pytest

def calculate_operations(num1, num2, operation):
    if operation == 'add':
        return num1 + num2
    elif operation == 'subtract':
        return num1 - num2
    elif operation == 'multiply':
        return num1 * num2
    else:
        raise ValueError('Unsupported operation')

def test_calculate_add():
    assert calculate_operations(5, 3, 'add') == 8, 'The function should return 8 for add'

def test_calculate_subtract():
    assert calculate_operations(5, 3, 'subtract') == 2, 'The function should return 2 for subtract'

def test_calculate_multiply():
    assert calculate_operations(5, 3, 'multiply') == 15, 'The function should return 15 for multiply'

def test_calculate_unsupported_operation():
    with pytest.raises(ValueError):
        calculate_operations(5, 3, 'division')