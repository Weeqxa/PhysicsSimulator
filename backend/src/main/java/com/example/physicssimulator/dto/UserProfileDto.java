package com.example.physicssimulator.dto;

public class UserProfileDto {

    public String username;
    public String name;
    public String email;
    public String bio;
    public String avatarUrl;

    public UserProfileDto(String username, String name, String email, String bio, String avatarUrl) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }
}