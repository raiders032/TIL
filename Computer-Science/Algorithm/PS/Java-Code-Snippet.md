# Skills

## 테스트 케이스

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int tc = Integer.parseInt(br.readLine());

while (tc-- > 0) {
	
}
```



# 입출력

## BufferedReader

* Enter만 경계로 인식하고 타입은 String으로 고정

```java
BufferedReader bf = new BufferedReader(new InputStreamReader(System.in));

//String
String s = bf.readLine(); 
int i = Integer.parseInt(bf.readLine()); //Int

StringTokenizer st = new StringTokenizer(s); //StringTokenizer인자값에 입력 문자열 넣음
int a = Integer.parseInt(st.nextToken()); //첫번째 호출
int b = Integer.parseInt(st.nextToken()); //두번째 호출

String array[] = s.split(" "); //공백마다 데이터 끊어서 배열에 넣음
```



**Scanner**

```java
import java.util.Scanner;
 
Scanner scan = new Scanner(System.in);

String name = scan.next();
String city = scan.next();
int age = scan.nextInt();
double weight = scan.nextDouble();
boolean single = scan.nextBoolean();
```



## 소수점 출력

```java
// 소수점 2번째 까지 출력
System.out.printf("%.2f", stack.pop());
```



# 문자열



## StringTokenizer

```java
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



## String에서 char 배열로 변환

```java
String str = "abc";
Char[] chars = str.toCharArray();
```





# 자료구조

## 배열



### 배열 값 채우기

```java
import java.util.Arrays;

//new 연산자로 배열을 처음 생성할 경우 배열은 자동적으로 기본값으로 초기화됨
int[] array = new int[100];
Arrays.fill(array, 10000);
```

```java
int[] array = {83, 90, 87};
```

```java
String[] names = null;
names = new String[] {"1", "2", "3"};
```



### 배열 정렬하기

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

```java
String[] phone_book;
int length = phone_book.length;
```



### 배열을 스트림으로

- `Arrays.stream()`

```java
String[] stringArray = {"홍길동", "신용권", "김미나"};
Stream<String> stringStream = Arrays.stream(stringArray);
stringStream.forEach(a -> System.out.print(a + ","));
System.out.println();

int[] intArray = {1, 2, 3, 4, 5};
IntStream intStream = Arrays.stream(intArray);
intStream.forEach(a -> System.out.print(a + ","));
```



## 스택

```java
   Stack<Integer> stack = new Stack<>();
   stack.push(i);
   stack.peek()
   Integer index = stack.pop();
```



## 맵

### 맵 key값 카운트 하기

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> participants = new HashMap<>();

for (String name : participant) {
  participants.put(name, participants.getOrDefault(name, 0) + 1);
}
```

### 맵 모든 원소 조회

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> map = new HashMap<>();

for (String key : map.keySet()) {
  Integer value = map.get(key);
}
```





# Collection Framwork

## Set

### HashSet

- TreeSet, LinkedHashSet과 비교하면 가장 성능이 좋다
- 대신 원소의 순서를 보장하지 않는다.



### TreeSet

- 원소의 값을 기준으로 원소가 순서를 가진다.
- TreeSet의 원소는 정렬을 위해 java.lang.Comparable을 구현해야 한다.

```java
int n = Integer.parseInt(br.readLine());
TreeSet<String> treeSet = new TreeSet<>();

treeSet.add("노영삼");
treeSet.remove("노영사");

//오름차순 조회
Iterator<String> iterator = workers.iterator();
while (iterator.hasNext()) {
  System.out.println(iterator.next());
}

// 내림차순 조회
Iterator<String> iterator = treeSet.descendingIterator();
while (iterator.hasNext()) {
  System.out.println(iterator.next());
}
```



### LinkedHashSet

- 원소의 삽입 순서를 유지



## List



## Queue

| Type of Operation         | Throws exception | Returns special value |
| ------------------------- | ---------------- | --------------------- |
| 원소 삽입                 | `add(e)`         | `offer(e)`            |
| 헤드 원소를 삭제하고 반환 | `remove()`       | `poll()`              |
| 헤드 원소를 반환          | `element()`      | `peek()`              |



### LinkedList

```java
import java.util.LinkedList; 
import java.util.Queue; 

Queue<Integer> queue = new LinkedList<>();
queue.add(1); 
queue.peek();
queue.poll();
queue.isEmpty();
```



### PriorityQueue

- PriorityQueue의 원소들은 자연스러운 순서를 가지고 있다.
- 자연스러운 순서란 원소가 구현한 Comparable에 명시된 원소의 순서이다.
- 원소가 Comparable를 구현하지 않았거나 자연스러운 순서를 대신한 임의의 순서를 사용하고 싶은 경우 PriorityQueue 생성 시 Comparator를 제공한다.

```java
PriorityQueue<Integer> classroom = new PriorityQueue<>();

// Inserts the specified element into this priority queue.
classroom.add(classes[0][1]);

// 큐의 헤드 조회 원소를 삭제하지 않는다. 큐가 비었을 경우 null 반환
classroom.peek();

// 큐의 헤드 조회 및 원소 삭제, 큐가 비었을 경우 null 반환
classroom.poll();
```



## Deque

* 백준 2346번 문제서 구현체로 LinkedList 쓰면 메모리 초과 ArrayDeque 쓰면 통과

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





## Map



## SortedSet



## SortedMap



# 알고리즘
