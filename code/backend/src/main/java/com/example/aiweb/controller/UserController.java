package com.example.aiweb.controller;

import com.example.aiweb.common.ApiResponse;
import com.example.aiweb.dto.UserResponse;
import com.example.aiweb.service.UserService;
import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> me(Principal principal) {
        return ApiResponse.success(UserResponse.from(userService.findByUsername(principal.getName())));
    }
}
