

# 프로그래머스

- 재귀를 사용할 경우 런타임 오류가 뜨면 재귀 제한 설정을 해보자.



# 기본

## 빠른 입출력

```python
import sys
input = sys.stdin.readline
```


## 보드 입력

**input**
```
4 6
101111
101010
101011
111011
```

```python
import sys  
  
readln = sys.stdin.readline  
(n, m) = map(int, readln().split())  
board = [list(map(int, readln().rstrip())) for _ in range(n)]  
```

<br>

## 재귀 제한 설정

```python
import sys
sys.setrecursionlimit(10 ** 6)
```



## 소수점 자리수 출력

```python
# 변수 number 소수점 둘째자리까지 출력
print(f'number: {number:.2f}')
```



## 최대 최소

```python
max_num = sys.maxsize
min_num = -sys.maxsize
```



## 중첩 함수

```python
# 내부 함수에서 외부 함수의 변수 이용하기
def solution(numbers, target):
    def solve(level, total):
        nonlocal answer
        if level == len(numbers):
            if total == target:
                answer += 1
            return
        solve(level + 1, total + numbers[level])
        solve(level + 1, total - numbers[level])
    
    answer = 0
    solve(0, 0)
    return answer
```



## 시간 변환

**초 단위 변환**

```python
def hhmmss_to_seconds(hhmmss):
    hour, minute, second = hhmmss.split(':')
    return int(hour) * 3600 + int(minute) * 60 + int(second)


def seconds_to_hhmmss(seconds):
    result = ''
    result += str(seconds // 3600).zfill(2) + ':'
    seconds %= 3600
    result += str(seconds // 60).zfill(2) + ':'
    seconds %= 60
    result += str(seconds).zfill(2)
    return result
```





# 자료형

## int

## bool

## float

## set

**선언**

```python
a = set()
a = {}
```

**원소 추가**

```python
a.add('A')
```





## dict

**선언**

```python
a = dict()
a = {}
a = {'key1' : 'value1', 'key2' : 'value2'}
a['key3'] = 'value3'
```

**원소 삭제**

```python
del a['key3']
```

**순회**

```python
for key, value in a.item():
	print(key, value)
```

**defaultdict 선언 및 정렬하기**

```python
import collections

# 단어의 개수세기 
word_count = collections.defaultdict(int)

# 개수 증가시키기
word_count["cat"] += 1

# 값을 기준으로 오름차순 정렬
sorted(word_count.items(), key=lambda w:w[1])
```



## str

```python
'a'.isalpha() # True
'A'.lower() # 'a'
```

**문자열 찾기**

```python
'Python'.find('thon') # 2
'Python'.find('Python') # 0
'Python'.find('Java') # -1
```



## tuple



## list

**리스트 뒤집기**

```python
a = ['h', 'e', 'l', 'l', 'o']
a = a[::-1]	# ['o', 'l', 'l', 'e', 'h']
```

```python
a = ['h', 'e', 'l', 'l', 'o']
a.reverse() # ['o', 'l', 'l', 'e', 'h']
```





# 자료구조

## 배열

```python
# list 뒤집기
reversed_list = list[::-1]
```



## 집합

```python
plugs = set()
# 원소 1 제거 존재하지 않으면 KeyError 발생
plugs.remove(1)

# 원소 1이 존재하면 제거
plugs.discard(1)

# 원소 2 추가
plugs.add(2)

# 임의 원소 제거 및 반환 set에 원소가 없으면 KeyError 발생
plugs.pop()

# 합집합
set3 = set1.union(set2)

# 교집합
set3 = set1.intersection(set2)

# 차집합
set3 = set1.difference(set2)
```



## 스택

```python
# stack 선언
stack = []

# stack push
stack.append(0)

# stack pop
stack.pop()

# stack Top
stack[-1]
```



## 큐

```python
from collections import deque
que = deque()
que.popleft()
que.append(next_vertex)
```



## 최소 힙

```python
import heapq

# list x heap으로 변환
heapq.heapify(x)

min_heap = []
heapq.heappush(min_heap, item)
heapq.heappop(min_heap)
```



## Counter

```python
from collections import Counter

heights = Counter(map(int, input().split()))

# key중 가장 큰 key
max_height = max(heights)

# 원소 조회
for key, value in heights.items():
	print(key, value)

# 정렬하기
books = Counter([input().rstrip() for _ in range(N)])
books = sorted(books.items(), key=lambda x: (-x[1], x[0]))
```



# 알고리즘



## 정렬

```python
array = list() 
array.sort()
```

```python
numbers = [5, 4, 3, 2, 1]
print(sorted(numbers)) // [1, 2, 3, 4, 5]
```

**문자열 정렬**

```python
a = "cat"
print(sorted(a))
```



## 2차원 배열 4방향

```python
dx = [1, 0, -1, 0]
dy = [0, -1, 0, 1]

for i in range(4):
  nx = x + dx[i]
  ny = y + dy[i]
  if nx < 0 or nx >= N or ny < 0 or ny >= N:
    continue
```



## 큐 최소 거리 구하기

