# 1 Floyd Warshall Algorithm

- 플로이드-워셜 알고리즘은 가중 그래프에서 모든 노드 쌍 사이의 최단 경로를 계산하는 데 사용됩니다. 
- 이는 방향 그래프와 무방향 그래프 모두에 적용됩니다. 

<br>

**알고리즘의 주요 특징**

- 모든 노드 쌍 사이의 최단 경로를 계산합니다.
- 그래프를 표현하기 위해 인접 행렬 방식을 사용합니다.
- 다이나믹 프로그래밍 기법에 속합니다.

<br>

# 2 점화식

![image-20220623135454497](./images/1.png)

- 플로이드-워셜 알고리즘의 핵심은 모든 노드 쌍에 대해, 가능한 모든 중간 노드를 거쳐 가며 최단 경로를 업데이트하는 것입니다. 
- 이 과정에서 사용되는 점화식은 위와과 같습니다
* a에서 b로 가는 최단 거리보다 a에서 k를 거쳐 b로 가는 거리가 더 짧은지 검사합니다.

<br>

# 3 동작방식

1. 먼저 2차원 테이블 `D`를 초기화합니다.
	1. `D[a][b] = a에서 b까지의 거리` 
	2. a에서 b로 가는 경로가 없는 경우 INF 값으로 초기화합니다.
2. 인접 정점 간의 최소 거리로 테이블 갱신

<br>

## 3.1 예제 코드

* https://www.acmicpc.net/problem/11404
* `V` : 정점의 개수
* `E` : 간선의 개수
* `distance` : 정점 간의 최소 거리를 나타내는 2차원 배열

```python
import sys

input = sys.stdin.readline

V = int(input())
E = int(input())

# 정점 간의 최소 거리는 나타내는 2차원 배열 초기화
distance = [[sys.maxsize] * (V + 1) for _ in range(V + 1)]
for i in range(V + 1):
    distance[i][i] = 0

# 인접한 정점의 최소 거리로 2차원 배열 갱신
for _ in range(E):
    vertex1, vertex2, weight = map(int, input().split())
    distance[vertex1][vertex2] = min(distance[vertex1][vertex2], weight)

# i: 거쳐 가는 정점
for i in range(1, V + 1):
    # j: 출발 정점
    for j in range(1, V + 1):
        # k: 도착 정점
        for k in range(1, V + 1):
            # j에서 k를 가는 비용 보다 j 에서 i를 거쳐 k로 가는 비용이 더 적다면 갱신
            if distance[j][i] + distance[i][k] < distance[j][k]:
                distance[j][k] = distance[j][i] + distance[i][k]
```

<br>

# 4 시간복잡도

* 알고리즘의 시간 복잡도는 O(N^3)입니다.
* 노드의 개수가 적은 경우에 적용할 수 있으며 노드와 간선의 개수가 모두 많으면 다익스트라 알고리즘을 고려해볼 수 있습니다.
	* [Dijkstra-Algorithm.md](../Dijkstra-Algorithm/Dijkstra-Algorithm.md) 참고

<br>


참고 자료

* https://www.youtube.com/watch?v=acqm9mM1P6o&list=PLRx0vPvlEmdAghTr5mXQxGpHjWqSz0dgC&index=7