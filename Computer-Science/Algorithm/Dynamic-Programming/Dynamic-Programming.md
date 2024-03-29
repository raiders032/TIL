# 1 Dynamic Programming

> 문제를 각각의 작은 문제로 나누어 해결한 결과를 저장해뒀다가 나중에 큰 문제의 결과와 합하여 풀이하는 알고리즘이다

* Dynamic Programming으로 **최적 부분 구조(Optimal Substructure)**와  **Overlapping Subproblem**특성을 갖고 있는 문제를 풀 수 있다



# 2 Optimal Substructure

* 최적 부분 구조
* 어떠한 문제가 하위 문제의 최적 해법으로부터 큰 문제의 최적 해법을 구할 수 있을 때 Optimal Substructure를 만족한다
  * 간단히 말하면 점화식을 세울 수 있다면 Optimal Substructure를 가진다고 할 수 있다

* **Optimal Substructure**를 가진 문제는 **Dynamic Programming** 또는 **Greedy Algorithm**으로 문제를 해결할 수 있다



# 3 Overlapping Subproblem

* 큰 문제를 해결하기 위해 동일한 작은 문제가 반복적으로 나타나는 현상
* 캐싱을 통해 한 번 계산한 문제의 결과를 메모리 공간에 저장하고 다시 동일한 문제를 만나면 직접 계산하지 않고 기록된 결과를 사용



# 4 다른 알고리즘과 차이점

**Greedy Algorithm과 차이점**

* **Greedy Algorithm**은 그 **순간에 최적**이라고 생각되는 것을 선택하면서 풀이한다
* **Dynamic Programming**은 **중복된 하위 문제들(Overlapping Subproblem)**의 결과를 **저장**해뒀다가 풀이해 나간다는 차이가 있다



**분할 정복과 차이점**

* 분할 정복은 DP와 마찬가지로 최적 부분 구조를 가지는 공통점이 있으나 하위 문제가 반복되지 않는다.



**표**

| 알고리즘            | 풀이 가능한 문제의 특징              | 풀이 가능한 문제 및 알고리즘                              |
| ------------------- | ------------------------------------ | --------------------------------------------------------- |
| 다이나믹 프로그래밍 | 최적 부분 구조<br />중복된 하위 문제 | 0-1 배낭 문제<br />피보나치 수열<br />다익스트라 알고리즘 |
| 그리디 알고리즘     | 최적 부분 구조<br />탐욕 선택 속성   | 분할 가능 배낭 문제<br />다익스트라 알고리즘              |
| 분할 정복           | 최적 부분 구조                       | 병합 정렬<br />퀵 정렬                                    |



# 5 Dynamic Programming 방법론

* 방법론은 방식에 따라 크게 **상향식**과 **하향식**으로 나뉜다
* 상향식은 **타뷸레이션**, 하향식은 **메모이제이션**이라고 구분해 부르기도 한다



## 5.1 상향식(bottom-up)

* 더 작은 하위 문제부터 살펴본 다음, 작은 문제의 정답을 이용해 큰 문제의 정답을 풀어나간다
* 하향식은 **타뷸레이션**이라고 부르기도 한다
* 일반적으로 이 방식만을 다이나믹 프로그래밍이라고 지칭하기도 한다
* 보통 하향식 방식보다 빠르다



## 5.2 하향식(top-down)

* 하위 문제에 대한 정답을 계산했는지 확인해가며 문제를 자연스러운 방식으로 풀어나간다
* 이 방식을 특별히 **메모이제이션**이라 지칭한다



# 6 DP로 문제를 푸는 과정

1. 문제에 DP를 적용할 수 있는지 판단 <- 어렵다 그냥 많이 풀어보는 것이 정답이다
2. 상태와 매개변수를 결정
3. 상태 간의 관계를 정립
4. 종료조건을 결정
5. 메모이제이션 또는 타뷸레이션을 추가



# 7 Tip

1. DP 문제를 많이 풀어볼 것
2. 어떤 제약 하에 어떤 값을 최적화하는 패턴
3. 재귀 함수에 동일한 매개변수가 반복적으로 전달되는 경우
4. 그리드를 만들려고 해볼 것



# 8 대표문제



## 8.1 LCS(Longest Common Subsequence)

**관련 강의**

* https://www.youtube.com/watch?v=Ua0GhsJSlWM
* https://www.youtube.com/watch?v=sSno9rV8Rhg

**문제**

* https://www.acmicpc.net/problem/9251
* https://www.acmicpc.net/problem/1695



## 8.2 트리 DP

- 트리의 지름을 DP를 사용해서 구해보자.
- [문제](https://www.acmicpc.net/problem/1967)

> 트리의 지름이란?
>
> - 트리(tree)는 사이클이 없는 무방향 그래프이다. 
> - 트리에서는 어떤 두 노드를 선택해도 둘 사이에 경로가 항상 하나만 존재하게 된다.
> - 트리의 지름은 트리에 존재하는 모든 경로들 중에서 가장 긴 것의 길이를 말한다.



**풀이**

- 트리의 높이는 해당 노드부터 리프까지의 거리를 말한다.

```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10 ** 6)

# 높이를 구하는 top-down 방식 DP
def make_max_height(node):
    if max_height[node] != -1:
        return max_height[node]

    max_height[node] = 0
    for child, weight in tree[node]:
        max_height[node] = max(max_height[node], make_max_height(child) + weight)

    return max_height[node]


# 트리의 지름을 구하는 top-down 방식 DP
def get_tree_radius(node):
    if tree_radius[node] != -1:
        return tree_radius[node]

    tree_radius[node] = 0
    height = []
    for child, weight in tree[node]:
        # 트리의 지름은 해당 정점 node를 지나지 않는다면 서브 트리의 지름 중 가장 큰 것이다.
        tree_radius[node] = max(tree_radius[node], get_tree_radius(child))
        height.append(max_height[child] + weight)

    height.sort(reverse=True)
    # 트리의 지름은 해당 정점 node를 지난다면 해당 node를 기준으로 높이가 가장 큰 2개를 더한 것과 같다.
    tree_radius[node] = max(tree_radius[node], sum(height[:2]))

    return tree_radius[node]


N = int(input())
tree = [list() for _ in range(N + 1)]
max_height = [-1] * (N + 1) # 각 노드의 최대 높이
tree_radius = [-1] * (N + 1) # 트리의 지름
for _ in range(N - 1):
    parent, child, weight, = map(int, input().split())
    tree[parent].append((child, weight))

# 먼저 각각의 노드의 최대 높이를 구한다.
make_max_height(1)
print(get_tree_radius(1))
```



## 8.3 LIS(Longest Increasing Subsequence)



## 8.4 0/1 knapsack problem

 
