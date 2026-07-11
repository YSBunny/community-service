package io.github.ysbunny.community.user.service;

import io.github.ysbunny.community.user.domain.Role;
import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.user.dto.request.CreateUserRequest;
import io.github.ysbunny.community.user.dto.request.UpdateUserRequest;
import io.github.ysbunny.community.user.dto.response.UserInformationResponse;
import io.github.ysbunny.community.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("email already exists");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getEmail(),
                encodedPassword,
                request.getNickname(),
                request.getProfileImage(),
                Role.USER
        );
        return userRepository.save(user);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    @PreAuthorize("@userRepository.findById(#id).get().getEmail() == authentication.name")
    public UserInformationResponse getUser(String loginEmail, Long id) {
        User user = userRepository.findByEmail(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        return new UserInformationResponse(user.getEmail(), user.getNickname(), user.getProfileImage());
    }

    @Transactional
    @PreAuthorize("@userRepository.findById(#id).get().getEmail() == authentication.name")
    public User updateUser(String loginEmail, Long id, UpdateUserRequest request) {
        User loginUser = userRepository.findByEmail(loginEmail)
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
    @PreAuthorize("@userRepository.findById(#id).get().getEmail() == authentication.name")
    public void deleteUser(String loginEmail, Long id) {
        User loginUser = userRepository.findByEmail(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        User findUser = findById(id);

        if (!loginUser.getId().equals(findUser.getId())) {
            throw new IllegalArgumentException("unauthorized user");
        }

        userRepository.deleteById(id);
    }
}
