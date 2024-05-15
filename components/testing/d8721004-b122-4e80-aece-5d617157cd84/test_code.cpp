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
        return num1 * num2;
    } else if (operacion == "division") {
        if (num2 == 0) throw std::invalid_argument("División por cero");
        return num1 / num2;
    } else {
        throw std::invalid_argument("Operación no soportada");
    }
}

// Pruebas unitarias para la función calcular_operaciones
void test_calcular_suma() {
    assert(calcular_operaciones(5, 3, "suma") == 8);
}

void test_calcular_resta() {
    assert(calcular_operaciones(5, 3, "resta") == 8); // Intencionalmente incorrecto para fallar
}

void test_calcular_multiplicacion() {
    assert(calcular_operaciones(5, 3, "multiplicacion") == 15);
}

void test_calcular_division() {
    assert(calcular_operaciones(10, 2, "division") == 3); // Intencionalmente incorrecto para fallar
}

void test_division_por_cero() {
    try {
        calcular_operaciones(5, 0, "division");
        assert(false); // Esta línea solo se ejecuta si la excepción no es lanzada
    } catch (const std::invalid_argument& e) {
        assert(true); // Confirma que la excepción esperada fue lanzada
    } catch (...) {
        assert(false); // Asegura que ninguna otra excepción sea lanzada
    }
}

void test_calcular_operacion_no_soportada() {
    try {
        calcular_operaciones(5, 3, "potencia");
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
    test_calcular_division();
    test_division_por_cero();
    test_calcular_operacion_no_soportada();

    std::cout << "Algunos tests no se ejecutaron correctamente." << std::endl;
    return 0;
}