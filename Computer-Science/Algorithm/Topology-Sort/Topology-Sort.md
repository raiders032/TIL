# 1 Topology Sort

* 순서가 정해진 작업을 차례로 수행해야 할 때 그 순서를 결정해주기 위해 사용되는 알고리즘
* 위상 정렬은 DAG에만 적용이 가능하다
	* DAG: 사이클이 없는 방향 그래프

<br>

# 2 구현방식

* 위상정렬은 스택과 큐를 이용하며 주로 큐를 이용해 구현한다

<br>

## 2.1 큐 구현방식

1. 각 노드의 진입차수 정보를 가진 배열 inDegree를 초기화한다.
2. 진입차수가 0인 정점을 큐에 삽입한다.
3. 큐에서 원소 하나를 꺼내 연결된 모든 간선을 제거한다.
	1. 꺼낸 노드와 연결된 노드의 진입차수를 1 감소시킨다
4. 진입차수가 0인 된 정점을 큐에 삽입한다
5. 큐가 빌 때까지 3-4번 작업을 총 노드의 수만큼 반복한다

모든 원소를 방문하기 전 큐가 비게된다면 사이클이 존재하는 것
모든 원소를 방문한다면 큐에서 꺼낸 순서가 위상 정렬의 결과

<br>

## 2.2 예제 코드

* https://www.acmicpc.net/problem/2252
* `N, M` : 노드의 개수, 간선의 개수
	* 노드는 1번부터 N번 까지 존재
* `graph`: 노드의 선후 관계를 나타내는 그래프
	* V1 -> V2: V1 이후에 V2
* `inDegree`: 각 노드의 진입차수를 나타내는 배열
* `queue`: 큐를 이용한 Topology Sort
* `result`: 위상 정렬된 결과

```python
import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
graph = [list() for _ in range(N + 1)]
inDegree = [0] * (N + 1)
queue = deque()
result = []

# 진입 차수를 초기화하는 과정
for _ in range(M):
    v1, v2 = map(int, input().split())
    graph[v1].append(v2)
    inDegree[v2] += 1

# 진입 차수가 0인 정점을 우선 순위 큐에 넣는다
for i in range(1, N + 1):
    if inDegree[i] == 0:
        queue.append(i)

# 총 정점의 개수만큼 반복한다.
for _ in range(N):
  	# 반복문 도중 큐가 비었다면 사이클이 발생했다는 것
    if not queue:
        print('사이클 발생')
        break
		
    # 큐에서 꺼내진 정점의 순서가 위상 정렬된 순서다
    vertex = queue.popleft()
    result.append(vertex)

    # 현재 정점가 연결된 모든 정점의 진입차수를 1 감소시킨다.
    for next_vertex in graph[vertex]:
        inDegree[next_vertex] -= 1
        # 연결된 정점의 집인 차수가 0이 되면 우선 순위 큐에 넣어준다
        if inDegree[next_vertex] == 0:
            queue.append(next_vertex)

print(*result)
```

<br>

# 3 관련 문제

* https://www.acmicpc.net/problem/2252
* https://www.acmicpc.net/problem/14567



관련 자료

* https://www.youtube.com/watch?v=qzfeVeajuyc