# 1 Bellman Ford Algorithm

- 특정 노드에서 출발하여 다른 모든 노드로 가는 최단 경로를 계산한다
- 주로 음수 간선이 포함된 최단 거리 문제를 해결할 때 사용된다.
- 음수 간선이 포함되면 Dijkstra's Algorithm으로 최단 경로를 구하지 못할 수 있다.
- Bellman Ford Algorithm은 Dijkstra's Algorithm의 최적의 해를 항상 포함한다.



# 2 동작과정

1. 출발 노드를 설정한다.
2. 최단 거리 테이블을 초기화한다.
3. 아래의 과정을 N - 1 번 반복한다
   1. 전체 간선 E개를 하나씩 확인한다.
   2. 각 간선을 거쳐 다른 노드로 가는 비용을 계산하여 최단 거리 테이블을 갱신한다.

- 만약 음수 간선 순환을 체크하고 싶다면 3번 과정을 한 번 더 수행한다.
- 이때 최단 거리 테이블이 갱신된다면 음수 간선 순환이 존재하는 것이다.



**예시 코드**

- https://www.acmicpc.net/problem/11657

```python
import sys

input = sys.stdin.readline

# 정정의 개수 n, 간선의 개수 m
n, m = map(int, input().split())

# 최단 거리 테이블 초기화 출발 노드는 1번
distance = [sys.maxsize] * (n + 1)
distance[1] = 0

is_cycle = False
edges = [tuple(map(int, input().split())) for _ in range(m)]

# n-1 회 반복
for _ in range(n - 1):
    # 모든 간선을 확인
    for edge in edges:
        (v1, v2, cost) = edge
        
        # 한번도 계산되지 않은 정점은 제외
        if distance[v1] == sys.maxsize:
            continue

        # 해당 간선을 거쳐 가는 거리가 더 작은 경우 최단 거리 테이블 갱신
        if distance[v1] + cost < distance[v2]:
            distance[v2] = distance[v1] + cost

# 가중치의 합이 음수인 사이클을 확인하는 작업
for edge in edges:
    (v1, v2, cost) = edge
    if distance[v1] == sys.maxsize:
        continue

    # 최단 거리 테이블에 변화가 생기면 가중치의 합이 음수인 사이클이 있다는 것
    if distance[v1] + cost < distance[v2]:
        is_cycle = True
        break

if is_cycle:
    print("-1")
else:
    answer = []
    for d in distance[2:]:
        if d == sys.maxsize:
            answer.append("-1")
        else:
            answer.append(str(d))
    print("\n".join(answer))
```



# 3 시간복잡도

- O(VE)
- 다익스트라 알고리즘 보다 느리다.



# 4 대표 문제

- https://www.acmicpc.net/problem/11657



참고

- https://www.youtube.com/watch?v=Ppimbaxm8d8