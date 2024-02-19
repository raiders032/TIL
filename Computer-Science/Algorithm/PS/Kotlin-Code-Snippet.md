# 문법

## for

**기본 문법**

```kotlin
for (i in array.indices) {  
    println(array[i])  
}
```

<br>

**인덱스와 밸류를 같이 얻기**

```kotlin
for ((index, value) in array.withIndex()) {  
    println("the element at $index is $value")  
}
```

<br>

**range expression 사용**

```kotlin
for (i in 1..3) {
    println(i)
}

for (i in 6 downTo 0 step 2) {
    println(i)
}
```

<br>

## when

```kotlin
when (i) {  
  0 -> dfs(level + 1, result + numbers[level + 1])  
  1 -> dfs(level + 1, result - numbers[level + 1])  
  2 -> dfs(level + 1, result * numbers[level + 1])  
  3 -> dfs(level + 1, result / numbers[level + 1])  
}
```


```kotlin
when {  
  root1 < root2 -> disjointSet[root2] = root1  
  root1 > root2 -> disjointSet[root1] = root2  
  else -> {  
    disjointSet[root1] = -1  
    disjointSet[root2] = -1  
  }  
}
```


## Data Class

data class Point(val x: Int, val y: Int, val distance: Int)

# 자료구조

## 배열

```kotlin
val selfNumbers = Array<Boolean>(10001) { true }

val board = ArrayList<ArrayList<Int>>(n)

val dp = Array(n) { IntArray(n) { -1 } }

val graph = Array(n) { mutableListOf<Int>() }
```


## Duque

```kotlin
val deque = ArrayDeque<String>()  
val deque = ArrayDeque<Pair<Int, Int>>().apply { add(1 to 0) }
```


## Queue

```kotlin
val queue = ArrayDeque<Pair<Int, Int>>().apply { add(1 to 0) }  
​  
queue.add(root)  
queue.remove()  
queue.element()
```


## PriorityQueue

```kotlin
val left = PriorityQueue<Int>(reverseOrder())  
val right = PriorityQueue<Int>()  
​  
val priorityQueue = PriorityQueue<Triple<Int, Int, Int>>(compareBy { -it.third })
```


# 알고리즘

## 각 자리수 더하기

```kotlin
val sum = number.toString()  
.map { Character.getNumericValue(it) }  
.sum()
```


## 문자열의 각 캐릭터 수 구하기

```kotlin
val word = "apple"  
val map = mutableMapOf<Char, Int>()  

for (char in word) {  
  map.putIfAbsent(char, 0)  
  map[char] = map[char]!! + 1  
}  

println(map)

{a=1, p=2, l=1, e=1}
```


## 문자열