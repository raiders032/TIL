# 1 DFS

**백준 문제**

- [17265.나의 인생에는 수학과 함께](https://www.acmicpc.net/problem/17265)

<br>

# 2 BFS

**백준 문제**

- [1389.케빈 베이컨의 6단계 법칙](https://www.acmicpc.net/problem/1389)
- [2194.유닛 이동시키기](https://www.acmicpc.net/problem/2194)

<br>

# 3 백트래킹

**백준 문제**

- [1174.줄어드는 수](https://www.acmicpc.net/problem/1174)

<br>

# 4 DP

## 2.1 연속합

**백준 문제**

- [13398.연속합 2](https://www.acmicpc.net/problem/13398)

<br>

## 2.2 0/1 knapsack problem

**백준 문제**

- [14728.벼락치기](https://www.acmicpc.net/problem/14728), [17845.수강 과목](https://www.acmicpc.net/problem/17845)
- [17208.카우버거 알바생](https://www.acmicpc.net/problem/17208)

<br>

# 5 이분탐색

## 5.1 매개 변수 탐색

**백준 문제**

- [1300.K번째 수](https://www.acmicpc.net/problem/1300)
- [16434.드래곤 앤 던전](https://www.acmicpc.net/problem/16434)
- [17951.흩날리는 시험지 속에서 내 평점이 느껴진거야](https://www.acmicpc.net/problem/17951)

<br>

# 6 투포인터

- 배열의 길이가 n일 때 포인터를 0, 1 인덱스에 두거나 0, n-1 인덱스에 두거나 둘 다 생각해 보자

<br>

**백준 문제**

- [22945.팀 빌딩](https://www.acmicpc.net/problem/22945)
- [22862.가장 긴 짝수 연속한 부분 수열 (large)](https://www.acmicpc.net/problem/22862)

<br>

# 7 Disjoint Set

**주의**

- 그래프의 연결 요소의 수를 구할 때 Disjoint Set의 각 원소를 find 연산으로 초기화 하자.

<br>

**백준 문제**

- [20955.민서의 응급 수술](https://www.acmicpc.net/problem/20955)
  - 그래프의 연결 요소의 수를 구할 때 Disjoint Set의 각 원소를 find 연산으로 초기화 하자.

<br>

# 8 Greedy Algorithm

**백준 문제**

- [1455.뒤집기 II](https://www.acmicpc.net/problem/1455)

<br>

# 9 최단 경로

- 특정 노드에서 모든 노드의 최단 경로
	- 양의 간선만 존재 -> Dijkstra's Algorithm
	- 음의 간선이 존재 -> Bellman Ford Algorithm
- 모든 노드에서 다른 모든 노드까지의 최단 경로
	- Floyd Warshall Algorithm

<br>

## 9.1 Dijkstra's Algorithm

**백준 문제**

- [4485.녹색 옷 입은 애가 젤다지?](https://www.acmicpc.net/problem/4485)

<br>

## 9.2 Floyd Warshall Algorithm

**백준 문제**

- [21940.가운데에서 만나기](https://www.acmicpc.net/problem/21940)

<br>

## 9.3 Bellman Ford Algorithm


# 10 자료구조

## 10.1 Stack

**프로그래머스 문제**

- [수식 최대화](https://school.programmers.co.kr/learn/courses/30/lessons/67257)

<br>

**백준 문제**

- [후위 표기식](https://www.acmicpc.net/problem/1918)

<br>

## 10.2 Tree

**백준 문제**

- [중첩 집합 모델](https://www.acmicpc.net/problem/19641)

<br>

# 11 누적합

**백준 문제**

- [20002.사과나무](https://www.acmicpc.net/problem/20002)

<br>

# 12 MST

**백준 문제**

- [16202.MST 게임](https://www.acmicpc.net/problem/16202)

<br>

# 13 오일러 경로/회로

- 그래프가 하나의 컴포넌트로 구성되어 있는지 확인한다.
- 그래프의 각 정점에 대한 차수를 구한다.

|            | 오일러 회로                              | 오일러 경로                                                  |
| ---------- | ---------------------------------------- | ------------------------------------------------------------ |
| 무향그래프 | 모든 정점의 차수가 짝수이다.             | 오일러 회로이거나, 2개의 정점의 차수가 홀수이고 나머지 정점의 개수는 짝수개이다. |
| 방향그래프 | 모든 정점의 indegree와 outdegree가 같다. | 최대 1개의 정점에 대해, outdegree - indegree = 1 이고 최대 1개의 정점에 대해, indegree - outdegree = 1 이고 그 외 모든 정점은 indegree와 outdegree가 같다. |


**백준 문제**

- [16168.퍼레이드](https://www.acmicpc.net/problem/16168)

