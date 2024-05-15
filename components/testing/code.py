def calculate_operations(num1, num2, operation):
    if operation == 'add':
        return num1 + num2
    elif operation == 'subtract':
        return num1 - num2
    elif operation == 'multiply':
        return num1 * num2
    else:
        raise ValueError('Unsupported operation')

result_add = calculate_operations(5, 3, 'add')
print('Add result:', result_add)
result_subtract = calculate_operations(5, 3, 'subtract')
print('Subtract result:', result_subtract)
result_multiply = calculate_operations(5, 3, 'multiply')
print('Multiply result:', result_multiply)