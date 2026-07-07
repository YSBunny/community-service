package io.github.ysbunny.community.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class TokenProvider {

    private final SecretKey secretKey;

    public TokenProvider(@Value("${jwt.secret}") String secret) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            // 토큰 검증
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // JWT 문자열을 검증한 뒤, JWT 안에 들어 있는 사용자 정보(payload)를 Claims 객체로 꺼냄
    private Claims parseClaims(String token) {
        return Jwts.parser()    // JWT를 해석할 parser를 만들기 시작
                .verifyWith(secretKey)  // 서명을 검증할 때 사용할 비밀키 지정
                .build()    // 실제 parser 객체 완성
                .parseSignedClaims(token)   // 서명을 검증한 뒤, payload 부분을 Claims로 읽음
                .getPayload();  // payload 부분만 꺼냄
    }

    // Authentication 객체 반환 구현 필요
    public Authentication getAuthentication(String token) {
        return null;
    }
}
