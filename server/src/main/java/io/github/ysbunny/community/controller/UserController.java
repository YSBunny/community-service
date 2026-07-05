package io.github.ysbunny.community.controller;

import io.github.ysbunny.community.dto.user.*;
import io.github.ysbunny.community.entity.User;
import io.github.ysbunny.community.service.UserService;
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
