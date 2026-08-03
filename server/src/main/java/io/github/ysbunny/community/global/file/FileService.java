package io.github.ysbunny.community.global.file;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {
    // 업로드할 파일의 위치를 절대경로로 설정
    private final Path uploadDirectory = Paths.get("uploads").toAbsolutePath().normalize();

    public FileService() {
        // 파일을 저장할 폴더 생성
        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    public String saveImage(MultipartFile file, String directoryName) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();

        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            // 파일의 확장자 추출
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // 저장할 파일명을 랜덤으로
            String savedFileName = UUID.randomUUID().toString() + extension;

            // 게시글 이미지, 프로필 이미지 등을 저장할 하위 폴더 경로
            Path directoryPath = uploadDirectory.resolve(directoryName);

            // 저장할 파일 전체 경로
            Path targetPath = directoryPath.resolve(savedFileName);

            try {
                // 하위 폴더가 없으면 상위 폴더와 함께 생성
                // 이미 폴더가 존재하는 경우에는 오류 없이 넘어감
                Files.createDirectories(directoryPath);

                // 파일 실제로 저장
                file.transferTo(targetPath);

                // 저장된 파일명 반환
                return savedFileName;
            } catch (IOException e) {
                throw new IllegalStateException("파일 저장 실패", e);
            }
        } else {
            return "";
        }
    }
}
