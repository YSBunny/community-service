package io.github.ysbunny.community.user.domain;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void 사용자_생성() {
        // given
        String email = "selina.yang@ktb.com";
        String password = "password123!";
        String nickname = "selina";
        String profileImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10";
        Role role = Role.USER;

        // when
        User user = new User(email, password, nickname, profileImage, role);

        // then
        assertEquals(email, user.getEmail());
        assertEquals(password, user.getPassword());
        assertEquals(nickname, user.getNickname());
        assertEquals(profileImage, user.getProfileImage());
        assertEquals(role, user.getRole());
    }

    @Test
    void 비밀번호_변경() {
        // given
        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        // when
        user.changePassword("newpassword");

        // then
        assertEquals("newpassword", user.getPassword());
    }

    @Test
    void 닉네임_변경() {
        // given
        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        // when
        user.changeNickname("kevin");

        // then
        assertEquals("kevin", user.getNickname());
    }

    @Test
    void 프로필이미지_변경() {
        // given
        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        // when
        user.changeProfileImage("https://i.pinimg.com/736x/22/b6/d0/22b6d0bce1020377ff47394cbf9b2817.jpg");

        // then
        assertEquals("https://i.pinimg.com/736x/22/b6/d0/22b6d0bce1020377ff47394cbf9b2817.jpg", user.getProfileImage());
    }
}