# 빠른 입출력

**Java**

```java
// 빠른 입출력을 위한 BufferedReader 생성
BufferedReader bf = new BufferedReader(new InputStreamReader(System.in));

// 문자열 읽기
String s = bf.readLine(); //String

// 정수로 변환하기
int i = Integer.parseInt(bf.readLine());
```

**Python**

```python
import sys
readline = sys.stdin.readline
```

**kotlin**

```kotlin
// 빠른 입출력을 위한 BufferedReader 생성
val bufferedReader = System.`in`.bufferedReader()

// 문자열 읽기
val input = bufferedReader.readLine()
```

<br>

# 순회


**Java**

```java
int[] numbers = {1, 2, 3, 4, 5}; 

for (int number : numbers) { 
	System.out.println(number); 
}
```

<br>

**Kotlin**

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

for (number in numbers) {
    println(number)
}
```

<br>

**Python**

```python
numbers = [1, 2, 3, 4, 5]

for number in numbers:
    print(number)
```

<br>

# 문자열

## 문자열 쪼개기

**Java**

```java
// 문자열을 쪼개주는 StringTokenizer 생성
StringTokenizer st = new StringTokenizer("문자열", "구분자");

// 구분자 생략시 공백이 기본 구분자가 된다.
StringTokenizer st = new StringTokenizer("문자열"); 				

// 모든 token 접근 방식1
int countTokens = st.countTokens();
for (int i = 0; i < countTokens; i++) {
  String token = st.nextToken();
}

// 모든 token 접근 방식2
while (st.hasMoreTokens()){
  String token = st.nextToken();
}
```


## 문자열을 배열로 변환하기

**Java**

```java
String str = "abc";
Char[] chars = str.toCharArray();
```



# 배열

## 배열 값 초기화

**Java**

```java
import java.util.Arrays;

int[] array = new int[100];
Arrays.fill(array, 10000);
```

``` java
int[] array = {83, 90, 87};
```


## 배열 정렬하기

**java**

```java
import java.util.Arrays;

String[] phone_book;
Arrays.sort(phone_book);
```

```java
int[][] lectures = new int[n][2];
Arrays.sort(lectures, Comparator.comparingInt(l -> l[0]));
```

```java
Integer [] nums = new Integer[n];
Arrays.sort(nums);
Arrays.sort(nums, Collections.reverseOrder());
```

```java
List<Pair> pillars = new ArrayList<>();
Collections.sort(pillars);
Collections.sort(pillars, Collections.reverseOrder());
```



### 배열 길이 구하기

**Java**
```java
String[] phone_book;
int length = phone_book.length;
```



## 배열을 스트림으로

**Java**

```java
String[] stringArray = {"홍길동", "신용권", "김미나"};
Stream<String> stringStream = Arrays.stream(stringArray);
stringStream.forEach(a -> System.out.print(a + ","));
System.out.println();

int[] intArray = {1, 2, 3, 4, 5};
IntStream intStream = Arrays.stream(intArray);
intStream.forEach(a -> System.out.print(a + ","));
```

<br>

## 배열의 최대값 구하기

**Java**

```java
int[] numbers = {1, 2, 3, 4, 5};  
int maxNumber = Arrays.stream(numbers).max().getAsInt();
```

<br>

## `List<Integer>` to `int[]`

**java**

```java
List<Integer> numbers = new ArrayList<>();

int[] numbers2 = numbers
	.stream()
	.mapToInt(Integer::intValue)
	.toArray();
```

```java
int[] numbers2 = {1, 2, 3, 4, 5}; 

List<Integer> numbers = Arrays
	.stream(numbers2)
	.boxed()
	.collect(Collectors.toList());
```

<br>

# Set

**Java**

```java
// 내림 차순 정렬
TreeSet<Integer> maxTree = new TreeSet<>(Comparator.reverseOrder());

// 올림 차순 정렬
TreeSet<Integer> minTree = new TreeSet<>();
```

<br>

# Stack

**Java**

```java
import java.util.Stack;

Stack<Integer> stack = new Stack<>();
stack.push(i);
stack.peek()
Integer value = stack.pop();
```

<br>

# Queue

**Java**

```java
import java.util.LinkedList; 
import java.util.Queue; 

Queue<Integer> queue = new LinkedList<>();
queue.add(1); 
queue.peek();
queue.poll();
queue.isEmpty();
```

<br>

# Deque

**Java**

```java
Deque<String> deque = new ArrayDeque<>();

// 앞에 원소 삽입
deque.addFirst(i);

// 끝에 원소 삽입
deque.addLast(i);

// 앞 원소 조회 및 삭제
deque.pollFirst();

// 끝 원소 조회 및 삭제
deque.pollLast();

// 앞 원소 조회
deque.getFirst();

// 끝 원소 조회
deque.getLast();
```

<br>

# PriorityQueue

**Java**

```java
PriorityQueue<Integer> classroom = new PriorityQueue<>();

// Inserts the specified element into this priority queue.
classroom.add(classes[0][1]);

// 큐의 헤드 조회 원소를 삭제하지 않는다. 큐가 비었을 경우 null 반환
classroom.peek();

// 큐의 헤드 조회 및 원소 삭제, 큐가 비었을 경우 null 반환
classroom.poll();
```

- PriorityQueue의 원소들은 자연스러운 순서를 가지고 있다.
- 자연스러운 순서란 원소가 구현한 Comparable에 명시된 원소의 순서이다.
- 원소가 Comparable를 구현하지 않았거나 자연스러운 순서를 대신한 임의의 순서를 사용하고 싶은 경우 PriorityQueue 생성 시 Comparator를 제공한다.


# Map

## 원소의 등장 횟수 구하기

**Java**

```java
import java.util.HashMap;
import java.util.Map;

int[] array = {1, 3, 2, 5, 4, 5, 2, 3}; 
Map<Integer, Integer> countMap = new HashMap<>(); 

for (int num : array) { 
	countMap.put(num, countMap.getOrDefault(num, 0) + 1); 
}
```

<br>

**Python**

```python
from collections import defaultdict

count = defaultdict(int)
count['a'] += 1
count['b'] += 1
count['b'] += 1

print(count) # defaultdict(<class 'int'>, {'a': 1, 'b': 2})
```

```python
from collections import Counter

a = [1, 2, 3, 4, 5, 5, 5, 6, 6]
b = Counter(a)

print(b) # Counter({5: 3, 6: 2, 1: 1, 2: 1, 3: 1, 4: 1})
```
