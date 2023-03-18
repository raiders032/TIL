# 1 BFS

* Breadth First Serach(너비 우선 탐색)
* 그래프의 각 정점을 방문하는 그래프 순회 알고리즘



# 2 BFS의 구현

* BFS는 주로 큐로 구현된다
* DFS는 주로 스택으로 구현하거나 재귀로 구현된다



**수도코드**

- 인접 리스트 사용시 시간 복잡도 구하기

```
   procedure BFS(G, root) is
       let Q be a queue
       label root as explored
       Q.enqueue(root)
       // 알고리즘 전체로 보면 모든 정점을 한번 방문하기 때문에 O(|V|)
       while Q is not empty do 
           v := Q.dequeue()
           if v is the goal then
               return v
           // 알고리즘 전체로 보면 간선의 개수 만큼 O(|E|)
           for all edges from v to w in G.adjacentEdges(v) do 
              if w is not labeled as explored then
                  label w as explored
                  Q.enqueue(w)
```



# 3 시간 복잡도

* 인접리스트 사용 시 O(|V| + |E|)
  * V: 정점의 개수
  * E: 간선의 개수



# 4 용도

* BFS는 그래프의 최단 경로를 구하는 문제에 사용된다
* DFS보다 쓰임새는 적지만 최단 경로를 찾는 다익스트라 알고리즘에서 매우 유용하게 쓰인다