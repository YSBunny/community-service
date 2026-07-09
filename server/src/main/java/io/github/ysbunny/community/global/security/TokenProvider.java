package io.github.ysbunny.community.global.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class TokenProvider {

    private static final String AUTHORITIES_KEY = "auth";

    private final SecretKey secretKey;
    private final long expiration;

    public TokenProvider(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expiration) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);   // JWT 서명에 필요한 키 바이트
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);  // 바이트 배열을 JWT 서명에 사용할 수 있는 SecretKey 객체로 바꿈
        this.expiration = expiration;   // 토큰 유효 기간
    }

    // JWT 발급
    public String createToken(Authentication authentication) {
        String authorities = authentication.getAuthorities()    // 권한 목록 꺼냄(ROLE_USER, ROLE_ADMIN)
                .stream()
                // GrantedAuthority는 Authentication에 부여된 권한, getAuthority()로 문자열 표현을 반환
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expiration);

        return Jwts.builder()   // JWT 만들기 시작
                .subject(authentication.getName())  // JWT payload의 sub 값 설정
                .claim(AUTHORITIES_KEY, authorities)    // JWT payload에 custom claim을 추가
                .issuedAt(now)  // 토큰 발급 시간
                .expiration(expirationDate) // 토큰 만료 시간
                .signWith(secretKey)    // JWT에 서명
                .compact(); // 설정한 내용을 최종 JWT 문자열로 압축해서 반환
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

    // Authentication 객체 반환
    public Authentication getAuthentication(String token) {
        // JWT payload의 Claims를 꺼냄
        Claims claims = parseClaims(token);

        // payload에서 auth 값을 꺼냄
        String authoritiesClaim = claims.get(AUTHORITIES_KEY, String.class);

        // auth 값을 SimpleGrantedAuthority로 변환
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(authoritiesClaim);

        return new UsernamePasswordAuthenticationToken(
                claims.getSubject(),    // Claims에서 subject를 꺼냄
                authority
        );
    }
}
