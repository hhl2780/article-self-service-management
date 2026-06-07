package com.example.aiweb.controller;

import com.example.aiweb.common.ApiResponse;
import com.example.aiweb.dto.ArticleCreateRequest;
import com.example.aiweb.dto.ArticleResponse;
import com.example.aiweb.dto.ArticleUpdateRequest;
import com.example.aiweb.service.ArticleService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/articles")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public ApiResponse<Page<ArticleResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.success(articleService.list(page, size, keyword));
    }

    @GetMapping("/{id}")
    public ApiResponse<ArticleResponse> detail(@PathVariable Long id) {
        return ApiResponse.success(articleService.detail(id));
    }

    @PostMapping
    public ApiResponse<ArticleResponse> create(@Valid @RequestBody ArticleCreateRequest request, Principal principal) {
        return ApiResponse.success(articleService.create(request, principal.getName()));
    }

    @PutMapping("/{id}")
    public ApiResponse<ArticleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ArticleUpdateRequest request,
            Principal principal) {
        return ApiResponse.success(articleService.update(id, request, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id, Principal principal) {
        articleService.delete(id, principal.getName());
        return ApiResponse.success(null);
    }
}
