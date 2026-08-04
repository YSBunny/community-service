package io.github.ysbunny.community.user.service;

import io.github.ysbunny.community.global.file.FileService;
import io.github.ysbunny.community.user.domain.Role;
import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.user.dto.request.CreateUserRequest;
import io.github.ysbunny.community.user.dto.request.UpdateUserRequest;
import io.github.ysbunny.community.user.dto.response.UserInformationResponse;
import io.github.ysbunny.community.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private FileService fileService;

    @InjectMocks
    private UserService userService;

    @Test
    void 회원가입_성공() {
        // given
        MultipartFile profileImage = new MockMultipartFile(
                "profileImage",    // 요청 파라미터 이름
                "profile.png",           // 원본 파일명
                "image/png",             // Content-Type
                "test image".getBytes()  // 파일 내용
        );

        CreateUserRequest request = new CreateUserRequest(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                profileImage
        );

        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(fileService.saveImage(profileImage, "profiles")).thenReturn("profile.png");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        userService.createUser(request);

        // then
        verify(userRepository, times(1)).existsByEmail(request.getEmail());
        verify(passwordEncoder, times(1)).encode(request.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void 이메일_중복_회원가입_실패() {
        // given
        MultipartFile profileImage = new MockMultipartFile(
                "profileImage",    // 요청 파라미터 이름
                "profile.png",           // 원본 파일명
                "image/png",             // Content-Type
                "test image".getBytes()  // 파일 내용
        );

        CreateUserRequest request = new CreateUserRequest(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                profileImage
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // when & then
        assertThrows(IllegalArgumentException.class, () -> userService.createUser(request));
    }

    @Test
    void 회원_조회() {
        // given
        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        when(userRepository.findByEmailAndDeletedAtIsNull("selina.yang@ktb.com")).thenReturn(Optional.of(user));

        // when
        UserInformationResponse response = userService.getUser("selina.yang@ktb.com", 1L);

        // then
        assertNotNull(response);
        assertEquals("selina.yang@ktb.com", response.getEmail());
        assertEquals("selina", response.getNickname());
        assertEquals(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                response.getProfileImage()
        );

        verify(userRepository, times(1)).findByEmailAndDeletedAtIsNull("selina.yang@ktb.com");
    }

    @Test
    void 회원정보_수정() {
        // given
        MultipartFile profileImage = new MockMultipartFile(
                "profileImage",    // 요청 파라미터 이름
                "profile.png",           // 원본 파일명
                "image/png",             // Content-Type
                "test image".getBytes()  // 파일 내용
        );

        UpdateUserRequest request = new UpdateUserRequest(
                "newPassword123!",
                "newSelina",
                profileImage
        );

        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        ReflectionTestUtils.setField(user, "id", 1L);

        when(userRepository.findByEmailAndDeletedAtIsNull("selina.yang@ktb.com")).thenReturn(Optional.of(user));
        when(userRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedNewPassword");
        when(fileService.saveImage(profileImage, "profiles")).thenReturn("profile.png");

        // when
        userService.updateUser("selina.yang@ktb.com", 1L, request);

        // then
        verify(userRepository, times(1)).findByEmailAndDeletedAtIsNull("selina.yang@ktb.com");
        verify(userRepository, times(1)).findByIdAndDeletedAtIsNull(1L);
        verify(passwordEncoder, times(1)).encode(request.getPassword());

        assertEquals("encodedNewPassword", user.getPassword());
        assertEquals("newSelina", user.getNickname());
        assertEquals(
                "profile.png",
                user.getProfileImage()
        );
    }

    @Test
    void 회원탈퇴() {
        // given
        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        ReflectionTestUtils.setField(user, "id", 1L);

        when(userRepository.findByEmailAndDeletedAtIsNull("selina.yang@ktb.com")).thenReturn(Optional.of(user));
        when(userRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(user));

        // when
        userService.deleteUser("selina.yang@ktb.com", 1L);

        // then
        verify(userRepository, times(1)).findByEmailAndDeletedAtIsNull("selina.yang@ktb.com");
        verify(userRepository, times(1)).findByIdAndDeletedAtIsNull(1L);
        assertNotNull(user.getDeletedAt());
    }
}