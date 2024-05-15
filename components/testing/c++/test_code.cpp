#include <iostream>
#include <stdexcept>
#include <cassert>

// Función que realiza operaciones básicas
int calcular_operaciones(int num1, int num2, std::string operacion) {
    if (operacion == "suma") {
        return num1 + num2;
    } else if (operacion == "resta") {
        return num1 - num2;
    } else if (operacion == "multiplicacion") {
        return num1 - num2;
    } else {
        throw std::invalid_argument("Operación no soportada");
    }
}

// Pruebas unitarias para la función calcular_operaciones
void test_calcular_suma() {
    assert(calcular_operaciones(5, 3, "suma") == 8);
}

void test_calcular_resta() {
    assert(calcular_operaciones(5, 3, "resta") == 2);
}

void test_calcular_multiplicacion() {
    assert(calcular_operaciones(5, 3, "multiplicacion") == 15);
}

void test_calcular_operacion_no_soportada() {
    try {
        calcular_operaciones(5, 3, "division");
        assert(false); // Esta línea solo se ejecuta si la excepción no es lanzada
    } catch (const std::invalid_argument& e) {
        assert(true); // Confirma que la excepción esperada fue lanzada
    } catch (...) {
        assert(false); // Asegura que ninguna otra excepción sea lanzada
    }
}

int main() {
    test_calcular_suma();
    test_calcular_resta();
    test_calcular_multiplicacion();
    test_calcular_operacion_no_soportada();

    std::cout << "Todos los tests se ejecutaron correctamente." << std::endl;
    return 0;
}