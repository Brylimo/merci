package com.thxpapa.merci.util;

import org.jasypt.encryption.StringEncryptor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ErrorUtilTest {
    @Autowired
    @Qualifier("jasyptStringEncryptor")
    private StringEncryptor stringEncryptor;

    @Test
    void testJasypt() {
        String str = stringEncryptor.encrypt("F02FE8AD-9E1F-324F-9869-72F49AFD6314");
        // String str2 = stringEncryptor.decrypt("");
        System.out.println("[[" + str + "]]");
    }
}
