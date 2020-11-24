```

```

```
public Page<BookmarkResponseDto> findDtosByUserId(Long userId, String filter, Pageable pageable) {
    if(filter.equals("like"))
        return bookmarkRepository.findDtosByUserIdOrderByLike(userId, pageable);
    return bookmarkRepository.findDtosByUserIdOrderById(userId, pageable);
}
```

```

```

```

```