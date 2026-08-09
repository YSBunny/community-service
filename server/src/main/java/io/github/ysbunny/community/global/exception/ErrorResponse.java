package io.github.ysbunny.community.global.exception;

public record ErrorResponse(
        String code,
        String message
) {
}