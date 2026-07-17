package io.github.ysbunny.community.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 리소스 설정 메서드
    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {
        // 실제 업로드 폴더 경로
        Path uploadDirectory = Paths.get("uploads").toAbsolutePath().normalize();

        // 파일 시스템 경로를 URI 문자열로 변환
        String uploadLocation = uploadDirectory.toUri().toString();

        // URL 패턴 등록하고 실제 폴더 연결
        registry.addResourceHandler("/uploads/**").addResourceLocations(uploadLocation);
    }
}
