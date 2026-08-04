package io.github.ysbunny.community;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"jwt.secret=dGVzdC1qd3Qtc2VjcmV0LWtleS1mb3ItY29tbXVuaXR5LXNlcnZpY2UtMTIzNDU2Nzg5MA==",
		"jwt.expiration=3600000"
})
class CommunityServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
