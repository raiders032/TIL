#### query method

* Entity Class의 멤버 변수 이름을 기준으로 한다.

```java
@Entity
public class Menu{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="restaurant_id")
    private Restaurant restaurant;

    private String name;

    private int price;
}
```



```java
#정상
Menu findByRestaurantIdAndId(Long restaurantId, Long menuId);
#비정상
Menu findByRestaurantIdAndMenuId(Long restaurantId, Long menuId);
```

