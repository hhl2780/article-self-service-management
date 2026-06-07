package com.example.aiweb.service;

import com.example.aiweb.common.BusinessException;
import com.example.aiweb.dto.ArticleCreateRequest;
import com.example.aiweb.dto.ArticleResponse;
import com.example.aiweb.dto.ArticleUpdateRequest;
import com.example.aiweb.entity.Article;
import com.example.aiweb.entity.User;
import com.example.aiweb.repository.ArticleRepository;
import com.example.aiweb.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public ArticleService(ArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<ArticleResponse> list(int page, int size, String keyword) {
        int pageIndex = Math.max(page - 1, 0);
        int pageSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(pageIndex, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Article> result = StringUtils.hasText(keyword)
                ? articleRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword, pageable)
                : articleRepository.findAll(pageable);
        return result.map(ArticleResponse::from);
    }

    @Transactional(readOnly = true)
    public ArticleResponse detail(Long id) {
        return ArticleResponse.from(findArticle(id));
    }

    @Transactional
    public ArticleResponse create(ArticleCreateRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(404, "用户不存在"));
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setAuthor(author);
        article.setStatus("PUBLISHED");
        return ArticleResponse.from(articleRepository.save(article));
    }

    @Transactional
    public ArticleResponse update(Long id, ArticleUpdateRequest request, String username) {
        Article article = findArticle(id);
        requireOwnerOrAdmin(article, username);
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        return ArticleResponse.from(articleRepository.save(article));
    }

    @Transactional
    public void delete(Long id, String username) {
        Article article = findArticle(id);
        requireOwnerOrAdmin(article, username);
        articleRepository.delete(article);
    }

    private Article findArticle(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(404, "文章不存在"));
    }

    private void requireOwnerOrAdmin(Article article, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(404, "用户不存在"));
        boolean isOwner = article.getAuthor().getId().equals(user.getId());
        boolean isAdmin = "ADMIN".equals(user.getRole());
        if (!isOwner && !isAdmin) {
            throw new BusinessException(403, "只能修改或删除自己的文章");
        }
    }
}
