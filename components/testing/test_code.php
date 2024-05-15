<?php
    class TestCode {
        public static function testSum() {
            $a = 5;
            $b = 3;
            assert(($a + $b) === 8, "Test failed: 5 + 3 should equal 8");
            echo "Test passed: 5 + 3 equals 8\n";
        }

        public static function main() {
            self::testSum();
        }
    }
    TestCode::main();
?>