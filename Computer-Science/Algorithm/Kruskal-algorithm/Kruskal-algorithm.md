# 1 Kruskal algorithm

* 최소 비용 신장 트리를 만들기 위한 대표적인 알고리즘
* 그리디 알고리즘으로 분류된다
  *   간선의 거리가 짧은 순서대로 최소 비용 신장 트리에 추가하기 때문



# 2 동작 과정

1. 간선 데이터를 비용에 따라 오름차순 정렬한다
2. 간선을 하나씩 확인하며 현재의 간선이 사이클을 발생시키는지 확인한다
   * 간선의 연결된 두 노드에 대해서 find 연산으로 각각 루트 노드를 확인한다
   * 루트 노드가 같다면 사이클이 발생한것 이므로 해당 간선은 무시한다
   * 사이클이 발생하지 않으면 해당 간성을 최소 신장 트리에 포함시키기 위해 두 노드에 대해 union 연산을 적용한다
   * [Disjoint-Set.md](../../Data-Structure/Disjoint-Set/Disjoint-Set.md) - uinon 연산과 find 연산 참고
3. 모든 간선에 대하여 2번의 과정을 반복한다





## 2.1 사이클 발생 유무

* 사이클 발생 유무를 알기 위해 서로소 집합 자료구조를 이용한다
* [Disjoint-Set.md](../../Data-Structure/Disjoint-Set/Disjoint-Set.md) 참고



## 2.2 예제 코드

* https://www.acmicpc.net/problem/1922
* 사이클 판별을 위해 Disjoint Set 자료구조를 먼저 구현한다
  * 집합을 나타내는 disjoint_set 배열과 find, union 연산을 구현
* `V` : 정점의 개수
* `E` : 간선의 개수
* `answer` : 최소 간선의 합

```python
import sys
input = sys.stdin.readline


def find(node):
    if disjoint_set[node] != node:
        disjoint_set[node] = find(disjoint_set[node])
    return disjoint_set[node]


def union(node1, node2):
    root1 = find(node1)
    root2 = find(node2)

    if root1 <= root2:
        disjoint_set[root2] = root1
    else:
        disjoint_set[root1] = root2


V = int(input())
E = int(input())
edge = []
disjoint_set = [i for i in range(V + 1)]
for _ in range(E):
    vertex1, vertex2, weight = map(int, input().split())
    edge.append((weight, vertex1, vertex2))

# 간선의 비용을 기준으로 오름차순 정렬
edge.sort()
answer = 0
for weight, vertex1, vertex2 in edge:
  	# 루트 노드가 같으면 사이클이 발생한다는 의미
    if find(vertex1) == find(vertex2):
        continue
    # 사이클을 발생시키지 않는 최소 비용 간선을 최소 신장 트리에 포함시키기
    union(vertex1, vertex2)
    answer += weight

print(answer)
```



# 3 문제

* https://www.acmicpc.net/problem/1197



참고

* https://www.youtube.com/watch?v=LQ3JHknGy8c&list=PLRx0vPvlEmdDHxCvAQS1_6XV4deOwfVrz&index=19

