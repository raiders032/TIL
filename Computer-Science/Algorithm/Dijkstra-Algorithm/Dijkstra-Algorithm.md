# 1 Dijkstra's Algorithm

* 특정 노드에서 출발하여 다른 모든 노드로 가는 최단 경로를 계산한다
* 음의 간선이 없을 때 정상 작동한다
	* 음수 간선의 순환이 발생한 경우 해당 알고리즘으로 최단 경로를 구할 수 없다.
	* 이런 경우  [Bellman-Ford-Algorithm](../Bellman-Ford-Algorithm/Bellman-Ford-Algorithm.md)을 사용한다.
* 그리디 알고리즘으로 분류된다

<br>

# 2 동작과정

1. 출발 노드 설정
2. 최단 거리 테이블 초기화 
	* 출발 노드가 1인 경우 아래와 같이 테이블 초기화
	* ![[Pasted image 20231113150958.png]]
3. 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드를 선택
4. 해당 노드를 거쳐 다른 노드로 가는 비용을 계산하여 최단 거리 테이블을 갱신
5. 위 과정에서 3번과 4번을 반복

<br>

## 2.1 예제 코드

* https://www.acmicpc.net/problem/1753
* 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드를 선택하기 위해 우선순위 큐를 사용한 다익스트라 구현
* `V, E` : 정점의 개수, 간선의 개수
* `source_vertex`: 출발 정점
* `graph` : 그래프의 인접 리스트 표현
* `min_distance` : 출발 정점으로부터 다른 모든 정점까지의 최단 거리를 나타내는 배열

```python
import sys
import heapq
input = sys.stdin.readline

V, E = map(int, input().split())
source_vertex = int(input())
graph = [list() for _ in range(V + 1)]

for _ in range(E):
    vertex1, vertex2, weight = map(int, input().split())
    graph[vertex1].append((vertex2, weight))

# 최단 거리 배열 초기화
min_distance = [sys.maxsize] * (V + 1)

# 출발 정점의 최단 거리는 0으로 설정
min_distance[source_vertex] = 0

# 우선순위 큐에 (최단거리, 출발정점) 삽입
min_heap = [(0, source_vertex)]

while min_heap:
  	# 우선순위 큐에서 최단 거리가 가장 짧은 정점 선택
    distance, vertex = heapq.heappop(min_heap)
 		
    # 현재 정점을 이미 방문 했으면 무시하기
    if min_distance[vertex] < distance:
        continue
		
    # 현재 정점에서 방문할 수 있는 다른 정점까지의 최단 거리 갱신 
    for next_vertex, weight in graph[vertex]:
        if distance + weight < min_distance[next_vertex]:
            min_distance[next_vertex] = distance + weight
            heapq.heappush(min_heap, (min_distance[next_vertex], next_vertex))

for distance in min_distance[1:]:
    if distance == sys.maxsize:
        print("INF")
        continue
    print(distance)
```



# 3 시간 복잡도

**선형탐색 이용**

* 노드의 수(V)만큼 매번 최단 거리가 짧은 노드를 선형탐색(V)한다
* 따라서 전체 시간 복잡도는 O(V^2)이다



**최소 힙 사용**

* O(ElogV)
* 노드를 하나씩 꺼내 검사하는 반복문 V회 실행
* 꺼낸 노드와 연결된 다른 노드들을 확인하는 총횟수는 간선의 개수 만큼



# 4 문제

* https://www.acmicpc.net/problem/1504



참고 

* https://www.youtube.com/watch?v=acqm9mM1P6o&list=PLRx0vPvlEmdAghTr5mXQxGpHjWqSz0dgC&index=7