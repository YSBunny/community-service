package io.github.ysbunny.community.auth.exception;

import lombok.Getter;

@Getter
public class LoginException extends RuntimeException {

    private final LoginErrorCode errorCode;

    public LoginException(LoginErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}