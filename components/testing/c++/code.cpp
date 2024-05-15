#include <iostream>
#include <stdexcept>

int calcular_operaciones(int num1, int num2, std::string operacion) {
    if (operacion == "suma") {
        return num1 + num2;
    } else if (operacion == "resta") {
        return num1 - num2;
    } else if (operacion == "multiplicacion") {
        return num1 * num2;
    } else {
        throw std::invalid_argument("Operación no soportada");
    }
}

int main() {
    try {
        int resultado_suma = calcular_operaciones(5, 3, "suma");
        std::cout << "Resultado suma: " << resultado_suma << std::endl;
        int resultado_resta = calcular_operaciones(5, 3, "resta");
        std::cout << "Resultado resta: " << resultado_resta << std::endl;
        int resultado_multiplicacion = calcular_operaciones(5, 3, "multiplicacion");
        std::cout << "Resultado multiplicación: " << resultado_multiplicacion << std::endl;
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
    return 0;
}