```python
from collections import deque

dx = [-1, 0, 1, 0]
dy = [0, 1, 0, -1]

def bfs(start_x, start_y):
    visited = [[0] * length for _ in range(length)]
    queue = deque([(start_x, start_y)])
    visited[start_x][start_y] = 1
    while queue:
        x, y = queue.popleft()

        if x == end_x and y == end_y:
            return visited[x][y] - 1

        for dir in range(4):
            nx = x + dx[dir]
            ny = y + dy[dir]
            if nx < 0 or nx >= length or ny < 0 or ny >= length:
                continue

            if visited[nx][ny]:
                continue

            visited[nx][ny] = visited[x][y] + 1
            queue.append((nx, ny))
```



## 자리수 구하기

```python
import math

def digit_length(n):
    return int(math.log10(n)) + 1 if n else 0
```

```python
def digit_length(n):
    ans = 0

    while n:
        n //= 10
        ans += 1

    return ans
```



## 아이템 개수 계산하기

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



## 순열

```python
import itertools

arr = ['A', 'B', 'C']
nPr = itertools.permutations(arr, 2)
print(list(nPr))
# 결과 : [('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]
```



## 조합

```python
import itertools

arr = ['A', 'B', 'C']
nCr = itertools.combinations(arr, 2)
print(list(nCr))
# 결과 : [('A', 'B'), ('A', 'C'), ('B', 'C')]
```



## 다익스트라

```python

import heapq
import sys


def dijkstra(start):
    distances = [INF] * V
    distances[start] = 0
    min_heap = []
    heapq.heappush(min_heap, (0, start))

    while min_heap:
        distance, here = heapq.heappop(min_heap)

        if distances[here] < distance:
            continue

        for there, d in graph[here]:
            next_distance = distance + d
            if next_distance < distances[there]:
                distances[there] = next_distance
                heapq.heappush(min_heap, (next_distance, there))

    return distances


INF = sys.maxsize
V, E = map(int, input().split())
graph = [[] for _ in range(V)]
for _ in range(E):
    u, v, w = map(int, input().split()) # 정점 u에서 정점 v를 잇는 간선 가중치 w
    graph[u].append((v, w))
```



## n 진수 변환

```python

def trans_to(number, n):
  number_to_hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  if number == 0:
    return '0'
  result = ''
  while number:
    result += number_to_hex[number % n]
    number = number // n
    return result[::-1]

  def solution(n, t, m, p):
    answer = ''
    number = 0
    while len(answer) <= m * t:
      answer += trans_to(number, n)
      number += 1
      print(answer)
      return answer[p - 1::m][:t]

```





# [Built-in Functions](https://docs.python.org/3.9/library/functions.html)



## zip

- tuple 반환

```python
arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

for col in zip(*arr):
    print(col)
```

```bash
(1, 4, 7)
(2, 5, 8)
(3, 6, 9)
```



## chr





## print

**구분자**

```python
print('A1', 'B1') #A1 B1
print('A1', 'B1', sep=',') #A1,B1
```



**줄바꿈 변경**

```python
print('a')
print('b')
```

```
a
b
```

```python
print('a', end=' ')
print('b')
```

```
a b
```



**포맷팅**

* python 3.6이상만 지원

```python
idx = 1
fruit = 'apple'
print(f'{idx + 1}: {fruit}')
```

```
2: apple
```



**중괄호 출력**

- 중괄호를 출력하려면 `{{` 또는  `}}` 중괄호를 두번 연속 사용한다.

```python
idx = 1
fruit = 'apple'
print(f'{idx + 1}: {{{fruit}}}')
```

`````
2: {apple}
`````



## join

```python
a = ['A', 'B']
print(''.join(a))
```

```
AB
```



```python
a = [1, 2]
print('-'.join(map(str, a)))
```

```
1-2
```



## divmod

* 몫과 나머지 동시에 구하기

```python
divmod(5, 3) #(1, 2)
```



* https://docs.python.org/3.9/library/index.html



## round

- round()는 사사오입 원칙을 따른다. 
- 반올림할 자리의 수가 5이면 반올림 할 때 앞자리의 숫자가 짝수면 내림하고 홀수면 올림 한다.

``````python
round(4.5)  #결과는 4
round(3.5)  #결과는 4
``````



# library

## re

- [레퍼런스](https://docs.python.org/3/library/re.html)

```python
prog = re.compile(pattern)
result = prog.match(string)

# is equivalent to
result = re.match(pattern, string)
```



**re.sub(pattern, repl, string, count=0, flags=0)**

```python
>>> re.sub(r'def\s+([a-zA-Z_][a-zA-Z_0-9]*)\s*\(\s*\):',
...        r'static PyObject*\npy_\1(void)\n{',
...        'def myfunc():')
'static PyObject*\npy_myfunc(void)\n{'
```



**re.split(pattern, string, maxsplit=0, flags=0)**

```python
>>> re.split(r'\W+', 'Words, words, words.')
['Words', 'words', 'words', '']
>>> re.split(r'(\W+)', 'Words, words, words.')
['Words', ', ', 'words', ', ', 'words', '.', '']
>>> re.split(r'\W+', 'Words, words, words.', 1)
['Words', 'words, words.']
>>> re.split('[a-f]+', '0a3B9', flags=re.IGNORECASE)
['0', '3', '9']
```



## math

**올림**

```python-repl
math.ceil(-3.14)    # -3
math.ceil(3.14) 		# 4
```



**내림**

```python-repl
math.floor(3.14)    # 3
math.floor(-3.14)   # -4
```



**팩토리얼**

`````python
math.factorial(10)
`````
