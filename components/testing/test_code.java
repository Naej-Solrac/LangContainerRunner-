public class test_code {
    public static void testSum() {
        int a = 5;
        int b = 3;
        assert (a + b) == 8 : "Test failed: 5 + 3 should equal 8";
        System.out.println("Test passed: 5 + 3 equals 8");
    }

    public static void main(String[] args) {
        testSum();
    }
}