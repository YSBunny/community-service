package io.github.ysbunny.community.service;

import io.github.ysbunny.community.dto.user.*;
import io.github.ysbunny.community.entity.User;
import io.github.ysbunny.community.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.UUID;

@Service
@Validated
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public User createUser(CreateUserRequest request) {
        User user = new User(
                request.getEmail(),
                request.getPassword(),
                request.getNickname(),
                request.getProfileImage()
        );
        return userRepository.save(user);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    @Transactional
    public LoginUserResponse login(LoginUserRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("email does not exist"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("password does not match");
        }

        String loginToken = UUID.randomUUID().toString();
        user.login(loginToken);

        return new LoginUserResponse(user.getId(), loginToken);
    }

    public UserInformationResponse getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        return new UserInformationResponse(user.getEmail(), user.getNickname(), user.getProfileImage());
    }

    @Transactional
    public User updateUser(String loginToken, Long id, UpdateUserRequest request) {
        User loginUser = userRepository.findByLoginToken(loginToken)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        User findUser = findById(id);

        if (!loginUser.getId().equals(findUser.getId())) {
            throw new IllegalArgumentException("unauthorized user");
        }

        if (request.getPassword() != null) {
            findUser.changePassword(request.getPassword());
        }
        if (request.getNickname() != null) {
            findUser.changeNickname(request.getNickname());
        }
        if (request.getProfileImage() != null) {
            findUser.changeProfileImage(request.getProfileImage());
        }
        return findUser;
    }

    @Transactional
    public LogoutUserResponse logout(LogoutUserRequest request) {
        User user = userRepository.findByLoginToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        user.logout();

        return new LogoutUserResponse("logout success");
    }

    @Transactional
    public void deleteUser(String loginToken, Long id) {
        User loginUser = userRepository.findByLoginToken(loginToken)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        User findUser = findById(id);

        if (!loginUser.getId().equals(findUser.getId())) {
            throw new IllegalArgumentException("unauthorized user");
        }

        userRepository.deleteById(id);
    }
}
