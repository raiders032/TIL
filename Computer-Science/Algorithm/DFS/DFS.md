# 1 DFS

* Depth First Serach(깊이 우선 탐색)
* 그래프의 각 정점을 방문하는 그래프 순회 알고리즘
* 미로 찾기를 풀기 위한 전략으로 고안됨
* 일반적으로 BFS에 비해 더 널리 쓰인다



# 2 DFS의 구현

* DFS는 주로 스택으로 구현하거나 재귀로 구현된다
* BFS는 주로 큐로 구현된다
* 백트래킹을 통해 뛰어난 효용을 보인다



## 2.1 재귀 구현



**수도 코드**

```
procedure DFS(G, v) is
    label v as discovered
    for all directed edges from v to w that are in G.adjacentEdges(v) do
        if vertex w is not labeled as discovered then
            recursively call DFS(G, w)
```



## 2.2 스택 구현

```
procedure DFS_iterative(G, v) is
    let S be a stack
    S.push(v)
    while S is not empty do
        v = S.pop()
        if v is not labeled as discovered then
            label v as discovered
            for all edges from v to w in G.adjacentEdges(v) do 
                S.push(w)
```



# 3 시간 복잡도

* O(|V| + |E|)
  * V: 정점의 개수
  * E: 간선의 개수



# 4 백트래킹

* 백트래킹은 해결책에 대한 후보를 구축해 나아가다가 가능성이 없다고 판단되는 즉시 후보를 포기해 정답을 찾아가는 알고리즘