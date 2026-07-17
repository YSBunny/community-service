package io.github.ysbunny.community.user.controller;

import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.user.dto.request.CreateUserRequest;
import io.github.ysbunny.community.user.dto.request.UpdateUserRequest;
import io.github.ysbunny.community.user.dto.response.*;
import io.github.ysbunny.community.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public CreateUserResponse createUser(@Valid @ModelAttribute CreateUserRequest request) {
        User saved = userService.createUser(request);
        return new CreateUserResponse(saved.getId());
    }

    @GetMapping("/{userId}")
    public UserInformationResponse getUser(Authentication authentication, @PathVariable Long userId) {
        String email = authentication.getName();

        return userService.getUser(email, userId);
    }

    @PatchMapping("/{userId}")
    public UpdateUserResponse updateUser(
            Authentication authentication,
            @PathVariable Long userId,
            @Valid @ModelAttribute UpdateUserRequest request
    ) {
        String email = authentication.getName();

        User updated = userService.updateUser(email, userId, request);

        return new UpdateUserResponse(updated.getNickname(), updated.getProfileImage());
    }

    @DeleteMapping("/{userId}")
    public DeleteUserResponse deleteUser(
            Authentication authentication,
            @PathVariable Long userId
    ) {
        String email = authentication.getName();

        userService.deleteUser(email, userId);

        return new DeleteUserResponse("withdraw_success");
    }
}
