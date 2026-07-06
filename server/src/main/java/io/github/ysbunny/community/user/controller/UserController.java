package io.github.ysbunny.community.user.controller;

import io.github.ysbunny.community.auth.dto.response.LoginUserResponse;
import io.github.ysbunny.community.auth.dto.response.LogoutUserResponse;
import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.user.dto.request.CreateUserRequest;
import io.github.ysbunny.community.auth.dto.request.LoginUserRequest;
import io.github.ysbunny.community.auth.dto.request.LogoutUserRequest;
import io.github.ysbunny.community.user.dto.request.UpdateUserRequest;
import io.github.ysbunny.community.user.dto.response.*;
import io.github.ysbunny.community.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public CreateUserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        User saved = userService.createUser(request);
        return new CreateUserResponse(saved.getId());
    }

    @PostMapping("/login")
    public LoginUserResponse logIn(@Valid @RequestBody LoginUserRequest request) {
        return userService.login(request);
    }

    @GetMapping("/{userId}")
    public UserInformationResponse getUser(@PathVariable Long userId) {
        return userService.getUser(userId);
    }

    @PatchMapping("/{userId}")
    public UpdateUserResponse updateUser(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        String loginToken = authorizationHeader.replace("Bearer ", "");

        User updated = userService.updateUser(loginToken, userId, request);

        return new UpdateUserResponse(updated.getNickname(), updated.getProfileImage());
    }

    @PostMapping("/logout")
    public LogoutUserResponse logout(@Valid @RequestBody LogoutUserRequest request) {
        return userService.logout(request);
    }

    @DeleteMapping("/{userId}")
    public DeleteUserResponse deleteUser(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long userId
    ) {
        String loginToken = authorizationHeader.replace("Bearer ", "");

        userService.deleteUser(loginToken, userId);

        return new DeleteUserResponse("withdraw_success");
    }
}
