# 1 PS 추천 문제



# 2 DP



## 2.1 연속합

**문제**

- [13398.연속합 2](https://www.acmicpc.net/problem/13398)



## 2.2 0/1 knapsack problem



**문제**

- [14728.벼락치기](https://www.acmicpc.net/problem/14728)



# 3 투포인터

- 배열의 길이가 n일 때 포인터를 0, 1 인덱스에 두거나 0, n-1 인덱스에 두거나 둘 다 생각해 보자



**문제**

- [22945.팀 빌딩](https://www.acmicpc.net/problem/22945)



# 4 Disjoint Set

**주의**

- 그래프의 연결 요소의 수를 구할 때 Disjoint Set의 각 원소를 find 연산으로 초기화 하자.



**문제**

- [20955.민서의 응급 수술](https://www.acmicpc.net/problem/20955)
  - 그래프의 연결 요소의 수를 구할 때 Disjoint Set의 각 원소를 find 연산으로 초기화 하자.



# 5 BFS

**문제**

- [1389.케빈 베이컨의 6단계 법칙](https://www.acmicpc.net/problem/1389)



# 6 최단 경로

- 특정 노드에서 모든 노드의 최단 경로
  - 양의 간선만 존재 -> Dijkstra's Algorithm
  - 음의 간선이 존재 -> Bellman Ford Algorithm
- 모든 노드에서 다른 모든 노드까지의 최단 경로
  - Floyd Warshall Algorithm



## 6.1 Dijkstra's Algorithm



**문제**

- [4485.녹색 옷 입은 애가 젤다지?](https://www.acmicpc.net/problem/4485)



# 7 이분탐색



## 7.1 매개 변수 탐색

**문제**

- [1300.K번째 수](https://www.acmicpc.net/problem/1300)



# 8 오일러 경로/회로

- 그래프가 하나의 컴포넌트로 구성되어 있는지 확인한다.
- 그래프의 각 정점에 대한 차수를 구한다.

|            | 오일러 회로                              | 오일러 경로                                                  |
| ---------- | ---------------------------------------- | ------------------------------------------------------------ |
| 무향그래프 | 모든 정점의 차수가 짝수이다.             | 오일러 회로이거나, 2개의 정점의 차수가 홀수이고 나머지 정점의 개수는 짝수개이다. |
| 방향그래프 | 모든 정점의 indegree와 outdegree가 같다. | 최대 1개의 정점에 대해, outdegree - indegree = 1 이고 최대 1개의 정점에 대해, indegree - outdegree = 1 이고 그 외 모든 정점은 indegree와 outdegree가 같다. |

 

**문제**

- [16168.퍼레이드](https://www.acmicpc.net/problem/16168)



# 9 MST



**문제**

- [16202.MST 게임](https://www.acmicpc.net/problem/16202)



# 10 Greedy Algorithm



**문제**

- [1455.뒤집기 II](https://www.acmicpc.net/problem/1455)