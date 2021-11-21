# 1 this

* `this`라는 키워드는 인스턴스 메서드 또는 생성자 내에서 사용되며 현재 객체에 대한 참조입니다.
* `this`를 사용하면 현재 객체의 멤버(필드, 메소드)를 참조할 수 있다.
* 주로 필드나 생성자를 참조할 때 사용한다.



## 1.1 필드 참조

* 필드 참조가 필요한 이유는 필드가 메서드 또는 생성자 매개 변수에 의해 가려지기 떄문이다.

```java
public class Point {
    private int x = 0;
    private int y = 0;
        
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
```

![image-20211116132011625](/Users/YT/Library/Application Support/typora-user-images/image-20211116132011625.png)

```java
public class ThisTest {

    class Point {
        private int x = 0;
        private int y = 0;

        public Point(int x, int y) {
            x = x;
            y = y;
        }
    }

    class PointThis {
        private int x = 0;
        private int y = 0;

        public PointThis(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    @Test
    void testPoint(){
        Point point = new Point(10, 10);
        assertThat(point.x).isEqualTo(0);
        assertThat(point.y).isEqualTo(0);
    }

    @Test
    void testPointThis(){
        PointThis point = new PointThis(10, 10);
        assertThat(point.x).isEqualTo(10);
        assertThat(point.y).isEqualTo(10);
    }
}
```



```
Classfile /Users/YT/Desktop/project/study/java/javatest/src/Point.class
  Last modified 2021. 11. 17.; size 280 bytes
  SHA-256 checksum 93833dfa6557b9e010815f6eac44bbe8d327e57e02811fc6aef59bf3db2d2b39
  Compiled from "Point.java"
public class Point
  minor version: 0
  major version: 60
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #8                          // Point
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 2, methods: 1, attributes: 1
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Fieldref           #8.#9          // Point.x:I
   #8 = Class              #10            // Point
   #9 = NameAndType        #11:#12        // x:I
  #10 = Utf8               Point
  #11 = Utf8               x
  #12 = Utf8               I
  #13 = Fieldref           #8.#14         // Point.y:I
  #14 = NameAndType        #15:#12        // y:I
  #15 = Utf8               y
  #16 = Utf8               (II)V
  #17 = Utf8               Code
  #18 = Utf8               LineNumberTable
  #19 = Utf8               SourceFile
  #20 = Utf8               Point.java
{
  public Point(int, int);
    descriptor: (II)V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=3, args_size=3
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: iconst_0
         6: putfield      #7                  // Field x:I
         9: aload_0
        10: iconst_0
        11: putfield      #13                 // Field y:I
        14: aload_0
        15: iload_1
        16: putfield      #7                  // Field x:I
        19: aload_0
        20: iload_2
        21: putfield      #13                 // Field y:I
        24: return
      LineNumberTable:
        line 5: 0
        line 2: 4
        line 3: 9
        line 6: 14
        line 7: 19
        line 8: 24
}
```

```
Classfile /Users/YT/Desktop/project/study/java/javatest/src/Point.class
  Last modified 2021. 11. 17.; size 274 bytes
  SHA-256 checksum e2c118b0d73505207870afbed4afedf6212a6572fd50228f7ca2d2ac6d1b0029
  Compiled from "Point.java"
public class Point
  minor version: 0
  major version: 60
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #8                          // Point
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 2, methods: 1, attributes: 1
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Fieldref           #8.#9          // Point.x:I
   #8 = Class              #10            // Point
   #9 = NameAndType        #11:#12        // x:I
  #10 = Utf8               Point
  #11 = Utf8               x
  #12 = Utf8               I
  #13 = Fieldref           #8.#14         // Point.y:I
  #14 = NameAndType        #15:#12        // y:I
  #15 = Utf8               y
  #16 = Utf8               (II)V
  #17 = Utf8               Code
  #18 = Utf8               LineNumberTable
  #19 = Utf8               SourceFile
  #20 = Utf8               Point.java
{
  public Point(int, int);
    descriptor: (II)V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=3, args_size=3
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: iconst_0
         6: putfield      #7                  // Field x:I
         9: aload_0
        10: iconst_0
        11: putfield      #13                 // Field y:I
        14: iload_1
        15: istore_1
        16: iload_2
        17: istore_2
        18: return
      LineNumberTable:
        line 5: 0
        line 2: 4
        line 3: 9
        line 6: 14
        line 7: 16
        line 8: 18
}
SourceFile: "Point.java"

```



## 1.2 생성자 호출

* 생상자 안에서 this 키워드로 같은 클래스의 다른 생성자를 호출할 수 있다.

```java
public class Rectangle {
    private int x, y;
    private int width, height;
        
    public Rectangle() {
        this(0, 0, 1, 1);
    }

    public Rectangle(int width, int height) {
        this(0, 0, width, height);
    }

    public Rectangle(int x, int y, int width, int height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    ...
}
```



참고

* https://docs.oracle.com/javase/tutorial/java/javaOO/thiskey.html